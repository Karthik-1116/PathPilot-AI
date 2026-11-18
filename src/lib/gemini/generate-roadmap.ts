import "server-only";

import {
  getRoadmapResponseSchema,
  roadmapContentSchema,
  roadmapDraftSchema,
  type RoadmapDraft,
} from "@/lib/roadmaps/schema";
import type { RoadmapContent } from "@/types/generated-roadmap";
import type { LearnerProfile } from "@/types/onboarding";
import { getGeminiConfig, type GeminiConfig } from "./config";
import { ROADMAP_SYSTEM_INSTRUCTION, buildRoadmapPrompt } from "./prompt";

const INVALID_RESPONSE_CORRECTION =
  "The previous response did not match the required JSON schema. Return every required field with valid values, use 4-5 concise phases, and keep descriptions within the requested limits.";

export type RoadmapGenerationErrorCode =
  | "missing_key"
  | "rate_limited"
  | "timeout"
  | "invalid_response"
  | "blocked"
  | "api_error"
  | "network";

export class RoadmapGenerationError extends Error {
  readonly code: RoadmapGenerationErrorCode;
  readonly status: number;
  readonly retryAfterSeconds?: number;

  constructor(
    code: RoadmapGenerationErrorCode,
    status: number,
    message: string,
    retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "RoadmapGenerationError";
    this.code = code;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: { parts?: GeminiPart[] };
  finishReason?: string;
}

interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  thoughtsTokenCount?: number;
  totalTokenCount?: number;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: GeminiUsageMetadata;
  error?: { code?: number; message?: string; status?: string };
}

interface GeminiAttemptResult {
  text: string;
  finishReason?: string;
  usage?: GeminiUsageMetadata;
}

type GeminiAttemptKind = "primary" | "fallback" | "repair";

interface GeminiAttempt {
  kind: GeminiAttemptKind;
  model: string;
  timeoutMs: number;
  onlyForInvalidResponse?: boolean;
}

function logGemini(event: string, data: Record<string, unknown>) {
  console.info("[roadmap-gemini]", JSON.stringify({ event, ...data }));
}

function usageCounts(usage?: GeminiUsageMetadata) {
  return {
    promptTokens: usage?.promptTokenCount ?? null,
    candidateTokens: usage?.candidatesTokenCount ?? null,
    thoughtTokens: usage?.thoughtsTokenCount ?? null,
    totalTokens: usage?.totalTokenCount ?? null,
  };
}

export async function generateRoadmap(
  profile: LearnerProfile,
): Promise<{ content: RoadmapContent; model: string }> {
  const config = getGeminiConfig();

  if (!config.configured) {
    throw new RoadmapGenerationError(
      "missing_key",
      503,
      "Roadmap generation is not configured. Add GEMINI_API_KEY to .env.local and restart the server.",
    );
  }

  const deadline = Date.now() + config.totalTimeoutMs;
  const attempts: GeminiAttempt[] = [
    {
      kind: "primary",
      model: config.model,
      timeoutMs: config.primaryTimeoutMs,
    },
  ];

  if (config.fallbackModel && config.fallbackModel !== config.model) {
    attempts.push({
      kind: "fallback",
      model: config.fallbackModel,
      timeoutMs: config.fallbackTimeoutMs,
    });
  } else {
    attempts.push({
      kind: "repair",
      model: config.model,
      timeoutMs: config.primaryTimeoutMs,
      onlyForInvalidResponse: true,
    });
  }

  let lastError: RoadmapGenerationError | null = null;
  let correction: string | undefined;

  for (const attempt of attempts) {
    if (
      attempt.onlyForInvalidResponse &&
      lastError?.code !== "invalid_response"
    ) {
      break;
    }

    const remainingMs = deadline - Date.now();

    if (remainingMs < 1_000) {
      lastError = new RoadmapGenerationError(
        "timeout",
        504,
        "Roadmap generation took too long. Please try again.",
      );
      logGemini("deadline_exceeded", {
        attempt: attempt.kind,
        model: attempt.model,
        remainingMs,
      });
      break;
    }

    const timeoutMs = Math.min(attempt.timeoutMs, remainingMs);
    const startedAt = Date.now();

    logGemini("attempt_start", {
      attempt: attempt.kind,
      model: attempt.model,
      timeoutMs,
      remainingMs,
    });

    try {
      const draft = await requestValidDraft(
        config,
        profile,
        attempt.model,
        timeoutMs,
        correction,
      );
      const content = normalizeDraft(draft, profile);
      const validatedContent = roadmapContentSchema.safeParse(content);

      if (!validatedContent.success) {
        logGemini("content_invalid", {
          attempt: attempt.kind,
          model: attempt.model,
          issueCount: validatedContent.error.issues.length,
          issues: validatedContent.error.issues.slice(0, 4).map((issue) => ({
            code: issue.code,
            path: issue.path.join("."),
          })),
        });

        throw new RoadmapGenerationError(
          "invalid_response",
          502,
          "Gemini returned a roadmap that did not match the expected structure. Please try again.",
        );
      }

      logGemini("attempt_end", {
        attempt: attempt.kind,
        model: attempt.model,
        durationMs: Date.now() - startedAt,
        ok: true,
      });

      return { content: validatedContent.data, model: attempt.model };
    } catch (error) {
      const generationError =
        error instanceof RoadmapGenerationError
          ? error
          : new RoadmapGenerationError(
              "network",
              503,
              "Could not reach Gemini. Check your connection and try again.",
            );

      lastError = generationError;

      logGemini("attempt_end", {
        attempt: attempt.kind,
        model: attempt.model,
        durationMs: Date.now() - startedAt,
        ok: false,
        code: generationError.code,
        status: generationError.status,
      });

      if (!shouldFallback(generationError)) break;

      correction =
        generationError.code === "invalid_response"
          ? INVALID_RESPONSE_CORRECTION
          : undefined;
    }
  }

  throw (
    lastError ??
    new RoadmapGenerationError(
      "timeout",
      504,
      "Roadmap generation took too long. Please try again.",
    )
  );
}

function shouldFallback(error: RoadmapGenerationError) {
  return error.code !== "missing_key" && error.code !== "blocked";
}

async function requestValidDraft(
  config: GeminiConfig,
  profile: LearnerProfile,
  model: string,
  timeoutMs: number,
  correction?: string,
) {
  const raw = await requestGemini(
    config,
    buildRoadmapPrompt(profile, correction),
    model,
    timeoutMs,
  );

  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJson(raw.text));
  } catch {
    logGemini("invalid_json", {
      model,
      textLength: raw.text.length,
    });

    throw new RoadmapGenerationError(
      "invalid_response",
      502,
      "Gemini returned an unreadable roadmap. Please try again.",
    );
  }

  const draft = roadmapDraftSchema.safeParse(parsed);

  if (!draft.success) {
    logGemini("invalid_schema", {
      model,
      issueCount: draft.error.issues.length,
      issues: draft.error.issues.slice(0, 4).map((issue) => ({
        code: issue.code,
        path: issue.path.join("."),
      })),
    });

    throw new RoadmapGenerationError(
      "invalid_response",
      502,
      "Gemini returned a roadmap that did not match the expected structure. Please try again.",
    );
  }

  return draft.data;
}

async function requestGemini(
  config: GeminiConfig,
  prompt: string,
  model: string,
  timeoutMs: number,
): Promise<GeminiAttemptResult> {
  const controller = new AbortController();
  const startedAt = Date.now();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${config.baseUrl}/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": config.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: ROADMAP_SYSTEM_INSTRUCTION }],
          },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: getRoadmapResponseSchema(),
            maxOutputTokens: 16384,
            thinkingConfig: {
              thinkingLevel: "low",
            },
          },
        }),
        cache: "no-store",
        signal: controller.signal,
      },
    );

    const payload = (await response
      .json()
      .catch(() => null)) as GeminiResponse | null;
    const durationMs = Date.now() - startedAt;
    const finishReason = payload?.candidates?.[0]?.finishReason;

    logGemini("provider_response", {
      model,
      durationMs,
      providerStatus: response.status,
      finishReason: finishReason ?? null,
      promptChars: prompt.length,
      ...usageCounts(payload?.usageMetadata),
    });

    if (!response.ok) {
      logGemini("provider_error", {
        model,
        durationMs,
        providerStatus: response.status,
        providerStatusText: payload?.error?.status ?? null,
        providerMessage: payload?.error?.message?.slice(0, 300) ?? null,
      });

      throw toApiError(response);
    }

    const text =
      payload?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      if (payload?.promptFeedback?.blockReason) {
        throw new RoadmapGenerationError(
          "blocked",
          422,
          "Gemini could not generate this roadmap. Try adjusting your goal or profile, then retry.",
        );
      }

      if (finishReason === "MAX_TOKENS") {
        throw new RoadmapGenerationError(
          "invalid_response",
          502,
          "The generated roadmap was cut off. Please try again.",
        );
      }

      throw new RoadmapGenerationError(
        "invalid_response",
        502,
        "Gemini returned an empty roadmap. Please try again.",
      );
    }

    return { text, finishReason, usage: payload?.usageMetadata };
  } catch (error) {
    if (error instanceof RoadmapGenerationError) throw error;

    const durationMs = Date.now() - startedAt;

    if (controller.signal.aborted) {
      logGemini("timeout", { model, timeoutMs, durationMs });

      throw new RoadmapGenerationError(
        "timeout",
        504,
        "Roadmap generation took too long. Please try again.",
      );
    }

    logGemini("network_error", {
      model,
      durationMs,
      errorName: error instanceof Error ? error.name : "unknown",
    });

    throw new RoadmapGenerationError(
      "network",
      503,
      "Could not reach Gemini. Check your connection and try again.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

function toApiError(response: Response) {
  if (response.status === 429) {
    const retryAfter = Number.parseInt(
      response.headers.get("retry-after") ?? "",
      10,
    );

    return new RoadmapGenerationError(
      "rate_limited",
      429,
      "Gemini is receiving too many requests right now. Wait a moment, then try again.",
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
    );
  }

  if (response.status === 400 || response.status === 403) {
    return new RoadmapGenerationError(
      "api_error",
      502,
      "Gemini rejected the request. Check that GEMINI_API_KEY, GEMINI_MODEL, and GEMINI_FALLBACK_MODEL are valid, then retry.",
    );
  }

  if (response.status === 404) {
    return new RoadmapGenerationError(
      "api_error",
      502,
      "The configured Gemini model was not found. Update GEMINI_MODEL or GEMINI_FALLBACK_MODEL in .env.local, then retry.",
    );
  }

  if (response.status >= 500) {
    return new RoadmapGenerationError(
      "api_error",
      503,
      "Gemini is temporarily unavailable. Please try again.",
    );
  }

  return new RoadmapGenerationError(
    "api_error",
    502,
    "Gemini could not complete the request. Please try again.",
  );
}

function extractJson(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  return fenced ? fenced[1] : trimmed;
}

function normalizeDraft(
  draft: RoadmapDraft,
  profile: LearnerProfile,
): RoadmapContent {
  const phases = draft.phases.map((phase, phaseIndex) => ({
    id: `phase-${phaseIndex + 1}`,
    title: phase.title,
    summary: phase.summary,
    durationWeeks: phase.durationWeeks,
    estimatedHours: phase.estimatedHours,
    difficulty: phase.difficulty,
    objectives: phase.objectives,
    topics: phase.topics.map((topic, topicIndex) => ({
      id: `phase-${phaseIndex + 1}-topic-${topicIndex + 1}`,
      title: topic.title,
      subtopics: topic.subtopics,
    })),
    assignments: phase.assignments.map((assignment, assignmentIndex) => ({
      id: `phase-${phaseIndex + 1}-assignment-${assignmentIndex + 1}`,
      title: assignment.title,
      description: assignment.description,
    })),
    miniProjects: phase.miniProjects.map((project, projectIndex) => ({
      id: `phase-${phaseIndex + 1}-project-${projectIndex + 1}`,
      title: project.title,
      description: project.description,
      deliverables: project.deliverables,
    })),
    resources: phase.resources.map((resource, resourceIndex) => ({
      id: `phase-${phaseIndex + 1}-resource-${resourceIndex + 1}`,
      title: resource.title,
      provider: resource.provider,
      type: resource.type,
      url: resource.url,
    })),
    prerequisites: phase.prerequisites,
  }));

  const totalHours = phases.reduce(
    (total, phase) => total + phase.estimatedHours,
    0,
  );
  const phaseWeeks = phases.reduce(
    (total, phase) => total + phase.durationWeeks,
    0,
  );
  const minimumWeeks = Math.ceil(totalHours / profile.weeklyHours);
  const durationWeeks = Math.max(
    draft.durationWeeks,
    phaseWeeks,
    minimumWeeks,
  );

  if (durationWeeks > 104) {
    throw new RoadmapGenerationError(
      "invalid_response",
      502,
      "The generated plan is longer than 104 weeks. Increase your weekly hours or narrow your goal, then retry.",
    );
  }

  return {
    title: draft.title,
    summary: draft.summary,
    durationWeeks,
    totalHours,
    phases,
  };
}

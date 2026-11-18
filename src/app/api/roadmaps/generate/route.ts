import { NextResponse } from "next/server";
import { generateRoadmap, RoadmapGenerationError } from "@/lib/gemini/generate-roadmap";
import { isGeminiConfigured } from "@/lib/gemini/config";
import { getOnboardingErrorMessage } from "@/lib/onboarding";
import {
  ROADMAP_PROMPT_VERSION,
  getProfileFingerprint,
  getRoadmapErrorMessage,
} from "@/lib/roadmaps";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getLearnerProfile } from "@/lib/supabase/learner-profile";
import {
  countRoadmapsSince,
  getLatestRoadmap,
  insertRoadmap,
} from "@/lib/supabase/roadmaps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const COOLDOWN_MS = 30_000;
const activeGenerations = new Set<string>();

function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    { error: { code, message }, ...extra },
    { status },
  );
}

function getDailyLimit() {
  const parsed = Number.parseInt(
    process.env.ROADMAP_DAILY_LIMIT ?? "10",
    10,
  );

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const logStage = (stage: string, data?: Record<string, unknown>) => {
    console.info(
      "[roadmap-route]",
      JSON.stringify({
        requestId,
        stage,
        durationMs: Date.now() - startedAt,
        ...data,
      }),
    );
  };
  const respondError = (
    status: number,
    code: string,
    message: string,
    extra?: Record<string, unknown>,
  ) => {
    logStage("end", { status, code });
    return jsonError(status, code, message, extra);
  };

  logStage("start", { supabaseConfigured: isSupabaseConfigured });

  if (!isSupabaseConfigured) {
    return respondError(
      503,
      "supabase_unconfigured",
      "Supabase is not configured. Add the Supabase environment variables and restart the server.",
    );
  }

  const user = await getCurrentUser();
  logStage("auth", { authenticated: Boolean(user) });

  if (!user) {
    return respondError(
      401,
      "unauthorized",
      "You need to log in before generating a roadmap.",
    );
  }

  if (!isGeminiConfigured()) {
    return respondError(
      503,
      "missing_key",
      "Roadmap generation is not configured. Add GEMINI_API_KEY to .env.local and restart the server.",
    );
  }

  let force = false;

  try {
    const body = (await request.json()) as { force?: unknown };
    force = body?.force === true;
  } catch {
    force = false;
  }

  const { profile, error: profileError } = await getLearnerProfile(user.id);
  logStage("profile", {
    hasProfile: Boolean(profile),
    onboardingCompleted: profile?.onboardingCompleted ?? false,
  });

  if (profileError) {
    return respondError(
      503,
      "profile_unavailable",
      getOnboardingErrorMessage(profileError),
    );
  }

  if (!profile?.onboardingCompleted || !profile.targetRole) {
    return respondError(
      409,
      "onboarding_incomplete",
      "Complete onboarding before generating a roadmap.",
    );
  }

  const { roadmap: latest, error: latestError } = await getLatestRoadmap(
    user.id,
  );
  logStage("latest", { hasLatest: Boolean(latest) });

  if (latestError) {
    return respondError(
      503,
      "roadmap_unavailable",
      getRoadmapErrorMessage(latestError),
    );
  }

  const fingerprint = getProfileFingerprint(profile);

  if (latest && latest.profileFingerprint === fingerprint && !force) {
    return respondError(
      409,
      "already_generated",
      "A roadmap already exists for this profile. Open it, update your profile, or choose regenerate.",
      { existingRoadmapId: latest.id },
    );
  }

  if (latest) {
    const elapsed = Date.now() - new Date(latest.createdAt).getTime();

    if (elapsed < COOLDOWN_MS) {
      return respondError(
        429,
        "cooldown",
        "A roadmap was just generated. Wait a few seconds before trying again.",
        {
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((COOLDOWN_MS - elapsed) / 1000),
          ),
        },
      );
    }
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await countRoadmapsSince(
    user.id,
    since,
  );
  logStage("count", { count });

  if (countError) {
    return respondError(
      503,
      "roadmap_unavailable",
      getRoadmapErrorMessage(countError),
    );
  }

  if (count >= getDailyLimit()) {
    return respondError(
      429,
      "daily_limit",
      "You have reached the daily roadmap generation limit. Try again tomorrow.",
    );
  }

  if (activeGenerations.has(user.id)) {
    return respondError(
      409,
      "generation_in_progress",
      "A roadmap is already being generated. Wait for it to finish.",
    );
  }

  activeGenerations.add(user.id);
  logStage("gemini_start", { force });

  try {
    const { content, model } = await generateRoadmap(profile);
    logStage("gemini_done", { model });

    const { roadmap, error: insertError } = await insertRoadmap({
      user_id: user.id,
      title: content.title,
      goal: profile.targetRole,
      experience_level: profile.experienceLevel,
      weekly_hours: profile.weeklyHours,
      current_skills: profile.currentSkills,
      duration_weeks: content.durationWeeks,
      phase_count: content.phases.length,
      profile_fingerprint: fingerprint,
      ai_model: model,
      prompt_version: ROADMAP_PROMPT_VERSION,
      content,
    });

    if (insertError || !roadmap) {
      return respondError(
        503,
        "roadmap_save_failed",
        getRoadmapErrorMessage(insertError),
      );
    }

    logStage("insert", { roadmapId: roadmap.id });
    logStage("end", { status: 201, code: "created" });

    return NextResponse.json(
      { roadmapId: roadmap.id },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof RoadmapGenerationError) {
      return respondError(error.status, error.code, error.message, {
        ...(error.retryAfterSeconds
          ? { retryAfterSeconds: error.retryAfterSeconds }
          : {}),
      });
    }

    logStage("unexpected_error", {
      errorName: error instanceof Error ? error.name : "unknown",
    });

    return respondError(
      500,
      "unexpected_error",
      "Roadmap generation failed unexpectedly. Please try again.",
    );
  } finally {
    activeGenerations.delete(user.id);
  }
}

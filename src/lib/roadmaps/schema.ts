import { z } from "zod";

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const idSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes.");

export const roadmapDifficultySchema = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
]);

export const roadmapResourceTypeSchema = z.enum([
  "documentation",
  "course",
  "article",
  "video",
  "practice",
]);

export const roadmapResourceDraftSchema = z.object({
  title: z.string().trim().min(3).max(140),
  provider: z.string().trim().min(2).max(80),
  type: roadmapResourceTypeSchema,
  url: z
    .string()
    .trim()
    .max(500)
    .refine(isHttpsUrl, "Use a valid HTTPS URL."),
});

export const roadmapTopicDraftSchema = z.object({
  title: z.string().trim().min(3).max(140),
  subtopics: z
    .array(z.string().trim().min(2).max(140))
    .min(2)
    .max(5),
});

export const roadmapAssignmentDraftSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(20).max(600),
});

export const roadmapMiniProjectDraftSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(30).max(800),
  deliverables: z
    .array(z.string().trim().min(3).max(160))
    .min(2)
    .max(5),
});

export const roadmapPhaseDraftSchema = z.object({
  title: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(30).max(600),
  durationWeeks: z.number().int().min(1).max(20),
  estimatedHours: z.number().int().min(1).max(240),
  difficulty: roadmapDifficultySchema,
  objectives: z
    .array(z.string().trim().min(5).max(240))
    .min(3)
    .max(6),
  topics: z.array(roadmapTopicDraftSchema).min(3).max(8),
  assignments: z.array(roadmapAssignmentDraftSchema).min(2).max(5),
  miniProjects: z.array(roadmapMiniProjectDraftSchema).min(1).max(2),
  resources: z.array(roadmapResourceDraftSchema).min(2).max(5),
  prerequisites: z
    .array(z.string().trim().min(2).max(140))
    .max(4),
});

export const roadmapDraftSchema = z.object({
  title: z.string().trim().min(4).max(100),
  summary: z.string().trim().min(40).max(800),
  durationWeeks: z.number().int().min(4).max(104),
  phases: z.array(roadmapPhaseDraftSchema).min(4).max(8),
});

export const roadmapTopicContentSchema = roadmapTopicDraftSchema.extend({
  id: idSchema,
});

export const roadmapAssignmentContentSchema =
  roadmapAssignmentDraftSchema.extend({
    id: idSchema,
  });

export const roadmapMiniProjectContentSchema =
  roadmapMiniProjectDraftSchema.extend({
    id: idSchema,
  });

export const roadmapResourceContentSchema =
  roadmapResourceDraftSchema.extend({
    id: idSchema,
  });

export const roadmapPhaseContentSchema = roadmapPhaseDraftSchema.extend({
  id: idSchema,
  topics: z.array(roadmapTopicContentSchema).min(3).max(8),
  assignments: z.array(roadmapAssignmentContentSchema).min(2).max(5),
  miniProjects: z.array(roadmapMiniProjectContentSchema).min(1).max(2),
  resources: z.array(roadmapResourceContentSchema).min(2).max(5),
});

export const roadmapContentSchema = roadmapDraftSchema.extend({
  totalHours: z.number().int().min(1).max(5000),
  phases: z.array(roadmapPhaseContentSchema).min(4).max(8),
});

export type RoadmapDraft = z.infer<typeof roadmapDraftSchema>;

function sanitizeGeminiSchema(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeGeminiSchema);
  }

  if (!value || typeof value !== "object") return value;

  const result: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(value)) {
    if (
      key === "$schema" ||
      key === "additionalProperties" ||
      key === "maxItems"
    ) {
      continue;
    }

    result[key] = sanitizeGeminiSchema(child);
  }

  return result;
}

export function getRoadmapResponseSchema() {
  return sanitizeGeminiSchema(
    z.toJSONSchema(roadmapDraftSchema, {
      target: "draft-7",
      io: "output",
    }),
  ) as Record<string, unknown>;
}

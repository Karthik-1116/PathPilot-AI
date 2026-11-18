import "server-only";

import { createHash } from "node:crypto";
import { isExperienceLevel } from "@/lib/onboarding";
import { roadmapContentSchema } from "@/lib/roadmaps/schema";
import type {
  GeneratedRoadmap,
  RoadmapContent,
  RoadmapPhase,
  RoadmapRow,
  RoadmapSummary,
  RoadmapSummaryRow,
} from "@/types/generated-roadmap";
import type { LearnerProfile } from "@/types/onboarding";

export const ROADMAP_PROMPT_VERSION = "phase5-v2";

function normalizeWeeklyHours(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 10;

  return Math.min(40, Math.max(1, Math.round(value)));
}

export function getProfileFingerprint(profile: LearnerProfile) {
  const normalized = JSON.stringify({
    goal: profile.targetRole.trim().toLowerCase(),
    experience: profile.experienceLevel.toLowerCase(),
    weeklyHours: normalizeWeeklyHours(profile.weeklyHours),
    skills: profile.currentSkills
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean)
      .sort(),
  });

  return createHash("sha256").update(normalized).digest("hex");
}

export function mapRoadmapRow(row: RoadmapRow): GeneratedRoadmap | null {
  const content = roadmapContentSchema.safeParse(row.content);

  if (!content.success) return null;

  return {
    id: row.id,
    title: row.title,
    goal: row.goal,
    experienceLevel: isExperienceLevel(row.experience_level)
      ? row.experience_level
      : "Beginner",
    weeklyHours: normalizeWeeklyHours(row.weekly_hours),
    currentSkills: Array.isArray(row.current_skills)
      ? row.current_skills.filter(
          (skill): skill is string => typeof skill === "string",
        )
      : [],
    durationWeeks: row.duration_weeks ?? content.data.durationWeeks,
    phaseCount: row.phase_count ?? content.data.phases.length,
    profileFingerprint: row.profile_fingerprint,
    aiModel: row.ai_model,
    promptVersion: row.prompt_version,
    content: content.data,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRoadmapSummaryRow(
  row: RoadmapSummaryRow,
): RoadmapSummary {
  return {
    id: row.id,
    title: row.title,
    goal: row.goal,
    experienceLevel: isExperienceLevel(row.experience_level)
      ? row.experience_level
      : "Beginner",
    weeklyHours: normalizeWeeklyHours(row.weekly_hours),
    durationWeeks: row.duration_weeks ?? 0,
    phaseCount: row.phase_count ?? 0,
    profileFingerprint: row.profile_fingerprint,
    aiModel: row.ai_model,
    promptVersion: row.prompt_version,
    createdAt: row.created_at,
  };
}

export function getRoadmapPhases(
  content: RoadmapContent,
  completedPhaseIds: string[] = [],
): RoadmapPhase[] {
  const completed = new Set(completedPhaseIds);
  let currentAssigned = false;

  return content.phases.map((phase) => {
    if (completed.has(phase.id)) {
      return { ...phase, status: "completed" };
    }

    if (!currentAssigned) {
      currentAssigned = true;
      return { ...phase, status: "current" };
    }

    return { ...phase, status: "upcoming" };
  });
}

export function getRoadmapErrorMessage(
  error: { code?: string; message?: string } | null | undefined,
) {
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();

  if (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("roadmaps") ||
    (message.includes("relation") && message.includes("does not exist"))
  ) {
    return "The roadmap table is missing. Run supabase/migrations/0003_roadmaps.sql in the Supabase SQL Editor, then try again.";
  }

  if (
    code === "42501" ||
    message.includes("row-level security") ||
    message.includes("permission denied")
  ) {
    return "Your session cannot save this roadmap. Log out, log in again, and retry.";
  }

  if (message.includes("failed to fetch") || message.includes("network")) {
    return "Could not reach Supabase. Check your connection and try again.";
  }

  return "Could not load or save your roadmap. Please try again.";
}

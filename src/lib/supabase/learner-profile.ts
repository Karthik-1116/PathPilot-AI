import "server-only";

import { cache } from "react";
import { isExperienceLevel } from "@/lib/onboarding";
import type { LearnerProfile, LearnerProfileRow } from "@/types/onboarding";
import { createClient } from "./server";

const learnerProfileColumns =
  "target_role, experience_level, weekly_hours, current_skills, onboarding_completed, onboarding_completed_at";

function normalizeWeeklyHours(value: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 10;

  return Math.min(40, Math.max(1, Math.round(value)));
}

export function mapLearnerProfileRow(row: LearnerProfileRow): LearnerProfile {
  return {
    targetRole: (row.target_role ?? "").trim(),
    experienceLevel: isExperienceLevel(row.experience_level)
      ? row.experience_level
      : "Beginner",
    weeklyHours: normalizeWeeklyHours(row.weekly_hours),
    currentSkills: Array.isArray(row.current_skills)
      ? row.current_skills.filter((skill): skill is string => typeof skill === "string")
      : [],
    onboardingCompleted: row.onboarding_completed === true,
    onboardingCompletedAt: row.onboarding_completed_at ?? null,
  };
}

export const getLearnerProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learner_profiles")
    .select(learnerProfileColumns)
    .eq("id", userId)
    .maybeSingle();

  return {
    profile: data ? mapLearnerProfileRow(data as LearnerProfileRow) : null,
    error,
  };
});

import "server-only";

import { cache } from "react";
import type {
  GeneratedRoadmap,
  RoadmapContent,
  RoadmapRow,
  RoadmapSummaryRow,
} from "@/types/generated-roadmap";
import type { ExperienceLevel } from "@/types/onboarding";
import {
  ROADMAP_PROMPT_VERSION,
  mapRoadmapRow,
  mapRoadmapSummaryRow,
} from "@/lib/roadmaps";
import { createClient } from "./server";

const roadmapColumns =
  "id, user_id, title, goal, experience_level, weekly_hours, current_skills, duration_weeks, phase_count, profile_fingerprint, ai_model, prompt_version, content, created_at, updated_at";

const roadmapSummaryColumns =
  "id, title, goal, experience_level, weekly_hours, duration_weeks, phase_count, profile_fingerprint, ai_model, prompt_version, created_at";

export interface RoadmapInsert {
  user_id: string;
  title: string;
  goal: string;
  experience_level: ExperienceLevel;
  weekly_hours: number;
  current_skills: string[];
  duration_weeks: number;
  phase_count: number;
  profile_fingerprint: string;
  ai_model: string;
  prompt_version: string;
  content: RoadmapContent;
}

export const getLatestRoadmap = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roadmaps")
    .select(roadmapColumns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    roadmap: data ? mapRoadmapRow(data as RoadmapRow) : null,
    error,
  };
});

export const getRoadmapById = cache(
  async (userId: string, roadmapId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("roadmaps")
      .select(roadmapColumns)
      .eq("user_id", userId)
      .eq("id", roadmapId)
      .maybeSingle();

    return {
      roadmap: data ? mapRoadmapRow(data as RoadmapRow) : null,
      error,
    };
  },
);

export const getRoadmapHistory = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roadmaps")
    .select(roadmapSummaryColumns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    roadmaps: (data ?? []).map((row) =>
      mapRoadmapSummaryRow(row as RoadmapSummaryRow),
    ),
    error,
  };
});

export async function countRoadmapsSince(userId: string, sinceIso: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("roadmaps")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", sinceIso);

  return { count: count ?? 0, error };
}

export async function insertRoadmap(input: RoadmapInsert): Promise<{
  roadmap: GeneratedRoadmap | null;
  error: { code?: string; message?: string } | null;
}> {
  const supabase = await createClient();
  const startedAt = Date.now();
  const { data, error } = await supabase
    .from("roadmaps")
    .insert({
      ...input,
      prompt_version: input.prompt_version || ROADMAP_PROMPT_VERSION,
    })
    .select(roadmapColumns)
    .single();

  console.info(
    "[roadmap-supabase]",
    JSON.stringify({
      event: "insert",
      durationMs: Date.now() - startedAt,
      ok: !error,
      code: error?.code ?? null,
    }),
  );

  return {
    roadmap: data ? mapRoadmapRow(data as RoadmapRow) : null,
    error,
  };
}

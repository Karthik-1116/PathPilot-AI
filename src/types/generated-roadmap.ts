import type { ExperienceLevel } from "@/types/onboarding";

export type RoadmapPhaseStatus = "completed" | "current" | "upcoming";

export type RoadmapResourceType =
  | "documentation"
  | "course"
  | "article"
  | "video"
  | "practice";

export type RoadmapDifficulty = ExperienceLevel;

export interface RoadmapTopic {
  id: string;
  title: string;
  subtopics: string[];
}

export interface RoadmapAssignment {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapMiniProject {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface RoadmapResource {
  id: string;
  title: string;
  provider: string;
  type: RoadmapResourceType;
  url: string;
}

export interface RoadmapPhaseContent {
  id: string;
  title: string;
  summary: string;
  durationWeeks: number;
  estimatedHours: number;
  difficulty: RoadmapDifficulty;
  objectives: string[];
  topics: RoadmapTopic[];
  assignments: RoadmapAssignment[];
  miniProjects: RoadmapMiniProject[];
  resources: RoadmapResource[];
  prerequisites: string[];
}

export interface RoadmapPhase extends RoadmapPhaseContent {
  status: RoadmapPhaseStatus;
}

export interface RoadmapContent {
  title: string;
  summary: string;
  durationWeeks: number;
  totalHours: number;
  phases: RoadmapPhaseContent[];
}

export interface GeneratedRoadmap {
  id: string;
  title: string;
  goal: string;
  experienceLevel: ExperienceLevel;
  weeklyHours: number;
  currentSkills: string[];
  durationWeeks: number;
  phaseCount: number;
  profileFingerprint: string;
  aiModel: string;
  promptVersion: string;
  content: RoadmapContent;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapSummary {
  id: string;
  title: string;
  goal: string;
  experienceLevel: ExperienceLevel;
  weeklyHours: number;
  durationWeeks: number;
  phaseCount: number;
  profileFingerprint: string;
  aiModel: string;
  promptVersion: string;
  createdAt: string;
}

export interface RoadmapRow {
  id: string;
  user_id: string;
  title: string;
  goal: string;
  experience_level: string | null;
  weekly_hours: number | null;
  current_skills: string[] | null;
  duration_weeks: number | null;
  phase_count: number | null;
  profile_fingerprint: string;
  ai_model: string;
  prompt_version: string;
  content: unknown;
  created_at: string;
  updated_at: string;
}

export interface RoadmapSummaryRow {
  id: string;
  title: string;
  goal: string;
  experience_level: string | null;
  weekly_hours: number | null;
  duration_weeks: number | null;
  phase_count: number | null;
  profile_fingerprint: string;
  ai_model: string;
  prompt_version: string;
  created_at: string;
}

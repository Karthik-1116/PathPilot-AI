export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export interface LearnerProfile {
  targetRole: string;
  experienceLevel: ExperienceLevel;
  weeklyHours: number;
  currentSkills: string[];
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
}

export interface LearnerProfileRow {
  target_role: string | null;
  experience_level: string | null;
  weekly_hours: number | null;
  current_skills: string[] | null;
  onboarding_completed: boolean | null;
  onboarding_completed_at: string | null;
}

export interface LearnerProfilePayload {
  id: string;
  target_role: string;
  experience_level: ExperienceLevel;
  weekly_hours: number;
  current_skills: string[];
  onboarding_completed: boolean;
  onboarding_completed_at: string;
}

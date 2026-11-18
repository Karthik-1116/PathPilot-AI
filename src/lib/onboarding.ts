import type {
  ExperienceLevel,
  LearnerProfile,
  LearnerProfilePayload,
} from "@/types/onboarding";

export const MIN_WEEKLY_HOURS = 1;
export const MAX_WEEKLY_HOURS = 40;
export const MAX_SKILLS = 20;

export const onboardingSteps = [
  {
    id: "goal",
    label: "Goal",
    title: "What do you want to become?",
    description:
      "Pick the role you are working toward. This anchors every stage of your roadmap.",
  },
  {
    id: "experience",
    label: "Level",
    title: "Where are you starting from?",
    description:
      "Choose the level that best matches your experience. Honest answers keep your plan useful.",
  },
  {
    id: "skills",
    label: "Skills",
    title: "What can you already do?",
    description:
      "Select any skills you are comfortable with. Starting from scratch is a valid answer.",
  },
  {
    id: "time",
    label: "Time",
    title: "How much time can you commit?",
    description:
      "Set a weekly study budget you can sustain even on a busy week.",
  },
  {
    id: "review",
    label: "Review",
    title: "Review your learner profile",
    description:
      "Check the details below before saving. You can update them at any time.",
  },
] as const;

export type OnboardingStepId = (typeof onboardingSteps)[number]["id"];

export interface OnboardingDraft {
  targetRole: string;
  experienceLevel: ExperienceLevel;
  currentSkills: string[];
  weeklyHours: number;
}

export const emptyOnboardingDraft: OnboardingDraft = {
  targetRole: "",
  experienceLevel: "Beginner",
  currentSkills: [],
  weeklyHours: 10,
};

export const targetRoleOptions: { value: string; description: string }[] = [
  {
    value: "AI Engineer",
    description: "Machine learning, LLMs, and applied AI systems.",
  },
  {
    value: "Full-Stack Developer",
    description: "Interfaces, APIs, and databases end to end.",
  },
  {
    value: "Data Analyst",
    description: "SQL, spreadsheets, dashboards, and insights.",
  },
  {
    value: "Frontend Developer",
    description: "Accessible interfaces and modern web apps.",
  },
  {
    value: "Backend Developer",
    description: "APIs, data models, and server-side systems.",
  },
  {
    value: "DevOps Engineer",
    description: "Cloud infrastructure, automation, and delivery.",
  },
  {
    value: "Mobile Developer",
    description: "Native or cross-platform mobile apps.",
  },
  {
    value: "Cybersecurity Analyst",
    description: "Threat detection, hardening, and response.",
  },
];

export const experienceLevelOptions: {
  value: ExperienceLevel;
  description: string;
}[] = [
  {
    value: "Beginner",
    description: "New to the field or still building the fundamentals.",
  },
  {
    value: "Intermediate",
    description: "Comfortable with the basics and some real projects.",
  },
  {
    value: "Advanced",
    description: "Working professionally or shipping complex projects.",
  },
];

export const suggestedSkills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "SQL",
  "Git",
  "HTML & CSS",
  "Java",
  "C++",
  "Data analysis",
  "Machine learning",
  "Docker",
  "Cloud basics",
  "UI/UX design",
];

export const weeklyHourPresets = [5, 10, 15, 20];

export function getStudyIntensity(hours: number) {
  if (hours <= 4) {
    return {
      label: "Light",
      description:
        "A gentle pace that fits around a heavy course load or part-time work.",
    };
  }

  if (hours <= 9) {
    return {
      label: "Steady",
      description:
        "Enough for consistent weekly progress without burning out.",
    };
  }

  if (hours <= 19) {
    return {
      label: "Focused",
      description:
        "A solid commitment that can move through stages at a healthy pace.",
    };
  }

  return {
    label: "Intensive",
    description:
      "A fast track. Keep an eye on rest so the plan stays sustainable.",
  };
}

export function getInitialDraft(profile: LearnerProfile | null): OnboardingDraft {
  if (!profile) {
    return { ...emptyOnboardingDraft, currentSkills: [] };
  }

  return {
    targetRole: profile.targetRole,
    experienceLevel: profile.experienceLevel,
    currentSkills: [...profile.currentSkills],
    weeklyHours: profile.weeklyHours,
  };
}

export function validateOnboardingStep(
  step: OnboardingStepId,
  draft: OnboardingDraft,
) {
  if (step === "goal") {
    const role = draft.targetRole.trim();

    if (role.length < 2) {
      return "Choose a target role or enter your own goal.";
    }

    if (role.length > 80) {
      return "Keep your goal to 80 characters or fewer.";
    }
  }

  if (step === "time") {
    if (!Number.isInteger(draft.weeklyHours)) {
      return "Enter whole hours per week.";
    }

    if (
      draft.weeklyHours < MIN_WEEKLY_HOURS ||
      draft.weeklyHours > MAX_WEEKLY_HOURS
    ) {
      return `Choose between ${MIN_WEEKLY_HOURS} and ${MAX_WEEKLY_HOURS} hours per week.`;
    }
  }

  return null;
}

export function normalizeSkill(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function hasSkill(skills: string[], skill: string) {
  const target = normalizeSkill(skill).toLowerCase();

  return skills.some((item) => item.toLowerCase() === target);
}

export function toggleSkill(skills: string[], skill: string) {
  const normalized = normalizeSkill(skill);

  if (!normalized) return skills;

  if (hasSkill(skills, normalized)) {
    return skills.filter(
      (item) => item.toLowerCase() !== normalized.toLowerCase(),
    );
  }

  if (skills.length >= MAX_SKILLS) return skills;

  return [...skills, normalized];
}

export function buildLearnerProfilePayload(
  userId: string,
  draft: OnboardingDraft,
): LearnerProfilePayload {
  return {
    id: userId,
    target_role: draft.targetRole.trim(),
    experience_level: draft.experienceLevel,
    weekly_hours: Math.round(draft.weeklyHours),
    current_skills: draft.currentSkills.slice(0, MAX_SKILLS),
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
  };
}

export function isExperienceLevel(value: unknown): value is ExperienceLevel {
  return experienceLevelOptions.some((option) => option.value === value);
}

export function getOnboardingErrorMessage(
  error: { code?: string; message?: string } | null | undefined,
) {
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();

  if (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("learner_profiles") ||
    (message.includes("relation") && message.includes("does not exist"))
  ) {
    return "The learner profile table is missing. Run supabase/migrations/0002_onboarding.sql in the Supabase SQL Editor, then try again.";
  }

  if (
    code === "42501" ||
    message.includes("row-level security") ||
    message.includes("permission denied")
  ) {
    return "Your session cannot update this profile. Log out, log in again, and retry.";
  }

  if (message.includes("failed to fetch") || message.includes("network")) {
    return "Could not reach Supabase. Check your connection and try again.";
  }

  return "Could not save your learner profile. Please try again.";
}

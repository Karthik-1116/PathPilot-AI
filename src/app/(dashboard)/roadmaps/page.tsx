import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  FolderOpen,
  Gauge,
  History,
  Pencil,
  Sparkles,
  Target,
} from "lucide-react";
import { DataWarning } from "@/components/dashboard/data-warning";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileChangedNotice } from "@/components/roadmaps/profile-changed-notice";
import {
  GenerateRoadmapButton,
  RegenerateRoadmapButton,
} from "@/components/roadmaps/roadmap-generation-controls";
import { RoadmapHistory } from "@/components/roadmaps/roadmap-history";
import { RoadmapSummaryCard } from "@/components/roadmaps/roadmap-summary-card";
import { buttonStyles } from "@/components/ui/button";
import { requireDashboardUser } from "@/lib/dashboard";
import {
  getProfileFingerprint,
  getRoadmapPhases,
} from "@/lib/roadmaps";
import {
  getLatestRoadmap,
  getRoadmapHistory,
} from "@/lib/supabase/roadmaps";

export const metadata: Metadata = {
  title: "My Roadmap",
  robots: { index: false, follow: false },
};

const buildSteps = [
  {
    icon: Sparkles,
    title: "Personalized phases",
    description: "Your goal, level, skills, and available hours shape the plan.",
  },
  {
    icon: FolderOpen,
    title: "Projects and resources",
    description: "Every phase includes practice work and curated learning links.",
  },
  {
    icon: History,
    title: "Version history",
    description: "Regenerating creates a new plan without deleting the old one.",
  },
];

export default async function RoadmapsPage() {
  const { user, learnerProfile, learnerError } = await requireDashboardUser();

  const [{ roadmap: latest, error: latestError }, { roadmaps, error: historyError }] =
    await Promise.all([getLatestRoadmap(user.id), getRoadmapHistory(user.id)]);

  const dataError = Boolean(latestError || historyError);
  const goal = learnerProfile?.targetRole || "your target role";
  const experience = learnerProfile?.experienceLevel ?? "Beginner";
  const weeklyHours = learnerProfile?.weeklyHours ?? 10;
  const profileChanged = Boolean(
    latest &&
      learnerProfile &&
      getProfileFingerprint(learnerProfile) !== latest.profileFingerprint,
  );
  const phases = latest ? getRoadmapPhases(latest.content) : [];
  const previousRoadmaps = latest
    ? roadmaps.filter((roadmap) => roadmap.id !== latest.id)
    : roadmaps;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My roadmap"
        title="Roadmap workspace"
        description={
          latest
            ? "Your current AI-built learning plan, its phase details, and every previous version."
            : "Generate a phase-by-phase learning plan built from your goal, current skills, and weekly study time."
        }
      >
        <Link
          href="/onboarding"
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          <Pencil aria-hidden="true" className="size-3.5" />
          Edit learner profile
        </Link>
        {latest && !dataError ? <RegenerateRoadmapButton /> : null}
      </PageHeader>

      {learnerError ? (
        <DataWarning
          title="Learner profile data unavailable"
          migration="supabase/migrations/0002_onboarding.sql"
        />
      ) : null}

      {dataError ? (
        <DataWarning
          title="Roadmap data unavailable"
          migration="supabase/migrations/0003_roadmaps.sql"
        />
      ) : null}

      {learnerProfile ? (
        <div className="rounded-card border border-line bg-surface p-5 shadow-card">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Current learner profile
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
              <Target aria-hidden="true" className="size-3.5 text-accent" />
              {learnerProfile.targetRole || "Goal not set"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
              <Gauge aria-hidden="true" className="size-3.5 text-accent" />
              {learnerProfile.experienceLevel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
              <Clock aria-hidden="true" className="size-3.5 text-accent" />
              {learnerProfile.weeklyHours} hrs/week
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
              <BookOpen aria-hidden="true" className="size-3.5 text-accent" />
              {learnerProfile.currentSkills.length} skills
            </span>
          </div>
        </div>
      ) : null}

      {!dataError && profileChanged ? <ProfileChangedNotice /> : null}

      {!dataError && latest ? (
        <>
          <RoadmapSummaryCard roadmap={latest} phases={phases} />
          <RoadmapHistory roadmaps={previousRoadmaps} />
        </>
      ) : null}

      {!dataError && !latest ? (
        <>
          <EmptyState
            icon={Sparkles}
            title="Ready to build your roadmap?"
            description={`PathPilot will use ${goal}, your ${experience.toLowerCase()} experience, and ${weeklyHours} weekly study hours to design a complete plan.`}
          >
            <GenerateRoadmapButton />
            <Link
              href="/onboarding"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              Review learner profile
            </Link>
          </EmptyState>

          <div className="grid gap-4 sm:grid-cols-3">
            {buildSteps.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-card border border-line bg-surface p-5 shadow-card"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <p className="mt-3 text-sm font-medium text-ink">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

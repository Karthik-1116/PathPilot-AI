import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Gauge,
  Pencil,
  Route,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { DataWarning } from "@/components/dashboard/data-warning";
import { InfoCard } from "@/components/dashboard/info-card";
import { QuickAction } from "@/components/dashboard/quick-action";
import { StatCard } from "@/components/dashboard/stat-card";
import { GenerateRoadmapButton } from "@/components/roadmaps/roadmap-generation-controls";
import { RoadmapPhaseStatusBadge } from "@/components/roadmaps/roadmap-phase-status";
import { requireDashboardUser } from "@/lib/dashboard";
import { formatRoadmapDate } from "@/lib/format";
import { getRoadmapPhases } from "@/lib/roadmaps";
import { getLatestRoadmap } from "@/lib/supabase/roadmaps";

export const metadata: Metadata = {
  title: "Overview",
  robots: { index: false, follow: false },
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function DashboardOverviewPage() {
  const {
    user,
    learnerProfile,
    learnerError,
    profileError,
    displayName,
  } = await requireDashboardUser();
  const { roadmap: latestRoadmap, error: roadmapError } =
    await getLatestRoadmap(user.id);

  const goal = learnerProfile?.targetRole || "Not set";
  const experience = learnerProfile?.experienceLevel ?? "Beginner";
  const weeklyHours = learnerProfile?.weeklyHours ?? 10;
  const skills = learnerProfile?.currentSkills ?? [];
  const roadmapPhases = latestRoadmap
    ? getRoadmapPhases(latestRoadmap.content)
    : [];
  const currentPhase = roadmapPhases.find(
    (phase) => phase.status === "current",
  );

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-accent-soft blur-3xl"
        />
        <div className="relative">
          <Badge tone="accent" dot>
            Phase 5 · AI roadmap
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
            Welcome back, {displayName}.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
            {latestRoadmap
              ? "Your personalized roadmap is ready. Pick up the current phase, review its projects, or regenerate the plan from an updated profile."
              : "Your onboarding profile is saved. Generate your first AI-built roadmap, then work through phases with projects and curated resources."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {latestRoadmap ? (
              <Link
                href={`/roadmaps/${latestRoadmap.id}`}
                className={buttonStyles({ size: "md" })}
              >
                <Route aria-hidden="true" className="size-4" />
                Open current roadmap
              </Link>
            ) : roadmapError ? (
              <Link
                href="/roadmaps"
                className={buttonStyles({ size: "md" })}
              >
                <Route aria-hidden="true" className="size-4" />
                View roadmap workspace
              </Link>
            ) : (
              <GenerateRoadmapButton />
            )}
            <Link
              href="/onboarding"
              className={buttonStyles({ variant: "secondary", size: "md" })}
            >
              <Pencil aria-hidden="true" className="size-4" />
              Update learning profile
            </Link>
          </div>
        </div>
      </section>

      {learnerError ? (
        <DataWarning
          title="Learner profile data unavailable"
          migration="supabase/migrations/0002_onboarding.sql"
        />
      ) : null}

      {profileError ? (
        <DataWarning
          title="Profile data unavailable"
          migration="supabase/migrations/0001_profiles.sql"
        />
      ) : null}

      {roadmapError ? (
        <DataWarning
          title="Roadmap data unavailable"
          migration="supabase/migrations/0003_roadmaps.sql"
        />
      ) : null}

      <section aria-labelledby="onboarding-heading">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2
              id="onboarding-heading"
              className="text-lg font-semibold tracking-[-0.02em] text-ink"
            >
              Your learning profile
            </h2>
            <p className="mt-1 text-sm text-muted">
              The details that will shape your roadmap.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="shrink-0 text-xs font-medium text-accent hover:text-accent-hover"
          >
            Edit
          </Link>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <InfoCard icon={Target} label="Learning goal" value={goal} />
          <InfoCard
            icon={Gauge}
            label="Experience level"
            value={experience}
          />
          <InfoCard
            icon={Clock}
            label="Weekly study hours"
            value={`${weeklyHours} hrs/week`}
          />
        </div>
      </section>

      <section aria-labelledby="stats-heading">
        <h2
          id="stats-heading"
          className="text-lg font-semibold tracking-[-0.02em] text-ink"
        >
          Learning statistics
        </h2>
        <p className="mt-1 text-sm text-muted">
          Only real data is shown. Progress metrics start once roadmap topics
          can be completed.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Sparkles}
            label="Skills in profile"
            value={`${skills.length}`}
            hint={
              skills.length > 0
                ? "Saved during onboarding"
                : "No skills selected yet"
            }
          />
          <StatCard
            icon={Route}
            label="Roadmap status"
            value={latestRoadmap ? "Active" : "Not generated"}
            hint={
              latestRoadmap
                ? `${latestRoadmap.phaseCount} phases · ${latestRoadmap.durationWeeks} weeks`
                : "Generate a plan with Gemini"
            }
          />
          <StatCard
            icon={CheckCircle2}
            label="Topics completed"
            value="—"
            hint="Tracking arrives with roadmap stages"
          />
          <StatCard
            icon={Activity}
            label="Weekly activity"
            value="No data"
            hint="Starts when topics can be completed"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section
          aria-labelledby="activity-heading"
          className="rounded-card border border-line bg-surface p-6 shadow-card lg:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4 text-accent" />
              <h2
                id="activity-heading"
                className="text-lg font-semibold tracking-[-0.02em] text-ink"
              >
                Weekly activity
              </h2>
            </div>
            <Badge>Not tracked yet</Badge>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map((day) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-full items-end justify-center rounded-lg border border-dashed border-line bg-canvas/60 sm:h-24">
                  <span aria-hidden="true" className="mb-2 text-[10px] text-muted">
                    —
                  </span>
                </div>
                <span className="text-[11px] text-muted">{day}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-muted">
            No study activity yet. Daily focus time will appear here once
            roadmap topics can be completed.
          </p>
        </section>

        <section
          aria-labelledby="actions-heading"
          className="rounded-card border border-line bg-surface p-6 shadow-card"
        >
          <h2
            id="actions-heading"
            className="text-lg font-semibold tracking-[-0.02em] text-ink"
          >
            Quick actions
          </h2>
          <div className="mt-4 space-y-2">
            <QuickAction
              href="/onboarding"
              icon={Pencil}
              title="Update learning profile"
              description="Change your goal, skills, or weekly hours."
            />
            <QuickAction
              href="/roadmaps"
              icon={Route}
              title={
                latestRoadmap
                  ? "Open roadmap workspace"
                  : "Generate your roadmap"
              }
              description={
                latestRoadmap
                  ? "Review your current plan and previous versions."
                  : "Turn your learner profile into a phase-by-phase plan."
              }
            />
            <QuickAction
              href="/resources"
              icon={BookOpen}
              title="Browse resources"
              description={
                latestRoadmap
                  ? "Open the resource library from your current roadmap."
                  : "Resources appear after roadmap generation."
              }
            />
            <QuickAction
              href="/profile"
              icon={UserRound}
              title="Profile and account"
              description="Review your account and sign out."
            />
          </div>
        </section>
      </div>

      <section className="rounded-card border border-line bg-surface p-6 shadow-card">
        {latestRoadmap ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Route aria-hidden="true" className="size-4 text-accent" />
                  <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
                    Your current roadmap
                  </h2>
                </div>
                <p className="mt-2 text-lg font-medium tracking-[-0.02em] text-ink">
                  {latestRoadmap.title}
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                  {latestRoadmap.content.summary}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {latestRoadmap.durationWeeks} weeks ·{" "}
                  {latestRoadmap.phaseCount} phases · Generated{" "}
                  {formatRoadmapDate(latestRoadmap.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={`/roadmaps/${latestRoadmap.id}`}
                  className={buttonStyles({ size: "sm" })}
                >
                  Open full roadmap
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  href="/roadmaps"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  All roadmaps
                </Link>
              </div>
            </div>

            {currentPhase ? (
              <div className="rounded-xl border border-accent/15 bg-accent-soft/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                    Current focus
                  </p>
                  <RoadmapPhaseStatusBadge status={currentPhase.status} />
                </div>
                <p className="mt-2 text-sm font-medium text-ink">
                  {currentPhase.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  {currentPhase.summary}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Route aria-hidden="true" className="size-4 text-accent" />
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
                  Your roadmap
                </h2>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                No roadmap has been generated yet. Gemini will use your{" "}
                <span className="font-medium text-ink">{goal}</span> goal and{" "}
                <span className="font-medium text-ink">
                  {weeklyHours} weekly hours
                </span>{" "}
                to build a phase-by-phase plan.
              </p>
            </div>
            {roadmapError ? (
              <Link
                href="/roadmaps"
                className={buttonStyles({
                  variant: "secondary",
                  size: "sm",
                  className: "shrink-0",
                })}
              >
                View roadmap workspace
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : (
              <GenerateRoadmapButton
                size="sm"
                className="shrink-0"
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}

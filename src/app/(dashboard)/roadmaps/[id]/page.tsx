import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Gauge,
  Route,
  Sparkles,
  Target,
} from "lucide-react";
import { DataWarning } from "@/components/dashboard/data-warning";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileChangedNotice } from "@/components/roadmaps/profile-changed-notice";
import { RegenerateRoadmapButton } from "@/components/roadmaps/roadmap-generation-controls";
import {
  RoadmapPhaseNav,
  RoadmapTimeline,
} from "@/components/roadmaps/roadmap-timeline";
import { buttonStyles } from "@/components/ui/button";
import { requireDashboardUser } from "@/lib/dashboard";
import { formatRoadmapDate } from "@/lib/format";
import {
  getProfileFingerprint,
  getRoadmapPhases,
} from "@/lib/roadmaps";
import { getRoadmapById } from "@/lib/supabase/roadmaps";

export const metadata: Metadata = {
  title: "Roadmap",
  robots: { index: false, follow: false },
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!uuidPattern.test(id)) {
    notFound();
  }

  const { user, learnerProfile } = await requireDashboardUser();
  const { roadmap, error } = await getRoadmapById(user.id, id);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Personalized roadmap"
          title="Roadmap unavailable"
          description="The roadmap could not be loaded from Supabase."
        >
          <Link
            href="/roadmaps"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            All roadmaps
          </Link>
        </PageHeader>
        <DataWarning
          title="Roadmap data unavailable"
          migration="supabase/migrations/0003_roadmaps.sql"
        />
      </div>
    );
  }

  if (!roadmap) {
    notFound();
  }

  const phases = getRoadmapPhases(roadmap.content);
  const profileChanged = Boolean(
    learnerProfile &&
      getProfileFingerprint(learnerProfile) !== roadmap.profileFingerprint,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Personalized roadmap"
        title={roadmap.title}
        description={roadmap.content.summary}
      >
        <Link
          href="/roadmaps"
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          All roadmaps
        </Link>
        <RegenerateRoadmapButton />
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
          <Target aria-hidden="true" className="size-3.5 text-accent" />
          {roadmap.goal}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
          <Gauge aria-hidden="true" className="size-3.5 text-accent" />
          {roadmap.experienceLevel}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
          <Clock aria-hidden="true" className="size-3.5 text-accent" />
          {roadmap.weeklyHours} hrs/week
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
          <Route aria-hidden="true" className="size-3.5 text-accent" />
          {roadmap.durationWeeks} weeks · {roadmap.phaseCount} phases
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
          <CalendarDays aria-hidden="true" className="size-3.5 text-accent" />
          {formatRoadmapDate(roadmap.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
          <Sparkles aria-hidden="true" className="size-3.5 text-accent" />
          {roadmap.aiModel}
        </span>
      </div>

      {profileChanged ? <ProfileChangedNotice /> : null}

      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <RoadmapPhaseNav phases={phases} />
        <RoadmapTimeline phases={phases} />
      </div>

      <div className="rounded-card border border-line bg-surface p-5 text-sm leading-6 text-muted shadow-card">
        This roadmap is a saved snapshot of your learner profile. Edit your
        profile, then regenerate to create a new plan.{" "}
        <Link
          href="/onboarding"
          className="font-medium text-accent hover:text-accent-hover"
        >
          Update your learner profile
        </Link>
        .
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Progress",
  robots: { index: false, follow: false },
};

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Progress"
        title="Learning progress"
        description="Completed topics, weekly focus time, and project milestones will be tracked here once your roadmap is active."
      />

      <EmptyState
        icon={TrendingUp}
        title="No progress to show yet"
        description="Progress tracking, charts, and streaks arrive in Phase 7. They need completed roadmap topics before there is anything to measure."
      >
        <Badge>Progress tracking · Phase 7</Badge>
        <Link
          href="/dashboard"
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          Back to overview
        </Link>
      </EmptyState>

      <div className="rounded-card border border-line bg-surface p-6 shadow-card">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
          How progress will be measured
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
          <li>Topics marked complete inside your roadmap stages.</li>
          <li>Weekly study time compared with your chosen hours.</li>
          <li>Projects and practice work completed along the way.</li>
        </ul>
        <p className="mt-3 text-xs leading-5 text-muted">
          No placeholder numbers are shown, so every metric you see will be
          real.
        </p>
      </div>
    </div>
  );
}

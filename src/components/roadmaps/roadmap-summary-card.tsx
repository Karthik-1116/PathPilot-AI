import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Gauge,
  Route,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { formatRoadmapDate } from "@/lib/format";
import type {
  GeneratedRoadmap,
  RoadmapPhase,
} from "@/types/generated-roadmap";
import {
  RoadmapPhaseMarker,
  RoadmapPhaseStatusBadge,
} from "./roadmap-phase-status";

interface RoadmapSummaryCardProps {
  roadmap: GeneratedRoadmap;
  phases: RoadmapPhase[];
}

export function RoadmapSummaryCard({
  roadmap,
  phases,
}: RoadmapSummaryCardProps) {
  return (
    <article className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div className="border-b border-line p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="accent" dot>
            Current roadmap
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            Generated {formatRoadmapDate(roadmap.createdAt)}
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink">
          {roadmap.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          {roadmap.content.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
            <Target aria-hidden="true" className="size-3.5 text-accent" />
            {roadmap.goal}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
            <Gauge aria-hidden="true" className="size-3.5 text-accent" />
            {roadmap.experienceLevel}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
            <Clock aria-hidden="true" className="size-3.5 text-accent" />
            {roadmap.weeklyHours} hrs/week
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
            <Route aria-hidden="true" className="size-3.5 text-accent" />
            {roadmap.durationWeeks} weeks · {roadmap.phaseCount} phases
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={`/roadmaps/${roadmap.id}`}
            className={buttonStyles({ size: "sm" })}
          >
            Open full roadmap
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <Sparkles aria-hidden="true" className="size-3.5 text-accent" />
            Generated with {roadmap.aiModel}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Phase overview
        </p>
        <ol className="mt-3 grid gap-2 lg:grid-cols-2">
          {phases.map((phase, index) => (
            <li key={phase.id}>
              <Link
                href={`/roadmaps/${roadmap.id}#phase-${phase.id}`}
                className="flex items-start gap-3 rounded-xl border border-line bg-canvas/50 p-3 transition-colors hover:border-line-strong hover:bg-canvas"
              >
                <RoadmapPhaseMarker
                  status={phase.status}
                  index={index}
                  className="size-7 text-[10px]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">
                    Phase {String(index + 1).padStart(2, "0")} ·{" "}
                    {phase.durationWeeks} weeks
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-ink">
                    {phase.title}
                  </span>
                </span>
                <RoadmapPhaseStatusBadge status={phase.status} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

import Link from "next/link";
import { ArrowUpRight, Clock, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRoadmapDate } from "@/lib/format";
import type { RoadmapSummary } from "@/types/generated-roadmap";

interface RoadmapHistoryProps {
  roadmaps: RoadmapSummary[];
}

export function RoadmapHistory({ roadmaps }: RoadmapHistoryProps) {
  if (roadmaps.length === 0) return null;

  return (
    <section aria-labelledby="roadmap-history-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="roadmap-history-heading"
            className="text-lg font-semibold tracking-[-0.02em] text-ink"
          >
            Previous roadmaps
          </h2>
          <p className="mt-1 text-sm text-muted">
            Older plans are preserved so you can compare how your direction
            changes.
          </p>
        </div>
        <Badge>{roadmaps.length} saved</Badge>
      </div>

      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {roadmaps.map((roadmap) => (
          <li key={roadmap.id}>
            <Link
              href={`/roadmaps/${roadmap.id}`}
              className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 shadow-card transition-colors hover:border-line-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                    {formatRoadmapDate(roadmap.createdAt)}
                  </p>
                  <h3 className="mt-1 text-base font-semibold tracking-[-0.02em] text-ink">
                    {roadmap.title}
                  </h3>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>

              <p className="mt-2 text-sm leading-6 text-muted">
                {roadmap.goal}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Route aria-hidden="true" className="size-3.5 text-accent" />
                  {roadmap.phaseCount} phases
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden="true" className="size-3.5 text-accent" />
                  {roadmap.durationWeeks} weeks
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

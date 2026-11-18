import {
  Check,
  Clock,
  Info,
  Lock,
  Sparkles,
  TrendingUp,
  Waypoints,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sampleRoadmap } from "@/lib/demo-roadmap";
import { cn } from "@/lib/utils";

type PreviewStatus = "complete" | "current" | "next" | "locked";

const previewStages: {
  title: string;
  meta: string;
  status: PreviewStatus;
}[] = [
  {
    title: "Python Foundations",
    meta: "Completed · 4 topics",
    status: "complete",
  },
  {
    title: "Data Analysis",
    meta: "In progress · NumPy & Pandas",
    status: "current",
  },
  {
    title: "Mathematics for AI",
    meta: "Up next · 4 weeks",
    status: "next",
  },
  {
    title: "Deep Learning",
    meta: "Locked · 8 weeks",
    status: "locked",
  },
];

const weeklyBars = ["h-2", "h-4", "h-3", "h-5", "h-4", "h-6", "h-3"];

function StageIcon({ status }: { status: PreviewStatus }) {
  if (status === "complete") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
        <Check aria-hidden="true" className="size-3.5" />
      </span>
    );
  }

  if (status === "current") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent-soft">
        <span className="size-2 rounded-full bg-accent" />
      </span>
    );
  }

  if (status === "locked") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-canvas text-muted">
        <Lock aria-hidden="true" className="size-3" />
      </span>
    );
  }

  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line">
      <span className="size-2 rounded-full bg-line-strong" />
    </span>
  );
}

export function HeroRoadmapPreview() {
  return (
    <div className="mx-auto w-full max-w-[30rem] lg:max-w-none">
      <div className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Waypoints aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold tracking-tight text-ink">
                AI Engineer roadmap
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Beginner · 2 hrs/day
              </p>
            </div>
          </div>
          <Badge tone="warning">Sample</Badge>
        </div>

        <div className="mt-5 rounded-2xl bg-canvas/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-ink">
              Overall progress
            </span>
            <span className="font-mono text-xs font-medium text-accent">
              {sampleRoadmap.progress}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.08]">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${sampleRoadmap.progress}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {sampleRoadmap.completedTopicCount} of {sampleRoadmap.topicCount}{" "}
            topics · 2 of 5 stages
          </p>
        </div>

        <ul className="mt-4 space-y-1">
          {previewStages.map((stage) => (
            <li
              key={stage.title}
              className={cn(
                "flex items-center gap-3 rounded-xl px-2 py-2.5",
                stage.status === "current" && "bg-accent-soft/60",
              )}
            >
              <StageIcon status={stage.status} />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-[13px] font-medium",
                    stage.status === "locked" ? "text-muted" : "text-ink",
                  )}
                >
                  {stage.title}
                </p>
                <p className="truncate text-[11px] text-muted">{stage.meta}</p>
              </div>
              {stage.status === "current" ? (
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent">
                  Now
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-accent/15 bg-accent-soft/70 p-3.5">
          <Sparkles
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-accent"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
              Next up
            </p>
            <p className="mt-0.5 truncate text-sm font-medium text-ink">
              Linear algebra essentials
            </p>
            <p className="text-xs text-muted">25 min · Mathematics for AI</p>
          </div>
          <Clock
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-accent/60"
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">
              <TrendingUp aria-hidden="true" className="size-3 text-success" />
              This week
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold tracking-tight text-ink">
              6h 20m
            </p>
          </div>

          <div className="flex h-6 w-28 items-end gap-1" aria-hidden="true">
            {weeklyBars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={cn(
                  "w-full rounded-sm",
                  height,
                  index === weeklyBars.length - 1
                    ? "bg-accent"
                    : "bg-accent/20",
                )}
              />
            ))}
          </div>

          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
              Streak
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold tracking-tight text-ink">
              4 days
            </p>
          </div>
        </div>
      </div>

      <p className="mt-7 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
        <Info aria-hidden="true" className="size-3 shrink-0" />
        Illustrative preview. Your roadmap is generated from your profile.
      </p>
    </div>
  );
}

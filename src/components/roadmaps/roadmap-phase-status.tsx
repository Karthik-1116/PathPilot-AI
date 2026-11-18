import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { roadmapPhaseStatusLabels } from "@/lib/roadmap-display";
import type { RoadmapPhaseStatus } from "@/types/generated-roadmap";
import { cn } from "@/lib/utils";

export function RoadmapPhaseStatusBadge({
  status,
}: {
  status: RoadmapPhaseStatus;
}) {
  if (status === "completed") {
    return (
      <Badge tone="success">
        <Check aria-hidden="true" className="size-3" />
        {roadmapPhaseStatusLabels[status]}
      </Badge>
    );
  }

  if (status === "current") {
    return (
      <Badge tone="accent" dot>
        {roadmapPhaseStatusLabels[status]}
      </Badge>
    );
  }

  return <Badge tone="neutral">{roadmapPhaseStatusLabels[status]}</Badge>;
}

export function RoadmapPhaseMarker({
  status,
  index,
  className,
}: {
  status: RoadmapPhaseStatus;
  index: number;
  className?: string;
}) {
  if (status === "completed") {
    return (
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full bg-success-soft text-success",
          className,
        )}
      >
        <Check aria-hidden="true" className="size-4" />
      </span>
    );
  }

  if (status === "current") {
    return (
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent-soft",
          className,
        )}
      >
        <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-canvas font-mono text-[11px] text-muted",
        className,
      )}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

import { AlertTriangle } from "lucide-react";
import { RegenerateRoadmapButton } from "./roadmap-generation-controls";

export function ProfileChangedNotice() {
  return (
    <div className="rounded-card border border-warning/20 bg-warning-soft p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
          <AlertTriangle aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-warning">
            Your learner profile changed
          </p>
          <p className="mt-1 text-xs leading-5 text-warning">
            This roadmap was built from an earlier goal, skill set, or weekly
            schedule. Regenerate it to align the plan with your current
            profile. The existing roadmap stays in your history.
          </p>
        </div>
        <RegenerateRoadmapButton className="shrink-0" />
      </div>
    </div>
  );
}

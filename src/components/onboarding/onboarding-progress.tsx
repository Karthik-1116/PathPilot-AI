import { Check } from "lucide-react";
import { onboardingSteps } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export function OnboardingProgress({ currentStep }: { currentStep: number }) {
  const total = onboardingSteps.length;
  const progress = Math.round(((currentStep + 1) / total) * 100);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          Step {currentStep + 1} of {total}
        </p>
        <p className="text-xs text-muted">{progress}% complete</p>
      </div>

      <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
        {onboardingSteps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.id} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border font-mono text-[11px] font-medium",
                  isComplete && "border-success/20 bg-success-soft text-success",
                  isCurrent && "border-accent/25 bg-accent-soft text-accent",
                  !isComplete &&
                    !isCurrent &&
                    "border-line bg-canvas text-muted",
                )}
              >
                {isComplete ? (
                  <Check aria-hidden="true" className="size-3" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "text-xs",
                  isCurrent ? "font-medium text-ink" : "text-muted",
                )}
              >
                {step.label}
              </span>
              {index < total - 1 ? (
                <span
                  aria-hidden="true"
                  className="ml-0.5 h-px w-3 bg-line sm:w-5"
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

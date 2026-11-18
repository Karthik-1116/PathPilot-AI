"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  ChartColumn,
  Check,
  Clock,
  Cloud,
  Code2,
  Compass,
  Gauge,
  Layers,
  ListChecks,
  Loader2,
  MonitorSmartphone,
  Pencil,
  Plus,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Target,
  type LucideIcon,
} from "lucide-react";
import { FormError, FormSuccess } from "@/components/auth/form-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MAX_SKILLS,
  MAX_WEEKLY_HOURS,
  MIN_WEEKLY_HOURS,
  buildLearnerProfilePayload,
  experienceLevelOptions,
  getInitialDraft,
  getOnboardingErrorMessage,
  getStudyIntensity,
  hasSkill,
  onboardingSteps,
  suggestedSkills,
  targetRoleOptions,
  toggleSkill,
  validateOnboardingStep,
  weeklyHourPresets,
  type OnboardingDraft,
  type OnboardingStepId,
} from "@/lib/onboarding";
import { getBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { LearnerProfile } from "@/types/onboarding";
import { OnboardingProgress } from "./onboarding-progress";
import { SelectionCard } from "./selection-card";

const inputClasses =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/60 focus:border-accent/60 focus:ring-4 focus:ring-accent/10";

const roleIcons: Record<string, LucideIcon> = {
  "AI Engineer": BrainCircuit,
  "Full-Stack Developer": Layers,
  "Data Analyst": ChartColumn,
  "Frontend Developer": MonitorSmartphone,
  "Backend Developer": Server,
  "DevOps Engineer": Cloud,
  "Mobile Developer": Smartphone,
  "Cybersecurity Analyst": ShieldCheck,
};

const experienceIcons: Record<LearnerProfile["experienceLevel"], LucideIcon> = {
  Beginner: Sprout,
  Intermediate: Gauge,
  Advanced: Rocket,
};

const stepIcons: Record<OnboardingStepId, LucideIcon> = {
  goal: Target,
  experience: Gauge,
  skills: Code2,
  time: Clock,
  review: ListChecks,
};

function ReviewRow({
  label,
  onEdit,
  children,
}: {
  label: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-surface p-4">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          {label}
        </p>
        <div className="mt-1 text-sm text-ink">{children}</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="shrink-0 px-2.5"
      >
        <Pencil aria-hidden="true" className="size-3.5" />
        Edit
      </Button>
    </div>
  );
}

export function OnboardingWizard({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: LearnerProfile | null;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<OnboardingDraft>(() =>
    getInitialDraft(initialProfile),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [customSkill, setCustomSkill] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const step = onboardingSteps[stepIndex];
  const isLastStep = stepIndex === onboardingSteps.length - 1;
  const intensity = getStudyIntensity(draft.weeklyHours);
  const allSkills = Array.from(
    new Set([...suggestedSkills, ...draft.currentSkills]),
  );
  const StepIcon = stepIcons[step.id];

  function updateDraft(patch: Partial<OnboardingDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function goToStep(next: number) {
    setError(null);
    setStepIndex(
      Math.min(onboardingSteps.length - 1, Math.max(0, next)),
    );
  }

  function handleContinue() {
    const validationError = validateOnboardingStep(step.id, draft);

    if (validationError) {
      setError(validationError);
      return;
    }

    goToStep(stepIndex + 1);
  }

  function handleAddSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const skill = customSkill.trim();

    if (!skill) return;

    if (skill.length > 40) {
      setError("Keep skill names to 40 characters or fewer.");
      return;
    }

    if (hasSkill(draft.currentSkills, skill)) {
      setError(`"${skill}" is already selected.`);
      return;
    }

    if (draft.currentSkills.length >= MAX_SKILLS) {
      setError(`You can select up to ${MAX_SKILLS} skills.`);
      return;
    }

    updateDraft({ currentSkills: [...draft.currentSkills, skill] });
    setCustomSkill("");
    setError(null);
  }

  async function handleFinish() {
    for (let index = 0; index < onboardingSteps.length; index += 1) {
      const validationError = validateOnboardingStep(
        onboardingSteps[index].id,
        draft,
      );

      if (validationError) {
        goToStep(index);
        setError(validationError);
        return;
      }
    }

    const supabase = getBrowserClient();

    if (!supabase) {
      setError(
        "Supabase is not configured. Add your project URL and anon key to .env.local, then restart the dev server.",
      );
      return;
    }

    setPending(true);
    setError(null);

    const { error: saveError } = await supabase
      .from("learner_profiles")
      .upsert(buildLearnerProfilePayload(userId, draft), {
        onConflict: "id",
      });

    if (saveError) {
      setPending(false);
      setError(getOnboardingErrorMessage(saveError));
      return;
    }

    router.replace("/dashboard?onboarding=complete");
    router.refresh();
  }

  function renderStep() {
    if (step.id === "goal") {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {targetRoleOptions.map((option) => {
              const Icon = roleIcons[option.value] ?? Compass;

              return (
                <SelectionCard
                  key={option.value}
                  selected={draft.targetRole === option.value}
                  title={option.value}
                  description={option.description}
                  icon={<Icon aria-hidden="true" className="size-4" />}
                  onSelect={() => {
                    updateDraft({ targetRole: option.value });
                    setError(null);
                  }}
                />
              );
            })}
          </div>

          <div>
            <label
              htmlFor="target-role"
              className="block text-sm font-medium text-ink"
            >
              Or type your own goal
            </label>
            <input
              id="target-role"
              type="text"
              value={draft.targetRole}
              onChange={(event) => {
                updateDraft({ targetRole: event.target.value });
                setError(null);
              }}
              placeholder="e.g. Game developer"
              maxLength={80}
              className={cn(inputClasses, "mt-1.5")}
            />
            <p className="mt-1.5 text-xs text-muted">
              Selecting a card fills this in. You can shorten or rewrite it.
            </p>
          </div>
        </div>
      );
    }

    if (step.id === "experience") {
      return (
        <div className="grid gap-3">
          {experienceLevelOptions.map((option) => {
            const Icon = experienceIcons[option.value];

            return (
              <SelectionCard
                key={option.value}
                selected={draft.experienceLevel === option.value}
                title={option.value}
                description={option.description}
                icon={<Icon aria-hidden="true" className="size-4" />}
                onSelect={() => {
                  updateDraft({ experienceLevel: option.value });
                  setError(null);
                }}
              />
            );
          })}
        </div>
      );
    }

    if (step.id === "skills") {
      return (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => {
              const selected = hasSkill(draft.currentSkills, skill);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    updateDraft({
                      currentSkills: toggleSkill(draft.currentSkills, skill),
                    });
                    setError(null);
                  }}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selected
                      ? "border-accent/20 bg-accent-soft text-accent"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
                  )}
                >
                  {selected ? (
                    <Check aria-hidden="true" className="size-3.5" />
                  ) : (
                    <Plus aria-hidden="true" className="size-3.5" />
                  )}
                  {skill}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleAddSkill}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="flex-1">
              <label htmlFor="custom-skill" className="sr-only">
                Add a skill
              </label>
              <input
                id="custom-skill"
                type="text"
                value={customSkill}
                onChange={(event) => setCustomSkill(event.target.value)}
                placeholder="Add another skill"
                maxLength={40}
                className={inputClasses}
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              disabled={
                !customSkill.trim() ||
                draft.currentSkills.length >= MAX_SKILLS
              }
            >
              Add skill
            </Button>
          </form>

          <p className="text-xs leading-5 text-muted">
            {draft.currentSkills.length} of {MAX_SKILLS} selected. No skills
            yet? Leave this empty and start from the fundamentals.
          </p>
        </div>
      );
    }

    if (step.id === "time") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-canvas/60 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                  Weekly study budget
                </p>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-[-0.04em] text-ink">
                    {draft.weeklyHours}
                  </span>
                  <span className="text-sm text-muted">hours per week</span>
                </p>
              </div>
              <Badge tone="accent">{intensity.label}</Badge>
            </div>

            <label htmlFor="weekly-hours" className="sr-only">
              Hours per week
            </label>
            <input
              id="weekly-hours"
              type="range"
              min={MIN_WEEKLY_HOURS}
              max={MAX_WEEKLY_HOURS}
              step={1}
              value={draft.weeklyHours}
              onChange={(event) => {
                updateDraft({ weeklyHours: Number(event.target.value) });
                setError(null);
              }}
              className="mt-5 w-full accent-accent"
            />

            <div className="mt-1 flex justify-between text-[11px] text-muted">
              <span>{MIN_WEEKLY_HOURS} hr</span>
              <span>{MAX_WEEKLY_HOURS} hrs</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Quick picks</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weeklyHourPresets.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => {
                    updateDraft({ weeklyHours: hours });
                    setError(null);
                  }}
                  aria-pressed={draft.weeklyHours === hours}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    draft.weeklyHours === hours
                      ? "border-accent/20 bg-accent-soft text-accent"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
                  )}
                >
                  {hours} hrs
                </button>
              ))}
            </div>
          </div>

          <p className="rounded-xl border border-line bg-surface p-4 text-sm leading-6 text-muted">
            <Clock
              aria-hidden="true"
              className="mr-2 inline size-4 text-accent"
            />
            {intensity.description}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <ReviewRow label="Career goal" onEdit={() => goToStep(0)}>
          <p className="font-medium">{draft.targetRole.trim()}</p>
        </ReviewRow>

        <ReviewRow label="Experience level" onEdit={() => goToStep(1)}>
          <p className="font-medium">{draft.experienceLevel}</p>
        </ReviewRow>

        <ReviewRow label="Current skills" onEdit={() => goToStep(2)}>
          {draft.currentSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {draft.currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-line bg-canvas px-2 py-0.5 text-xs text-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted">Starting from scratch</p>
          )}
        </ReviewRow>

        <ReviewRow label="Weekly study time" onEdit={() => goToStep(3)}>
          <p className="font-medium">
            {draft.weeklyHours} hours per week
            <span className="ml-2 font-normal text-muted">
              {intensity.label}
            </span>
          </p>
        </ReviewRow>

        <div className="rounded-xl border border-accent/15 bg-accent-soft p-4 text-sm leading-6 text-accent">
          <div className="flex items-start gap-2.5">
            <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>
              Your learner profile is saved to Supabase with row level security,
              ready for personalized roadmap generation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone="accent" dot>
          Phase 3 · Onboarding
        </Badge>
        <span className="text-xs text-muted">
          {initialProfile?.onboardingCompleted
            ? "Editing your existing profile"
            : "About two minutes"}
        </span>
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
        {initialProfile?.onboardingCompleted
          ? "Keep your learner profile current."
          : "Let's shape your learning path."}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
        Tell us where you are headed, what you already know, and how much time
        you can spend each week. Your answers shape the personalized roadmap
        generated for you.
      </p>

      <OnboardingProgress currentStep={stepIndex} />

      <div className="mt-6 rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <StepIcon aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              Step {stepIndex + 1} of {onboardingSteps.length}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-ink">
              {step.title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              {step.description}
            </p>
          </div>
        </div>

        {initialProfile?.onboardingCompleted && stepIndex === 0 ? (
          <div className="mt-5">
            <FormSuccess>
              You have already completed onboarding. Saving updates your
              existing learner profile.
            </FormSuccess>
          </div>
        ) : null}

        <div className="mt-6">{renderStep()}</div>

        {error ? (
          <div className="mt-5">
            <FormError>{error}</FormError>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="secondary"
            onClick={() => goToStep(stepIndex - 1)}
            disabled={stepIndex === 0 || pending}
            className={stepIndex === 0 ? "invisible" : undefined}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Button>

          {isLastStep ? (
            <Button onClick={handleFinish} disabled={pending}>
              {pending ? (
                <>
                  <Loader2
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Check aria-hidden="true" className="size-4" />
                  Finish onboarding
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleContinue}>
              Continue
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-muted">
        Your answers live in your private Supabase profile and are protected by
        row level security.
      </p>
    </div>
  );
}

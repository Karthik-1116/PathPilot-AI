"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  FolderOpen,
  Info,
  Lock,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { sampleRoadmap } from "@/lib/demo-roadmap";
import type { RoadmapStageStatus } from "@/types/roadmap";
import { cn } from "@/lib/utils";

const statusLabels: Record<RoadmapStageStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  upcoming: "Upcoming",
};

function StatusBadge({ status }: { status: RoadmapStageStatus }) {
  if (status === "completed") {
    return (
      <Badge tone="success">
        <Check aria-hidden="true" className="size-3" />
        {statusLabels[status]}
      </Badge>
    );
  }

  if (status === "in-progress") {
    return (
      <Badge tone="accent" dot>
        {statusLabels[status]}
      </Badge>
    );
  }

  return <Badge tone="neutral">{statusLabels[status]}</Badge>;
}

function StageMarker({
  status,
  index,
}: {
  status: RoadmapStageStatus;
  index: number;
}) {
  if (status === "completed") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
        <Check aria-hidden="true" className="size-4" />
      </span>
    );
  }

  if (status === "in-progress") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent-soft">
        <span className="size-2 rounded-full bg-accent" />
      </span>
    );
  }

  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-canvas font-mono text-[11px] text-muted">
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

export function SampleRoadmap() {
  const [openStageId, setOpenStageId] = useState<string | null>(
    "data-analysis",
  );

  return (
    <section
      id="roadmap"
      className="scroll-mt-24 border-y border-line bg-surface py-20 sm:py-24"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              eyebrow="Sample roadmap"
              title="See what a plan actually looks like."
              description="A real roadmap is built from your profile. This fixed example shows how skills, time, and a career goal become an ordered plan."
            />

            <div className="mt-7 rounded-card border border-line bg-canvas/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-xs font-medium text-ink">
                  <Target aria-hidden="true" className="size-3.5 text-accent" />
                  Sample learner profile
                </p>
                <Badge tone="warning">Illustrative</Badge>
              </div>

              <dl className="mt-4 space-y-3">
                {[
                  { label: "Career goal", value: sampleRoadmap.goal },
                  { label: "Experience", value: sampleRoadmap.level },
                  { label: "Study time", value: sampleRoadmap.weeklyHours },
                  { label: "Target duration", value: sampleRoadmap.duration },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <dt className="text-muted">{row.label}</dt>
                    <dd className="font-medium text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Link
              href="/signup"
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "mt-5 w-full",
              })}
            >
              Build my roadmap
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>

            <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted">
              <Info
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-muted/70"
              />
              This preview uses a fixed sample profile. Create an account to
              generate a roadmap from your own goal, skills, and study time.
            </p>
          </div>

          <div>
            <div className="rounded-card border border-line bg-canvas/60 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">
                  {sampleRoadmap.goal} · {sampleRoadmap.stages.length} stages
                </p>
                <span className="font-mono text-xs text-muted">
                  {sampleRoadmap.completedTopicCount}/{sampleRoadmap.topicCount}{" "}
                  topics · {sampleRoadmap.progress}%
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/[0.08]">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${sampleRoadmap.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-card border border-line bg-surface shadow-sm">
              {sampleRoadmap.stages.map((stage, index) => {
                const isOpen = openStageId === stage.id;

                return (
                  <div
                    key={stage.id}
                    className={cn(
                      index !== 0 && "border-t border-line",
                      isOpen && "bg-canvas/30",
                    )}
                  >
                    <button
                      id={`stage-${stage.id}`}
                      type="button"
                      onClick={() =>
                        setOpenStageId(isOpen ? null : stage.id)
                      }
                      aria-expanded={isOpen}
                      aria-controls={`panel-${stage.id}`}
                      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-canvas/60 sm:px-5"
                    >
                      <StageMarker status={stage.status} index={index} />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold tracking-tight text-ink">
                            {stage.title}
                          </span>
                          <StatusBadge status={stage.status} />
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                          <span className="inline-flex items-center gap-1">
                            <Clock aria-hidden="true" className="size-3" />
                            {stage.duration}
                          </span>
                          <span>{stage.difficulty}</span>
                          <span>{stage.topics.length} topics</span>
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 text-muted transition-transform duration-300",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    <div
                      id={`panel-${stage.id}`}
                      role="region"
                      aria-labelledby={`stage-${stage.id}`}
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div
                          aria-hidden={!isOpen}
                          className="border-t border-line px-4 pb-5 pt-4 sm:px-5"
                        >
                          <p className="text-sm leading-6 text-muted">
                            {stage.summary}
                          </p>

                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                              <h4 className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                                You&apos;ll learn
                              </h4>
                              <ul className="mt-2.5 space-y-1.5">
                                {stage.topics.map((topic) => (
                                  <li
                                    key={topic}
                                    className="flex items-start gap-2 text-[13px] leading-5 text-ink"
                                  >
                                    <Check
                                      aria-hidden="true"
                                      className="mt-0.5 size-3.5 shrink-0 text-accent"
                                    />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="rounded-xl border border-line bg-canvas/60 p-4">
                              <p className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                                <FolderOpen
                                  aria-hidden="true"
                                  className="size-3.5 text-accent"
                                />
                                Practical project
                              </p>
                              <p className="mt-2 text-sm font-medium text-ink">
                                {stage.project.title}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-muted">
                                {stage.project.description}
                              </p>
                            </div>
                          </div>

                          <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-5 text-muted">
                            <Lock
                              aria-hidden="true"
                              className="mt-0.5 size-3 shrink-0"
                            />
                            <span>
                              <span className="font-medium text-ink">
                                Prerequisites:
                              </span>{" "}
                              {stage.prerequisites.join(", ")}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-center text-[11px] text-muted">
              Select any stage to expand it. Sample completion state shown.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

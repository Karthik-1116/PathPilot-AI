import type { ReactNode } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  ExternalLink,
  FileText,
  FolderOpen,
  Gauge,
  GraduationCap,
  Layers3,
  Timer,
  Video,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { roadmapResourceTypeLabels } from "@/lib/roadmap-display";
import type {
  RoadmapPhase,
  RoadmapPhaseStatus,
  RoadmapResourceType,
} from "@/types/generated-roadmap";
import { cn } from "@/lib/utils";
import {
  RoadmapPhaseMarker,
  RoadmapPhaseStatusBadge,
} from "./roadmap-phase-status";

const resourceIcons: Record<RoadmapResourceType, typeof FileText> = {
  documentation: FileText,
  course: GraduationCap,
  article: BookOpen,
  video: Video,
  practice: Wrench,
};

function PhaseSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof FileText;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 border-t border-line pt-5">
      <h4 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        <Icon aria-hidden="true" className="size-3.5 text-accent" />
        {title}
      </h4>
      {children}
    </section>
  );
}

function PhaseCard({ phase, index }: { phase: RoadmapPhase; index: number }) {
  return (
    <li
      id={`phase-${phase.id}`}
      className="relative scroll-mt-28 pl-11"
    >
      <RoadmapPhaseMarker
        status={phase.status}
        index={index}
        className="absolute left-0 top-1"
      />

      <article
        className={cn(
          "rounded-card border bg-surface p-5 shadow-card sm:p-6",
          phase.status === "current"
            ? "border-accent/30 ring-1 ring-accent/10"
            : "border-line",
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              Phase {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-ink">
              {phase.title}
            </h3>
          </div>
          <div className="shrink-0">
            <RoadmapPhaseStatusBadge status={phase.status} />
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted">{phase.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
            <Clock aria-hidden="true" className="size-3.5 text-accent" />
            {phase.durationWeeks} weeks
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
            <Timer aria-hidden="true" className="size-3.5 text-accent" />
            ~{phase.estimatedHours} hrs
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
            <Gauge aria-hidden="true" className="size-3.5 text-accent" />
            {phase.difficulty}
          </span>
        </div>

        <PhaseSection icon={CheckCircle2} title="Learning objectives">
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase.objectives.map((objective) => (
              <li
                key={objective}
                className="flex gap-2 text-sm leading-6 text-muted"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-success"
                />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </PhaseSection>

        <PhaseSection icon={Layers3} title="Topics and subtopics">
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase.topics.map((topic) => (
              <li
                key={topic.id}
                className="rounded-xl border border-line bg-canvas/60 p-3.5"
              >
                <p className="text-sm font-medium text-ink">{topic.title}</p>
                <ul className="mt-2 space-y-1.5">
                  {topic.subtopics.map((subtopic) => (
                    <li
                      key={subtopic}
                      className="flex gap-2 text-xs leading-5 text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                      />
                      <span>{subtopic}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </PhaseSection>

        <PhaseSection icon={ClipboardList} title="Practice assignments">
          <ol className="mt-3 space-y-3">
            {phase.assignments.map((assignment, assignmentIndex) => (
              <li
                key={assignment.id}
                className="flex gap-3 rounded-xl border border-line bg-canvas/60 p-3.5"
              >
                <span className="font-mono text-[11px] text-muted">
                  {String(assignmentIndex + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {assignment.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {assignment.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </PhaseSection>

        <PhaseSection icon={FolderOpen} title="Portfolio mini project">
          <div className="mt-3 grid gap-3">
            {phase.miniProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-accent/15 bg-accent-soft/40 p-4"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen
                    aria-hidden="true"
                    className="size-4 shrink-0 text-accent"
                  />
                  <p className="text-sm font-medium text-ink">
                    {project.title}
                  </p>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">
                  {project.description}
                </p>
                <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                  Deliverables
                </p>
                <ul className="mt-2 space-y-1.5">
                  {project.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="flex gap-2 text-xs leading-5 text-muted"
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-accent"
                      />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PhaseSection>

        <PhaseSection icon={BookOpen} title="Curated resources">
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase.resources.map((resource) => {
              const Icon = resourceIcons[resource.type];

              return (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-start gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-line-strong hover:bg-canvas/60"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-5 text-ink group-hover:text-accent">
                        {resource.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted">
                        {resource.provider} ·{" "}
                        {roadmapResourceTypeLabels[resource.type]}
                      </span>
                    </span>
                    <ExternalLink
                      aria-hidden="true"
                      className="mt-1 size-3.5 shrink-0 text-muted"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </PhaseSection>

        {phase.prerequisites.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Before this phase
            </span>
            {phase.prerequisites.map((prerequisite) => (
              <Badge key={prerequisite}>{prerequisite}</Badge>
            ))}
          </div>
        ) : null}
      </article>
    </li>
  );
}

export function RoadmapTimeline({ phases }: { phases: RoadmapPhase[] }) {
  return (
    <ol className="relative space-y-6 before:absolute before:bottom-6 before:left-4 before:top-2 before:w-px before:bg-line">
      {phases.map((phase, index) => (
        <PhaseCard key={phase.id} phase={phase} index={index} />
      ))}
    </ol>
  );
}

function PhaseNavMarker({ status }: { status: RoadmapPhaseStatus }) {
  if (status === "completed") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
        <Check aria-hidden="true" className="size-3" />
      </span>
    );
  }

  if (status === "current") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent-soft">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      </span>
    );
  }

  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-canvas">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-line-strong" />
    </span>
  );
}

export function RoadmapPhaseNav({ phases }: { phases: RoadmapPhase[] }) {
  return (
    <nav aria-label="Roadmap phases" className="hidden lg:block">
      <div className="sticky top-24 rounded-card border border-line bg-surface p-4 shadow-card">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Phase map
        </p>
        <ol className="mt-3 space-y-1">
          {phases.map((phase, index) => (
            <li key={phase.id}>
              <a
                href={`#phase-${phase.id}`}
                className={cn(
                  "flex items-start gap-2.5 rounded-lg px-2 py-2 text-xs leading-5 transition-colors hover:bg-canvas",
                  phase.status === "current"
                    ? "font-medium text-ink"
                    : "text-muted",
                )}
              >
                <PhaseNavMarker status={phase.status} />
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">
                    Phase {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="block">{phase.title}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

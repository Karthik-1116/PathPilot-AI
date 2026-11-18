import {
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  features,
  type FeatureLayout,
  type LandingFeature,
} from "@/lib/site-config";
import { cn } from "@/lib/utils";

const layoutClasses: Record<FeatureLayout, string> = {
  wide: "lg:col-span-7",
  narrow: "lg:col-span-5",
  third: "lg:col-span-4",
  full: "lg:col-span-12",
};

const roadmapRows = [
  { label: "Python foundations", width: "w-full" },
  { label: "Data analysis", width: "w-[70%]" },
  { label: "Machine learning", width: "w-[45%]" },
];

const assessmentRows = [
  { label: "Python", level: "Intermediate", width: "w-[68%]" },
  { label: "SQL", level: "Beginner", width: "w-[38%]" },
  { label: "Mathematics", level: "Beginner", width: "w-[28%]" },
];

const analyticsBars = [
  "h-3",
  "h-5",
  "h-4",
  "h-6",
  "h-5",
  "h-7",
  "h-4",
  "h-6",
  "h-8",
  "h-5",
  "h-7",
  "h-9",
];

function RoadmapVisual() {
  return (
    <div className="mt-6 rounded-2xl border border-line bg-canvas/60 p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {["Python", "Beginner", "2h/day"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-line bg-surface px-2 py-1 text-[10px] font-medium text-muted"
          >
            {chip}
          </span>
        ))}
        <ArrowRight aria-hidden="true" className="size-3 text-muted" />
        <span className="rounded-full bg-accent-soft px-2 py-1 text-[10px] font-medium text-accent">
          5 stages
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {roadmapRows.map((row, index) => (
          <div key={row.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[9px]",
                index === 0
                  ? "border-accent/20 bg-accent-soft text-accent"
                  : "border-line bg-surface text-muted",
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-ink">
              {row.label}
            </span>
            <span className="h-1 w-16 overflow-hidden rounded-full bg-ink/[0.06]">
              <span
                className={cn("block h-full rounded-full bg-accent/40", row.width)}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssistantVisual() {
  return (
    <div className="mt-6 rounded-2xl border border-line bg-canvas/60 p-4">
      <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[11px] leading-5 text-white">
        What should I learn next?
      </div>
      <div className="mt-2.5 max-w-[94%] rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-3">
        <p className="flex items-center gap-1.5 text-[10px] font-medium text-accent">
          <Sparkles aria-hidden="true" className="size-3" />
          PathPilot
        </p>
        <p className="mt-1 text-[11px] leading-5 text-muted">
          Start linear algebra next. It unlocks the ML stage and fits your
          25-minute sessions.
        </p>
      </div>
    </div>
  );
}

function AssessmentVisual() {
  return (
    <div className="mt-5 space-y-2.5">
      {assessmentRows.map((row) => (
        <div key={row.label} className="flex items-center gap-2.5">
          <span className="w-20 shrink-0 text-[11px] font-medium text-ink">
            {row.label}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
            <span className={cn("block h-full rounded-full bg-accent/50", row.width)} />
          </span>
          <span className="w-20 shrink-0 text-right text-[10px] text-muted">
            {row.level}
          </span>
        </div>
      ))}
    </div>
  );
}

function ResourcesVisual() {
  const rows = ["Documentation", "Video course", "Practice set"];

  return (
    <div className="mt-5 divide-y divide-line rounded-xl border border-line bg-canvas/60 px-3">
      {rows.map((row) => (
        <div
          key={row}
          className="flex items-center justify-between gap-3 py-2.5"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-medium text-ink">
            <BookOpen aria-hidden="true" className="size-3 text-accent" />
            {row}
          </span>
          <span className="text-[10px] text-muted">Matched to stage</span>
        </div>
      ))}
    </div>
  );
}

function ProjectsVisual() {
  return (
    <div className="mt-5 grid gap-2">
      {["Student Data Analysis", "Image Classifier"].map((project, index) => (
        <div
          key={project}
          className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas/60 px-3 py-2.5"
        >
          <span className="text-[11px] font-medium text-ink">{project}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[9px] font-medium",
              index === 0
                ? "bg-success-soft text-success"
                : "bg-accent-soft text-accent",
            )}
          >
            {index === 0 ? "Complete" : "Planned"}
          </span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-canvas/60 p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Weekly activity
        </p>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
          <TrendingUp aria-hidden="true" className="size-3" />
          On track
        </span>
      </div>
      <div className="mt-4 flex h-16 items-end gap-1.5">
        {analyticsBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={cn(
              "flex-1 rounded-sm",
              height,
              index > 8 ? "bg-accent" : "bg-accent/20",
            )}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
        {[
          { value: "7/20", label: "Topics" },
          { value: "2/5", label: "Projects" },
          { value: "4 days", label: "Streak" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="font-mono text-sm font-semibold text-ink">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureVisual({ id }: { id: string }) {
  switch (id) {
    case "roadmap":
      return <RoadmapVisual />;
    case "assistant":
      return <AssistantVisual />;
    case "assessment":
      return <AssessmentVisual />;
    case "resources":
      return <ResourcesVisual />;
    case "projects":
      return <ProjectsVisual />;
    case "analytics":
      return <AnalyticsVisual className="mt-6 lg:mt-0" />;
    default:
      return null;
  }
}

function FeatureCard({ feature }: { feature: LandingFeature }) {
  const Icon = feature.icon;
  const isFull = feature.layout === "full";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-card border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card sm:p-7",
        layoutClasses[feature.layout],
        isFull && "lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10",
      )}
    >
      <div>
        <span className="flex size-10 items-center justify-center rounded-xl border border-line bg-canvas text-ink transition-colors group-hover:bg-accent-soft group-hover:text-accent">
          <Icon aria-hidden="true" className="size-[18px]" />
        </span>
        <h3 className="mt-5 text-base font-semibold tracking-tight text-ink">
          {feature.title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          {feature.description}
        </p>
      </div>
      <FeatureVisual id={feature.id} />
    </article>
  );
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Key features"
            title="Everything you need to keep moving."
            description="Purpose-built tools for the parts of learning that usually get stuck: direction, practice, and proof of progress."
          />
          <span className="hidden rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted md:inline-flex">
            Built for real student schedules
          </span>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}

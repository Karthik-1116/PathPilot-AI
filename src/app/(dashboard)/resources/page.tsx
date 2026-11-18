import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  FileText,
  GraduationCap,
  Sparkles,
  Video,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { DataWarning } from "@/components/dashboard/data-warning";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { GenerateRoadmapButton } from "@/components/roadmaps/roadmap-generation-controls";
import { requireDashboardUser } from "@/lib/dashboard";
import { formatRoadmapDate } from "@/lib/format";
import {
  roadmapResourceTypeLabels,
} from "@/lib/roadmap-display";
import { getLatestRoadmap } from "@/lib/supabase/roadmaps";
import type { RoadmapResourceType } from "@/types/generated-roadmap";

export const metadata: Metadata = {
  title: "Learning Resources",
  robots: { index: false, follow: false },
};

const resourceTypeOrder: RoadmapResourceType[] = [
  "documentation",
  "course",
  "practice",
  "article",
  "video",
];

const resourceTypeIcons: Record<
  RoadmapResourceType,
  typeof BookOpen
> = {
  documentation: FileText,
  course: GraduationCap,
  practice: Wrench,
  article: BookOpen,
  video: Video,
};

interface LibraryResource {
  id: string;
  title: string;
  provider: string;
  type: RoadmapResourceType;
  url: string;
  phaseTitles: string[];
}

export default async function ResourcesPage() {
  const { user } = await requireDashboardUser();
  const { roadmap, error } = await getLatestRoadmap(user.id);

  const resourcesByUrl = new Map<string, LibraryResource>();

  for (const phase of roadmap?.content.phases ?? []) {
    for (const resource of phase.resources) {
      const existing = resourcesByUrl.get(resource.url);

      if (existing) {
        if (!existing.phaseTitles.includes(phase.title)) {
          existing.phaseTitles.push(phase.title);
        }
        continue;
      }

      resourcesByUrl.set(resource.url, {
        id: resource.id,
        title: resource.title,
        provider: resource.provider,
        type: resource.type,
        url: resource.url,
        phaseTitles: [phase.title],
      });
    }
  }

  const resources = Array.from(resourcesByUrl.values());
  const groupedResources = resourceTypeOrder
    .map((type) => ({
      type,
      label: roadmapResourceTypeLabels[type],
      icon: resourceTypeIcons[type],
      items: resources.filter((resource) => resource.type === type),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Learning resources"
        title="Curated resources"
        description={
          roadmap
            ? `Every resource attached to "${roadmap.title}", grouped by the way you will use it.`
            : "Generate a roadmap to collect documentation, courses, practice platforms, and videos in one place."
        }
      >
        {roadmap ? (
          <Link
            href={`/roadmaps/${roadmap.id}`}
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            <Sparkles aria-hidden="true" className="size-3.5" />
            Open roadmap
          </Link>
        ) : null}
      </PageHeader>

      {error ? (
        <DataWarning
          title="Resource data unavailable"
          migration="supabase/migrations/0003_roadmaps.sql"
        />
      ) : null}

      {!error && !roadmap ? (
        <EmptyState
          icon={BookOpen}
          title="No resources yet"
          description="Resources live inside your roadmap phases. Generate your first roadmap to build a curated learning library."
        >
          <GenerateRoadmapButton label="Generate my roadmap" />
          <Link
            href="/roadmaps"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            View roadmap workspace
          </Link>
        </EmptyState>
      ) : null}

      {!error && roadmap ? (
        <>
          <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                Source roadmap
              </p>
              <Link
                href={`/roadmaps/${roadmap.id}`}
                className="mt-1 block text-sm font-medium text-ink hover:text-accent"
              >
                {roadmap.title}
              </Link>
              <p className="mt-1 text-xs text-muted">
                Generated {formatRoadmapDate(roadmap.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">{resources.length} resources</Badge>
              <Badge>{groupedResources.length} categories</Badge>
            </div>
          </div>

          {groupedResources.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="This roadmap has no resources"
              description="Regenerate the roadmap to build a fresh resource list for your current profile."
            >
              <Link
                href={`/roadmaps/${roadmap.id}`}
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                Open roadmap
              </Link>
            </EmptyState>
          ) : (
            groupedResources.map(({ type, label, icon: Icon, items }) => (
              <section
                key={type}
                aria-labelledby={`resource-${type}`}
                className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <h2
                      id={`resource-${type}`}
                      className="text-lg font-semibold tracking-[-0.02em] text-ink"
                    >
                      {label}
                    </h2>
                  </div>
                  <Badge>{items.length}</Badge>
                </div>

                <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((resource) => (
                    <li key={resource.id}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full flex-col rounded-xl border border-line bg-canvas/50 p-4 transition-colors hover:border-line-strong hover:bg-canvas"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                            <Icon aria-hidden="true" className="size-4" />
                          </span>
                          <ExternalLink
                            aria-hidden="true"
                            className="size-3.5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </div>
                        <p className="mt-3 text-sm font-medium leading-5 text-ink group-hover:text-accent">
                          {resource.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {resource.provider}
                        </p>
                        <p className="mt-auto pt-3 text-[11px] leading-5 text-muted">
                          {resource.phaseTitles.join(" · ")}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </>
      ) : null}
    </div>
  );
}

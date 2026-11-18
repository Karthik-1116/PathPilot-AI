import type {
  RoadmapPhaseStatus,
  RoadmapResourceType,
} from "@/types/generated-roadmap";

export const roadmapPhaseStatusLabels: Record<
  RoadmapPhaseStatus,
  string
> = {
  completed: "Completed",
  current: "Current focus",
  upcoming: "Upcoming",
};

export const roadmapResourceTypeLabels: Record<
  RoadmapResourceType,
  string
> = {
  documentation: "Documentation",
  course: "Course",
  article: "Article",
  video: "Video",
  practice: "Practice",
};

export type RoadmapStageStatus = "completed" | "in-progress" | "upcoming";

export type RoadmapDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface RoadmapProject {
  title: string;
  description: string;
}

export interface RoadmapStage {
  id: string;
  title: string;
  summary: string;
  duration: string;
  difficulty: RoadmapDifficulty;
  status: RoadmapStageStatus;
  topics: string[];
  project: RoadmapProject;
  prerequisites: string[];
}

export interface Roadmap {
  goal: string;
  level: RoadmapDifficulty;
  weeklyHours: string;
  duration: string;
  topicCount: number;
  completedTopicCount: number;
  progress: number;
  stages: RoadmapStage[];
}

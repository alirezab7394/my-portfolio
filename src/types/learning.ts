export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "SKIPPED";

export type CoachMode = "daily" | "quiz" | "interview" | "resources" | "explain";

export type CoachMode = "daily" | "quiz" | "interview" | "resources" | "explain";

export type ResourceType = "article" | "video" | "course" | "docs" | "practice";

export interface LearningResource {
  title: string;
  url: string;
  type: ResourceType;
}

export interface LearningTask {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
}

export interface LearningWeek {
  id: string;
  weekNumber: number;
  title: string;
  focus: string;
  dailySplit: string;
  topics: string[];
  resources: LearningResource[];
  tasks: LearningTask[];
}

export interface LearningPhase {
  id: string;
  number: number;
  title: string;
  description: string;
  weekRange: [number, number];
  weeks: LearningWeek[];
}

export interface TaskProgressRecord {
  taskId: string;
  status: TaskStatus;
  note?: string | null;
  completedAt?: string | null;
  updatedAt?: string;
}

export interface StudySessionRecord {
  id?: string;
  date: string;
  minutes: number;
  topic?: string | null;
  note?: string | null;
  createdAt?: string;
}

export interface LearningStats {
  totalTasks: number;
  completedTasks: number;
  totalMinutes: number;
  streakDays: number;
  phaseProgress: Record<string, { total: number; done: number }>;
}

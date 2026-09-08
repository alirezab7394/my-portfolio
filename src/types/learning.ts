export type ResourceType = "article" | "video" | "course" | "docs" | "practice";

export type RagKind =
  | "destination"
  | "resource"
  | "knowledge"
  | "project"
  | "drill"
  | "lesson"
  | "bookmark";

export type HeadlineDepth = "core" | "interview" | "lab";

export type HeadlineStatus = "unread" | "ready" | "reviewed";

export type StudioAction = "headlines" | "lesson" | "explain" | "ingest" | "addHeadline";

export type QuestionKind = "choice" | "short";

export interface LearningResource {
  title: string;
  url: string;
  type: ResourceType;
}

export interface StudyHeadline {
  id: string;
  title: string;
  why: string;
  depth: HeadlineDepth;
}

export interface StudyDestination {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  goal: string;
  interviewSignal: string;
  seedHeadlines: StudyHeadline[];
  resources: LearningResource[];
  ragKeywords: string[];
}

export interface LessonQuestion {
  id: string;
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface RagSource {
  id: string;
  title: string;
  url?: string;
  kind: RagKind;
}

export interface GeneratedLesson {
  destinationId: string;
  headlineId: string;
  title: string;
  markdown: string;
  questions: LessonQuestion[];
  sources: RagSource[];
  generatedAt: string;
}

export interface ExplainResult {
  markdown: string;
  sources: RagSource[];
}

export interface StudyBookmark {
  id: string;
  kind: "lesson" | "passage";
  destinationId: string;
  headlineId: string;
  title: string;
  excerpt: string;
  explanation?: string;
  createdAt: string;
}

export interface HeadlineProgress {
  headlineId: string;
  destinationId: string;
  status: HeadlineStatus;
  updatedAt: string;
}

export interface InkPoint {
  x: number;
  y: number;
  p: number;
}

export interface InkStroke {
  tool: "pen" | "highlighter" | "eraser";
  color: string;
  width: number;
  points: InkPoint[];
}

export interface InkTextBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
}

export interface InkNote {
  id: string;
  destinationId: string;
  headlineId: string;
  strokes: InkStroke[];
  textBoxes?: InkTextBox[];
  typedText?: string;
  updatedAt: string;
}

export type CoachMode = "daily" | "quiz" | "interview" | "resources" | "explain";

export type CoachSuggestion = {
  label: string;
  prompt: string;
  mode: CoachMode;
};

export type RagSource = {
  id: string;
  title: string;
  url?: string;
  kind: "week" | "resource" | "knowledge" | "project";
};

export type CoachChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[];
  followUps?: CoachSuggestion[];
};

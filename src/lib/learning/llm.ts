import { LEARNING_CURRICULUM, getAllTasks } from "@/lib/learning/curriculum";
import { getLlmBaseUrl, getLlmModel, isLlmConfigured } from "@/lib/learning/llm-config";
import { formatRagContext, retrieveForCoach } from "@/lib/learning/rag";
import { defaultFollowUps } from "@/lib/learning/suggestions";
import type { CoachChatMessage, CoachMode, CoachSuggestion, RagSource } from "@/lib/learning/coach-types";
import type { StudySessionRecord, TaskProgressRecord } from "@/types/learning";

export type { CoachMode };
export { isLlmConfigured, getLlmBaseUrl, getLlmModel };

const MODE_INSTRUCTIONS: Record<CoachMode, string> = {
  daily:
    "Create today's 5-hour study plan. Split time into concrete blocks. Prefer the current incomplete week. Include 1 interview-style recap at the end.",
  quiz:
    "Give 6 short questions that test forgotten fundamentals (JS, TS, browser, HTTP, backend, AI, or the current week). Mix recall and 'explain why'. Put answers under an 'Answers' heading at the end.",
  interview:
    "Run a senior software engineer interview drill (frontend + backend + AI). Ask 1 hard question at a time if the latest user message is empty; if they answered, score it and ask the next. Use his real projects (Skedpal, NextTarget, Javi English, AzarTime).",
  resources:
    "Suggest 4–6 specific articles, docs, or videos with URLs. Prefer retrieved RAG sources when they have URLs. High-signal only: MDN, javascript.info, web.dev, NeetCode, GreatFrontEnd, React/Nest/Postgres docs.",
  explain:
    "Explain the requested concept from first principles, as if refreshing someone with 8 years of production experience who has gone rusty. Short sections, one example, one interview follow-up.",
};

export function buildCurriculumSnapshot(
  progress: TaskProgressRecord[],
  sessions: StudySessionRecord[]
) {
  const done = new Set(progress.filter((p) => p.status === "DONE").map((p) => p.taskId));
  const allTasks = getAllTasks();
  const nextIncomplete = allTasks.find((t) => !done.has(t.id));
  const currentWeek = LEARNING_CURRICULUM.flatMap((p) => p.weeks).find(
    (w) => w.id === nextIncomplete?.weekId
  );

  const weekSummary = currentWeek
    ? {
        weekNumber: currentWeek.weekNumber,
        title: currentWeek.title,
        focus: currentWeek.focus,
        dailySplit: currentWeek.dailySplit,
        topics: currentWeek.topics,
        remainingTasks: currentWeek.tasks.filter((t) => !done.has(t.id)).map((t) => t.title),
        resources: currentWeek.resources.map((r) => `${r.type}: ${r.title} (${r.url})`),
      }
    : null;

  return {
    learner:
      "Alireza Bagheri — 8+ years shipping production apps (React/Next/TS, NestJS, Prisma, Postgres), M.Sc. AI. Goal: senior SOFTWARE engineer (frontend + backend + AI) on a 12-week / 3-month plan, ~5h/day. Rusty on interview fundamentals. DSA is 1.5h daily. Persian native, interviews in English.",
    currentWeek: weekSummary,
    completedTasks: done.size,
    totalTasks: allTasks.length,
    recentSessions: sessions.slice(0, 7).map((s) => ({
      date: s.date,
      hours: Math.round((s.minutes / 60) * 10) / 10,
      topic: s.topic,
      note: s.note,
    })),
  };
}

export async function askLearningCoach(params: {
  mode: CoachMode;
  message?: string;
  progress: TaskProgressRecord[];
  sessions: StudySessionRecord[];
  history?: CoachChatMessage[];
}): Promise<{ content: string; sources: RagSource[]; followUps: CoachSuggestion[] }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const snapshot = buildCurriculumSnapshot(params.progress, params.sessions);
  const userText = params.message?.trim() || defaultUserPrompt(params.mode);
  const retrievalQuery = [
    userText,
    snapshot.currentWeek ? `Week ${snapshot.currentWeek.weekNumber} ${snapshot.currentWeek.title} ${snapshot.currentWeek.focus} ${snapshot.currentWeek.topics.join(" ")}` : "",
  ].join(" ");

  const sources = await retrieveForCoach(retrievalQuery, 6);
  const ragContext = formatRagContext(sources);

  const history = (params.history ?? []).slice(-8).map((m) => ({
    role: m.role,
    content: m.content.slice(0, 4000),
  }));

  const response = await fetch(`${getLlmBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getLlmModel(),
      temperature: params.mode === "quiz" ? 0.4 : 0.6,
      messages: [
        {
          role: "system",
          content: [
            "You are Alireza's private senior-engineer interview coach.",
            "Be direct, specific, and practical. No fluff. Use markdown.",
            "Default to English. If he writes in Persian, reply in Persian.",
            "Ground answers in the retrieved RAG context and his 12-week path. Cite source titles in-line when you use them.",
            "If RAG context is missing a fact, say so instead of inventing URLs.",
            MODE_INSTRUCTIONS[params.mode],
            "Learner snapshot JSON:",
            JSON.stringify(snapshot),
            "Retrieved notes (RAG):",
            ragContext || "(no chunks)",
          ].join("\n\n"),
        },
        ...history,
        { role: "user", content: userText },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`LLM request failed (${response.status}): ${text.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("LLM returned an empty response");

  return {
    content,
    sources,
    followUps: defaultFollowUps(params.mode),
  };
}

function defaultUserPrompt(mode: CoachMode): string {
  switch (mode) {
    case "daily":
      return "Build today's 5-hour plan from my current week and remaining tasks.";
    case "quiz":
      return "Quiz me on the current week's core concepts.";
    case "interview":
      return "Start a senior interview drill for today.";
    case "resources":
      return "Recommend what I should read or watch next.";
    case "explain":
      return "Pick the most important rusty concept from my current week and explain it.";
  }
}

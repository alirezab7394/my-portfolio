import { LEARNING_CURRICULUM, getAllTasks } from "@/lib/learning/curriculum";
import type { CoachMode, StudySessionRecord, TaskProgressRecord } from "@/types/learning";

export type { CoachMode };

const MODE_INSTRUCTIONS: Record<CoachMode, string> = {
  daily:
    "Create today's 5-hour study plan. Split time into concrete blocks. Prefer the current incomplete week. Include 1 interview-style recap at the end.",
  quiz:
    "Give 6 short questions that test forgotten fundamentals (JS, TS, browser, HTTP, or the current week). Mix recall and 'explain why'. After the questions, wait — do not dump all answers first; put answers under an 'Answers' heading at the end so Alireza can try first.",
  interview:
    "Run a senior frontend / full-stack interview drill. Ask 1 hard question at a time if the user message is empty; if they answered, score it and ask the next. Cover system design, React internals, or behavioral STAR using his real projects (Skedpal, NextTarget, Javi English, AzarTime).",
  resources:
    "Suggest 4–6 specific articles, docs, or videos with URLs. Match the current week and weak spots. Prefer high-signal sources (MDN, javascript.info, web.dev, NeetCode, GreatFrontEnd, React docs).",
  explain:
    "Explain the requested concept from first principles, as if refreshing someone with 8 years of production experience who has gone rusty. Use short sections, one example, and one interview-style follow-up.",
};

export function isLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY && getLlmBaseUrl() && getLlmModel());
}

export function getLlmBaseUrl(): string {
  const raw = process.env.OPENAI_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  return raw.replace(/\/$/, "");
}

export function getLlmModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

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
      "Alireza Bagheri — senior frontend (8+ years React/Next/TS, NestJS, Prisma). Strong at shipping product; rusty on interview fundamentals (event loop, DSA, system design, React internals). Studies ~5h/day. Persian native, interviews in English.",
    currentWeek: weekSummary,
    completedTasks: done.size,
    totalTasks: allTasks.length,
    recentSessions: sessions.slice(0, 7).map((s) => ({
      date: s.date,
      hours: Math.round((s.minutes / 60) * 10) / 10,
      topic: s.topic,
    })),
  };
}

export async function askLearningCoach(params: {
  mode: CoachMode;
  message?: string;
  progress: TaskProgressRecord[];
  sessions: StudySessionRecord[];
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const snapshot = buildCurriculumSnapshot(params.progress, params.sessions);
  const url = `${getLlmBaseUrl()}/chat/completions`;

  const response = await fetch(url, {
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
            MODE_INSTRUCTIONS[params.mode],
            "Context JSON:",
            JSON.stringify(snapshot),
          ].join("\n\n"),
        },
        {
          role: "user",
          content: params.message?.trim() || defaultUserPrompt(params.mode),
        },
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
  return content;
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

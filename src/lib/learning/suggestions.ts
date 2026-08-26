import { LEARNING_CURRICULUM, getFocusWeek } from "@/lib/learning/curriculum";
import type { CoachSuggestion } from "@/lib/learning/coach-types";
import type { TaskProgressRecord } from "@/types/learning";

export function getCoachSuggestionChips(progress: TaskProgressRecord[]): CoachSuggestion[] {
  const done = new Set(progress.filter((p) => p.status === "DONE").map((p) => p.taskId));
  const focus = getFocusWeek(done);
  const week = focus?.week;
  const topic = week?.topics[0] ?? "JavaScript internals";
  const topic2 = week?.topics[1] ?? "TypeScript";

  return [
    {
      label: "Today's 5h plan",
      prompt: `Build today's 5-hour plan for Week ${week?.weekNumber ?? 1}: ${week?.title ?? "current week"}. Use the remaining tasks and the daily split.`,
      mode: "daily",
    },
    {
      label: `Quiz: ${topic}`,
      prompt: `Quiz me on ${topic}. Six questions, answers at the end.`,
      mode: "quiz",
    },
    {
      label: "Interview drill",
      prompt: `Start a senior software engineer interview. First question should relate to: ${week?.focus ?? "fundamentals"}. One question at a time.`,
      mode: "interview",
    },
    {
      label: "What to watch",
      prompt: `What should I watch or read tonight for Week ${week?.weekNumber ?? 1}? Give 4–6 specific URLs.`,
      mode: "resources",
    },
    {
      label: `Explain ${topic2}`,
      prompt: `Explain ${topic2} from first principles. Assume I shipped production apps for 8 years but I am rusty.`,
      mode: "explain",
    },
    {
      label: "DSA today",
      prompt: `Give me today's DSA set for Week ${week?.weekNumber ?? 1} with problem names, order, and a 90-minute timed plan.`,
      mode: "daily",
    },
    {
      label: "NextTarget design",
      prompt:
        "Run a system design drill: design NextTarget (gym coaching, 4 roles, NestJS, Prisma, Redis, AI reports). Ask clarifying questions first, then propose an architecture.",
      mode: "interview",
    },
    {
      label: "Javi AI scoring",
      prompt:
        "Interview me on how I would (and did) design AI scoring for Javi English: cost caps, retries, evals, multilingual, RAG vs prompt-only.",
      mode: "interview",
    },
    {
      label: "STAR: Skedpal",
      prompt:
        "Help me tighten a STAR story: leading 3 engineers at Skedpal, WordPress to Next.js (30% faster), jQuery to React (40% smaller bundle). Keep it under 2 minutes.",
      mode: "explain",
    },
  ];
}

export function defaultFollowUps(mode: CoachSuggestion["mode"]): CoachSuggestion[] {
  const map: Record<CoachSuggestion["mode"], CoachSuggestion[]> = {
    daily: [
      { label: "Tighten the plan", prompt: "Make the plan more concrete: exact problems and exact articles for the next 2 hours.", mode: "daily" },
      { label: "Quiz after the plan", prompt: "Quiz me on what I should remember from today's plan.", mode: "quiz" },
    ],
    quiz: [
      { label: "Grade my answers", prompt: "I will paste answers next. Wait for them, then score each one.", mode: "quiz" },
      { label: "Harder questions", prompt: "Give 3 harder follow-up questions on the same topics.", mode: "quiz" },
    ],
    interview: [
      { label: "I have an answer", prompt: "Score the answer I just gave. Then ask the next harder question.", mode: "interview" },
      { label: "Switch to design", prompt: "Switch to a 20-minute system design question related to my products.", mode: "interview" },
    ],
    resources: [
      { label: "Only videos", prompt: "Filter to videos only, 20–40 minutes each, in a sensible watch order.", mode: "resources" },
      { label: "Explain the first one", prompt: "Summarize the most important resource you listed and what I should extract from it.", mode: "explain" },
    ],
    explain: [
      { label: "Interview version", prompt: "Now ask me to explain the same concept as if I am in an interview. Then score me.", mode: "interview" },
      { label: "A code example", prompt: "Give a short TypeScript example that would impress a senior interviewer.", mode: "explain" },
    ],
  };
  return map[mode  ];
}

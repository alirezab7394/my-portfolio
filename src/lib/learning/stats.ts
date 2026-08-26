import type { LearningStats, StudySessionRecord, TaskProgressRecord, TaskStatus } from "@/types/learning";
import { getAllTasks, LEARNING_CURRICULUM } from "@/lib/learning/curriculum";

export function computeStats(
  progress: TaskProgressRecord[],
  sessions: StudySessionRecord[]
): LearningStats {
  const tasks = getAllTasks();
  const progressMap = new Map(progress.map((p) => [p.taskId, p]));

  const completedTasks = tasks.filter((t) => progressMap.get(t.id)?.status === "DONE").length;

  const phaseProgress: LearningStats["phaseProgress"] = {};
  for (const phase of LEARNING_CURRICULUM) {
    const phaseTasks = phase.weeks.flatMap((w) => w.tasks);
    const done = phaseTasks.filter((t) => progressMap.get(t.id)?.status === "DONE").length;
    phaseProgress[phase.id] = { total: phaseTasks.length, done };
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
  const streakDays = computeStreak(sessions);

  return {
    totalTasks: tasks.length,
    completedTasks,
    totalMinutes,
    streakDays,
    phaseProgress,
  };
}

function computeStreak(sessions: StudySessionRecord[]): number {
  if (sessions.length === 0) return 0;

  const days = new Set(
    sessions.map((s) => {
      const d = typeof s.date === "string" ? s.date.slice(0, 10) : new Date(s.date).toISOString().slice(0, 10);
      return d;
    })
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let cursor = new Date(today);
  const todayKey = formatDateKey(cursor);
  if (!days.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
    const yesterdayKey = formatDateKey(cursor);
    if (!days.has(yesterdayKey)) return 0;
  }

  let streak = 0;
  while (days.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function normalizeStatus(status: string): TaskStatus {
  const allowed: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "SKIPPED"];
  if (allowed.includes(status as TaskStatus)) return status as TaskStatus;
  return "TODO";
}

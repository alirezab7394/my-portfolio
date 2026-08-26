import type { LearningStats, StudySessionRecord, TaskProgressRecord, TaskStatus } from "@/types/learning";
import { getAllTasks, LEARNING_CURRICULUM } from "@/lib/learning/curriculum";

export const DAILY_MINUTE_TARGET = 5 * 60;
export const WEEKLY_MINUTE_TARGET = 6 * 5 * 60;

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
  const todayKey = formatDateKey(new Date());
  const minutesToday = sessions
    .filter((s) => sessionDateKey(s) === todayKey)
    .reduce((sum, s) => sum + s.minutes, 0);

  const weekKeys = lastNDateKeys(7);
  const minutesThisWeek = sessions
    .filter((s) => weekKeys.includes(sessionDateKey(s)))
    .reduce((sum, s) => sum + s.minutes, 0);

  const byDay = new Map<string, number>();
  for (const key of weekKeys) byDay.set(key, 0);
  for (const s of sessions) {
    const key = sessionDateKey(s);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + s.minutes);
  }
  const hoursLast7Days = weekKeys.map((date) => ({
    date,
    hours: Math.round(((byDay.get(date) ?? 0) / 60) * 10) / 10,
  }));

  return {
    totalTasks: tasks.length,
    completedTasks,
    totalMinutes,
    streakDays,
    minutesToday,
    minutesThisWeek,
    hoursLast7Days,
    phaseProgress,
  };
}

function sessionDateKey(s: StudySessionRecord): string {
  return typeof s.date === "string" ? s.date.slice(0, 10) : new Date(s.date).toISOString().slice(0, 10);
}

function lastNDateKeys(n: number): string[] {
  const keys: string[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() - i);
    keys.push(formatDateKey(d));
  }
  return keys;
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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function normalizeStatus(status: string): TaskStatus {
  const allowed: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "SKIPPED"];
  if (allowed.includes(status as TaskStatus)) return status as TaskStatus;
  return "TODO";
}

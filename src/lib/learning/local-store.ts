import type { StudySessionRecord, TaskProgressRecord, TaskStatus } from "@/types/learning";

const PROGRESS_KEY = "learning-progress-v1";
const SESSIONS_KEY = "learning-sessions-v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadLocalProgress(): TaskProgressRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse<TaskProgressRecord[]>(localStorage.getItem(PROGRESS_KEY), []);
}

export function saveLocalProgress(progress: TaskProgressRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function upsertLocalProgress(
  taskId: string,
  status: TaskStatus,
  note?: string | null
): TaskProgressRecord {
  const list = loadLocalProgress();
  const existing = list.find((p) => p.taskId === taskId);
  const record: TaskProgressRecord = {
    taskId,
    status,
    note: note ?? existing?.note ?? null,
    completedAt: status === "DONE" ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
  const next = existing
    ? list.map((p) => (p.taskId === taskId ? record : p))
    : [...list, record];
  saveLocalProgress(next);
  return record;
}

export function loadLocalSessions(): StudySessionRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse<StudySessionRecord[]>(localStorage.getItem(SESSIONS_KEY), []);
}

export function saveLocalSessions(sessions: StudySessionRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function addLocalSession(session: Omit<StudySessionRecord, "id" | "createdAt">): StudySessionRecord {
  const record: StudySessionRecord = {
    ...session,
    id: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const next = [record, ...loadLocalSessions()];
  saveLocalSessions(next);
  return record;
}

/** Merge server progress over local; local fills gaps when server empty for a task. */
export function mergeProgress(
  server: TaskProgressRecord[],
  local: TaskProgressRecord[]
): TaskProgressRecord[] {
  const map = new Map<string, TaskProgressRecord>();
  for (const p of local) map.set(p.taskId, p);
  for (const p of server) {
    const existing = map.get(p.taskId);
    if (!existing) {
      map.set(p.taskId, p);
      continue;
    }
    const serverTime = p.updatedAt ? Date.parse(p.updatedAt) : 0;
    const localTime = existing.updatedAt ? Date.parse(existing.updatedAt) : 0;
    map.set(p.taskId, serverTime >= localTime ? p : existing);
  }
  return Array.from(map.values());
}

export function mergeSessions(
  server: StudySessionRecord[],
  local: StudySessionRecord[]
): StudySessionRecord[] {
  const seen = new Set<string>();
  const result: StudySessionRecord[] = [];
  for (const s of [...server, ...local]) {
    const key = s.id || `${s.date}-${s.minutes}-${s.topic ?? ""}-${s.createdAt ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(s);
  }
  return result.sort((a, b) => b.date.localeCompare(a.date));
}

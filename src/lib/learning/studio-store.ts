import type { GeneratedLesson, HeadlineProgress, StudyBookmark, StudyHeadline } from "@/types/learning";

const HEADLINES_KEY = "study-headlines-v1";
const LESSONS_KEY = "study-lessons-v1";
const BOOKMARKS_KEY = "study-bookmarks-v1";
const PROGRESS_KEY = "study-headline-progress-v1";
const LAST_DEST_KEY = "study-last-destination-v1";
const RAIL_EXPANDED_KEY = "study-rail-expanded-v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadHeadlineMap(): Record<string, StudyHeadline[]> {
  if (typeof window === "undefined") return {};
  return safeParse(localStorage.getItem(HEADLINES_KEY), {});
}

export function saveHeadlines(destinationId: string, headlines: StudyHeadline[]) {
  if (typeof window === "undefined") return;
  const map = loadHeadlineMap();
  map[destinationId] = headlines;
  localStorage.setItem(HEADLINES_KEY, JSON.stringify(map));
}

export function loadLessonMap(): Record<string, GeneratedLesson> {
  if (typeof window === "undefined") return {};
  return safeParse(localStorage.getItem(LESSONS_KEY), {});
}

export function lessonKey(destinationId: string, headlineId: string) {
  return `${destinationId}::${headlineId}`;
}

export function saveLesson(lesson: GeneratedLesson) {
  if (typeof window === "undefined") return;
  const map = loadLessonMap();
  map[lessonKey(lesson.destinationId, lesson.headlineId)] = lesson;
  localStorage.setItem(LESSONS_KEY, JSON.stringify(map));
}

export function mergeLessonMaps(
  local: Record<string, GeneratedLesson>,
  remote: GeneratedLesson[]
): Record<string, GeneratedLesson> {
  const merged = { ...local };
  for (const lesson of remote) {
    const key = lessonKey(lesson.destinationId, lesson.headlineId);
    const existing = merged[key];
    if (!existing || existing.generatedAt <= lesson.generatedAt) {
      merged[key] = lesson;
    }
  }
  return merged;
}

export function persistLessonMap(map: Record<string, GeneratedLesson>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LESSONS_KEY, JSON.stringify(map));
}

export function persistHeadlineMap(map: Record<string, StudyHeadline[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HEADLINES_KEY, JSON.stringify(map));
}

export function loadBookmarks(): StudyBookmark[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(BOOKMARKS_KEY), []);
}

export function saveBookmarks(bookmarks: StudyBookmark[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function upsertBookmark(bookmark: StudyBookmark) {
  const next = [bookmark, ...loadBookmarks().filter((b) => b.id !== bookmark.id)];
  saveBookmarks(next);
  return next;
}

export function removeBookmark(id: string) {
  const next = loadBookmarks().filter((b) => b.id !== id);
  saveBookmarks(next);
  return next;
}

export function loadProgress(): Record<string, HeadlineProgress> {
  if (typeof window === "undefined") return {};
  return safeParse(localStorage.getItem(PROGRESS_KEY), {});
}

export function setHeadlineStatus(progress: HeadlineProgress) {
  if (typeof window === "undefined") return;
  const map = loadProgress();
  map[progress.headlineId] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

export function loadLastDestination(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_DEST_KEY);
}

export function saveLastDestination(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_DEST_KEY, id);
}

export function loadRailExpanded(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(RAIL_EXPANDED_KEY) !== "0";
}

export function saveRailExpanded(expanded: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RAIL_EXPANDED_KEY, expanded ? "1" : "0");
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

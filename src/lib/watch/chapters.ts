export const CHAPTERS = [
  { id: "hero", numeral: "I", time: null },
  { id: "about", numeral: "II", time: [8, 40] },
  { id: "experience", numeral: "III", time: [20, 21] },
  { id: "projects", numeral: "IV", time: [10, 10] },
  { id: "skills", numeral: "V", time: [6, 0] },
  { id: "contact", numeral: "VI", time: [12, 0] },
] as const satisfies readonly { id: string; numeral: string; time: readonly [number, number] | null }[];

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export const CHAPTER_INDEX: Record<ChapterId, number> = CHAPTERS.reduce(
  (acc, chapter, index) => ({ ...acc, [chapter.id]: index }),
  {} as Record<ChapterId, number>,
);

/** Minutes on a 12h analog dial (0..720). */
export function dialMinutes(hours: number, minutes: number, seconds = 0) {
  return ((hours % 12) * 60 + minutes + seconds / 60) % 720;
}

export function nowDialMinutes() {
  const d = new Date();
  return dialMinutes(d.getHours(), d.getMinutes(), d.getSeconds());
}

/**
 * Dial reading while scrolling between chapters: hands always move forward,
 * the way a watch is set.
 */
export function chapterDialMinutes(chapterFloat: number, liveMinutes: number) {
  const max = CHAPTERS.length - 1;
  const f = Math.min(Math.max(chapterFloat, 0), max);
  const i = Math.min(Math.floor(f), max - 1);
  const frac = f - i;
  const at = (index: number) => {
    const time = CHAPTERS[index].time;
    return time ? dialMinutes(time[0], time[1]) : liveMinutes;
  };
  const a = at(i);
  const b = at(i + 1);
  const delta = (((b - a) % 720) + 720) % 720;
  const eased = frac * frac * (3 - 2 * frac);
  return a + delta * eased;
}

export function formatChapterTime(index: number, now: Date) {
  const time = CHAPTERS[index]?.time;
  const h = time ? time[0] : now.getHours();
  const m = time ? time[1] : now.getMinutes();
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

import * as THREE from "three";

type V3 = [number, number, number];

/**
 * Keyframes of the flight through the watch. Watch centre is the origin, dial faces +Z,
 * case radius ≈ 3.2, movement sits between z = -0.5 and z = 0.3.
 */
export const CAMERA_KEYS: { pos: V3; look: V3 }[] = [
  { pos: [0, 0, 11.5], look: [0, 0, 0] }, // 0  hero — the void
  { pos: [0.7, 0.5, 4.4], look: [0, 0.1, 0] }, // 1  approaching the crystal
  { pos: [1.8, 1.5, 3.0], look: [0.1, 0.25, -0.3] }, // 2  about — inside the movement
  { pos: [1.3, 0.15, 2.7], look: [-0.05, -0.2, -0.3] }, // 3  about — drift across the train
  { pos: [-1.5, 1.8, 2.85], look: [-0.4, 0.5, -0.3] }, // 4  experience — over the barrel
  { pos: [-1.75, -0.6, 2.6], look: [-0.2, -0.6, -0.3] }, // 5  experience — down the train
  { pos: [4.2, 1.9, 9.6], look: [-1.5, 0.1, 0] }, // 6  projects — pulled back
  { pos: [3.0, 1.2, 9.0], look: [-1.3, -0.1, 0] }, // 7  projects — slow drift
  { pos: [0.45, -0.95, 3.2], look: [0, -1.72, 0] }, // 8  skills — tourbillon close-up
  { pos: [-8.6, 0.6, 1.4], look: [0, 0, 0] }, // 9  orbiting to the back
  { pos: [-1.4, 0.35, -9.8], look: [-1.6, 0, -0.9] }, // 10 contact — case back
];

/** [enter, holdEnd] key index per chapter (same order as CHAPTERS). */
export const CHAPTER_SPANS: [number, number][] = [
  [0, 0],
  [2, 3],
  [4, 5],
  [6, 7],
  [8, 8],
  [10, 10],
];

export function createCurves() {
  const pos = new THREE.CatmullRomCurve3(
    CAMERA_KEYS.map((k) => new THREE.Vector3(...k.pos)),
    false,
    "catmullrom",
    0.5,
  );
  const look = new THREE.CatmullRomCurve3(
    CAMERA_KEYS.map((k) => new THREE.Vector3(...k.look)),
    false,
    "catmullrom",
    0.5,
  );
  return { pos, look };
}

const smooth = (x: number) => x * x * (3 - 2 * x);

/**
 * Maps chapter progress to a fractional key index. Inside a chapter the camera drifts
 * from `enter` to `holdEnd`; it only travels to the next chapter during the last
 * ~1.1 viewports of scroll, i.e. while the next section is sliding in.
 */
export function pathIndex(chapterFloat: number, anchors: number[], viewport: number) {
  const last = CHAPTER_SPANS.length - 1;
  const cf = Math.min(Math.max(chapterFloat, 0), last);
  const i = Math.min(Math.floor(cf), last);
  if (i >= last) return CHAPTER_SPANS[last][0];
  const f = cf - i;
  const length = Math.max(1, (anchors[i + 1] ?? 1) - (anchors[i] ?? 0));
  const start = Math.min(Math.max(1 - (viewport * 1.1) / length, 0), 0.92);
  const [enter, hold] = CHAPTER_SPANS[i];
  const next = CHAPTER_SPANS[i + 1][0];
  if (f < start) return enter + (hold - enter) * (f / start);
  return hold + (next - hold) * smooth((f - start) / (1 - start));
}

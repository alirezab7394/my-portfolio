import { meshPhase, meshPhaseInverse, pitchRadius, type Point, type ToothStyle } from "@/lib/watch/gear-profile";

export type MetalName = "brass" | "gold" | "steel";

export interface WheelPart {
  teeth: number;
  module: number;
  z: number;
  thickness: number;
  style?: ToothStyle;
  spokes?: number;
  material: MetalName;
}

export interface Arbor {
  id: string;
  pos: Point;
  wheel?: WheelPart;
  pinion?: WheelPart;
  /** Angular velocity relative to the centre wheel. */
  ratio: number;
  /** Rotation at master angle 0 that keeps every tooth pair meshed. */
  phase: number;
  /** Exploded-view layer. */
  layer: number;
}

const M = 0.03;
const deg = (d: number) => (d * Math.PI) / 180;
const from = ([x, y]: Point, r: number, angle: number): Point => [x + Math.cos(angle) * r, y + Math.sin(angle) * r];

export const PLATE_TOP = -0.48;
export const BRIDGE_Z = 0.27;
export const BALANCE_POS: Point = [-0.15, 1.95];
export const PALLET_POS: Point = [0.2, 1.52];
export const TOURBILLON_POS: Point = [0, -1.72];
export const ESCAPE_TEETH = 20;

/**
 * Going train: barrel → centre → third → fourth → escape.
 * Each wheel drives the next arbor's pinion; positions are derived from pitch radii so
 * the teeth genuinely mesh, and phases are solved so they interlock.
 */
function buildTrain() {
  const centerPinion = 24;
  const center: Arbor = {
    id: "center",
    pos: [0, 0],
    pinion: { teeth: centerPinion, module: M, z: -0.3, thickness: 0.09, material: "steel" },
    wheel: { teeth: 60, module: M, z: -0.4, thickness: 0.045, spokes: 5, material: "gold" },
    ratio: 1,
    phase: 0,
    layer: 1,
  };

  const barrelTeeth = 72;
  const barrelDir = deg(140);
  const barrel: Arbor = {
    id: "barrel",
    pos: from(center.pos, pitchRadius(barrelTeeth, M) + pitchRadius(centerPinion, M), barrelDir),
    wheel: { teeth: barrelTeeth, module: M, z: -0.3, thickness: 0.05, material: "brass" },
    ratio: (-center.ratio * centerPinion) / barrelTeeth,
    phase: meshPhaseInverse(center.phase, barrelDir - Math.PI, barrelTeeth, centerPinion),
    layer: 0,
  };

  const link = (
    driver: Arbor,
    id: string,
    angle: number,
    pinion: number,
    wheel: Omit<WheelPart, "z" | "thickness" | "material"> & Partial<WheelPart>,
    z: number,
    layer: number,
  ): Arbor => {
    const w = driver.wheel!;
    const theta = deg(angle);
    return {
      id,
      pos: from(driver.pos, pitchRadius(w.teeth, w.module) + pitchRadius(pinion, M), theta),
      pinion: { teeth: pinion, module: M, z: w.z, thickness: 0.085, material: "steel" },
      wheel: { thickness: 0.04, material: "gold", z, ...wheel },
      ratio: (-driver.ratio * w.teeth) / pinion,
      phase: meshPhase(driver.phase, theta, w.teeth, pinion),
      layer,
    };
  };

  const third = link(center, "third", -20, 20, { teeth: 54, module: M, spokes: 5 }, -0.22, 2);
  const fourth = link(third, "fourth", 80, 18, { teeth: 48, module: M, spokes: 4 }, -0.06, 3);
  const escape = link(
    fourth,
    "escape",
    150,
    14,
    { teeth: ESCAPE_TEETH, module: 0.042, style: "escape", spokes: 4, material: "steel" },
    0.08,
    4,
  );

  return [barrel, center, third, fourth, escape];
}

export const TRAIN = buildTrain();
export const ESCAPE_RATIO = TRAIN[TRAIN.length - 1].ratio;

const arborPos = (id: string) => TRAIN.find((a) => a.id === id)!.pos;

/** Skeleton bridges as polylines; each segment becomes a bevelled bar. */
export const BRIDGES: { points: Point[]; width: number }[] = [
  { points: [[2.25, -1.05], arborPos("third"), arborPos("fourth"), arborPos("escape")], width: 0.2 },
  { points: [[-2.3, 0.3], arborPos("barrel"), [-1.55, 1.8]], width: 0.26 },
  { points: [[-1.05, -0.95], arborPos("center"), [1.0, -0.95]], width: 0.16 },
  { points: [[1.2, 2.1], BALANCE_POS], width: 0.24 },
  { points: [[-1.0, -2.36], TOURBILLON_POS, [1.0, -2.36]], width: 0.14 },
];

export const JEWELS: Point[] = [...TRAIN.map((a) => a.pos), BALANCE_POS, PALLET_POS, TOURBILLON_POS];

export const SCREWS: Point[] = [
  [2.25, -1.05],
  [-2.3, 0.3],
  [-1.55, 1.8],
  [-1.05, -0.95],
  [1.0, -0.95],
  [1.2, 2.1],
  [-1.0, -2.36],
  [1.0, -2.36],
];

/** Decorative keyless-works wheels (desktop only). */
export const KEYLESS: { pos: Point; teeth: number; z: number; ratio: number }[] = [
  { pos: [2.15, -0.12], teeth: 26, z: 0.15, ratio: 1 },
  { pos: [2.33, 0.58], teeth: 14, z: 0.15, ratio: -26 / 14 },
];

/**
 * Pure 2D gear outlines, shared by the WebGL movement (extruded) and the SVG fallbacks.
 * Tooth i is centred on angle i * (2π / teeth), which the meshing maths relies on.
 */

export type ToothStyle = "involute" | "escape" | "ratchet";
export type Point = [number, number];

export function pitchRadius(teeth: number, module: number) {
  return (teeth * module) / 2;
}

const polar = (radius: number, angle: number): Point => [Math.cos(angle) * radius, Math.sin(angle) * radius];

export function gearOutline(teeth: number, module: number, style: ToothStyle = "involute"): Point[] {
  const r = pitchRadius(teeth, module);
  const p = (Math.PI * 2) / teeth;
  const pts: Point[] = [];

  if (style === "escape") {
    const ro = r + module * 1.6;
    const rr = r - module * 0.7;
    for (let i = 0; i < teeth; i++) {
      const c = i * p;
      pts.push(polar(rr, c - 0.5 * p));
      pts.push(polar(rr * 1.01, c - 0.2 * p));
      pts.push(polar(ro, c + 0.08 * p));
      pts.push(polar(ro * 0.985, c + 0.16 * p));
      pts.push(polar(rr * 1.04, c + 0.32 * p));
    }
    return pts;
  }

  if (style === "ratchet") {
    const ro = r + module;
    const rr = r - module;
    for (let i = 0; i < teeth; i++) {
      const c = i * p;
      pts.push(polar(rr, c - 0.45 * p));
      pts.push(polar(ro, c + 0.4 * p));
      pts.push(polar(rr, c + 0.47 * p));
    }
    return pts;
  }

  const ro = r + module;
  const rr = r - 1.25 * module;
  for (let i = 0; i < teeth; i++) {
    const c = i * p;
    pts.push(polar(rr, c - 0.5 * p));
    pts.push(polar(rr, c - 0.31 * p));
    pts.push(polar(r, c - 0.2 * p));
    pts.push(polar(ro * 0.985, c - 0.12 * p));
    pts.push(polar(ro, c));
    pts.push(polar(ro * 0.985, c + 0.12 * p));
    pts.push(polar(r, c + 0.2 * p));
    pts.push(polar(rr, c + 0.31 * p));
  }
  return pts;
}

export interface SpokeOptions {
  inner: number;
  outer: number;
  count: number;
  /** Linear spoke width. */
  width: number;
  /** Angular sweep of each spoke from hub to rim (radians) — gives the arabesque curve. */
  twist?: number;
  steps?: number;
}

/** Cut-outs between curved spokes. Each hole is a closed polygon. */
export function spokeHoles({ inner, outer, count, width, twist = 0.5, steps = 10 }: SpokeOptions): Point[][] {
  const seg = (Math.PI * 2) / count;
  const holes: Point[][] = [];
  for (let k = 0; k < count; k++) {
    const hole: Point[] = [];
    const a0 = k * seg;
    const a1 = (k + 1) * seg;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const rho = inner + (outer - inner) * t;
      hole.push(polar(rho, a0 + twist * t * t + width / (2 * rho)));
    }
    const outStart = a0 + twist + width / (2 * outer);
    const outEnd = a1 + twist - width / (2 * outer);
    for (let s = 1; s < steps; s++) hole.push(polar(outer, outStart + ((outEnd - outStart) * s) / steps));
    for (let s = steps; s >= 0; s--) {
      const t = s / steps;
      const rho = inner + (outer - inner) * t;
      hole.push(polar(rho, a1 + twist * t * t - width / (2 * rho)));
    }
    const inStart = a1 - width / (2 * inner);
    const inEnd = a0 + width / (2 * inner);
    for (let s = 1; s < steps; s++) hole.push(polar(inner, inStart + ((inEnd - inStart) * s) / steps));
    holes.push(hole);
  }
  return holes;
}

export function toSvgPath(points: Point[], scale = 1): string {
  return (
    points
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${(x * scale).toFixed(2)} ${(y * scale).toFixed(2)}`)
      .join("") + "Z"
  );
}

/**
 * Rotation of a driven gear B so its gaps line up with the teeth of driver A.
 * theta = direction from A's centre to B's centre.
 */
export function meshPhase(angleA: number, theta: number, teethA: number, teethB: number) {
  return -(angleA - theta) * (teethA / teethB) + theta + Math.PI - Math.PI / teethB;
}

/** Inverse of meshPhase: driver angle that matches a known driven angle. */
export function meshPhaseInverse(angleB: number, theta: number, teethA: number, teethB: number) {
  return theta - (angleB - theta - Math.PI + Math.PI / teethB) * (teethB / teethA);
}

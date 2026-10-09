import type { Point } from "./gear-profile";

/** Eight-pointed khatam star (two interlaced squares) as a closed outline. */
export function khatamStar(cx: number, cy: number, r: number, rotation = 0): Point[] {
  const inner = (r * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  const pts: Point[] = [];
  for (let i = 0; i < 16; i++) {
    const a = rotation + (i * Math.PI) / 8;
    const radius = i % 2 === 0 ? r : inner;
    pts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius]);
  }
  return pts;
}

/** Star polygon {n/k}: returns segments [x1, y1, x2, y2]. */
export function starPolygon(cx: number, cy: number, r: number, n: number, k: number, rotation = -Math.PI / 2) {
  const segments: [number, number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a1 = rotation + (i * Math.PI * 2) / n;
    const a2 = rotation + (((i + k) % n) * Math.PI * 2) / n;
    segments.push([cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, cx + Math.cos(a2) * r, cy + Math.sin(a2) * r]);
  }
  return segments;
}

/**
 * Girih-style rosette: two nested star polygons plus petal spokes.
 * Used for the dial centre, the caseback and the SVG fallback.
 */
export function rosette(cx: number, cy: number, r: number, n = 10) {
  return [
    ...starPolygon(cx, cy, r, n, 3),
    ...starPolygon(cx, cy, r * 0.62, n, 3, -Math.PI / 2 + Math.PI / n),
    ...Array.from({ length: n }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / n + Math.PI / n;
      return [
        cx + Math.cos(a) * r * 0.38,
        cy + Math.sin(a) * r * 0.38,
        cx + Math.cos(a) * r * 1.08,
        cy + Math.sin(a) * r * 1.08,
      ] as [number, number, number, number];
    }),
  ];
}

export function pointsToSvg(points: Point[]) {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join("") + "Z";
}

export function segmentsToSvg(segments: [number, number, number, number][]) {
  return segments
    .map(([x1, y1, x2, y2]) => `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`)
    .join("");
}

import * as THREE from "three";
import { gearOutline, pitchRadius, spokeHoles, type Point, type ToothStyle } from "@/lib/watch/gear-profile";
import { khatamStar } from "@/lib/watch/girih";

export interface GearSpec {
  teeth: number;
  module: number;
  thickness: number;
  style?: ToothStyle;
  spokes?: number;
  spokeWidth?: number;
  twist?: number;
  bore?: number;
  rimWidth?: number;
  hubRadius?: number;
  curveSegments?: number;
}

const cache = new Map<string, THREE.BufferGeometry>();

function memo(key: string, build: () => THREE.BufferGeometry) {
  const hit = cache.get(key);
  if (hit) return hit;
  const geometry = build();
  cache.set(key, geometry);
  return geometry;
}

const toVec = (points: Point[]) => points.map(([x, y]) => new THREE.Vector2(x, y));

function extrude(shape: THREE.Shape, depth: number, bevel: number, curveSegments = 10) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel * 0.75,
    bevelSegments: 2,
    curveSegments,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

/** Extruded gear with optional curved (arabesque) spokes and a bore for the arbor. */
export function gearGeometry(spec: GearSpec) {
  return memo(`gear:${JSON.stringify(spec)}`, () => {
    const { teeth, module, thickness, style = "involute", spokes = 0, twist = 0.5, bore = 0.026 } = spec;
    const shape = new THREE.Shape(toVec(gearOutline(teeth, module, style)));
    const r = pitchRadius(teeth, module);
    if (spokes > 0) {
      const root = style === "escape" ? r - module * 0.7 : r - module * 1.25;
      const outer = root - (spec.rimWidth ?? Math.max(module * 2.2, r * 0.09));
      const inner = spec.hubRadius ?? Math.max(bore * 2.8, r * 0.2);
      const holes = spokeHoles({ inner, outer, count: spokes, width: spec.spokeWidth ?? r * 0.07, twist });
      holes.forEach((hole) => shape.holes.push(new THREE.Path(toVec(hole))));
    }
    if (bore > 0) {
      const hole = new THREE.Path();
      hole.absarc(0, 0, bore, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
    const bevel = Math.min(thickness * 0.16, module * 0.3);
    return extrude(shape, thickness, bevel, spec.curveSegments ?? 8);
  });
}

/** Rounded bar from `a` to `b` (bridge segment), lying in XY. */
export function capsuleGeometry(length: number, width: number, depth: number) {
  return memo(`capsule:${length.toFixed(3)}:${width}:${depth}`, () => {
    const w = width / 2;
    const shape = new THREE.Shape();
    shape.moveTo(0, -w);
    shape.lineTo(length, -w);
    shape.absarc(length, 0, w, -Math.PI / 2, Math.PI / 2, false);
    shape.lineTo(0, w);
    shape.absarc(0, 0, w, Math.PI / 2, (Math.PI * 3) / 2, false);
    return extrude(shape, depth, depth * 0.3, 16);
  });
}

/** Disc with spoke cut-outs — tourbillon cage plates. */
export function cageGeometry(radius: number, arms: number, thickness: number) {
  return memo(`cage:${radius}:${arms}:${thickness}`, () => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    spokeHoles({ inner: radius * 0.22, outer: radius * 0.84, count: arms, width: radius * 0.16, twist: 0.7 }).forEach(
      (hole) => shape.holes.push(new THREE.Path(toVec(hole))),
    );
    return extrude(shape, thickness, thickness * 0.25, 24);
  });
}

/** Half-moon automatic rotor with khatam-star cut-outs. */
export function rotorGeometry(radius: number, thickness: number) {
  return memo(`rotor:${radius}:${thickness}`, () => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius, Math.PI * 0.02, Math.PI * 0.98, false);
    shape.absarc(0, 0, radius * 0.14, Math.PI * 0.98, Math.PI * 2.02, false);
    [0.3, 0.5, 0.7].forEach((t) => {
      const a = Math.PI * t;
      const star = khatamStar(Math.cos(a) * radius * 0.62, Math.sin(a) * radius * 0.62, radius * 0.15, a);
      shape.holes.push(new THREE.Path(toVec(star.slice().reverse())));
    });
    return extrude(shape, thickness, thickness * 0.3, 32);
  });
}

export function handGeometry(kind: "hour" | "minute", lume = false) {
  return memo(`hand:${kind}:${lume}`, () => {
    const length = kind === "hour" ? 1.38 : 2.08;
    const width = kind === "hour" ? 0.1 : 0.075;
    const tail = 0.26;
    const shape = new THREE.Shape();
    if (lume) {
      shape.moveTo(width * 0.34, length * 0.26);
      shape.lineTo(0, length * 0.86);
      shape.lineTo(-width * 0.34, length * 0.26);
      shape.lineTo(0, length * 0.2);
    } else {
      shape.moveTo(0, -tail);
      shape.lineTo(width * 0.55, -tail * 0.15);
      shape.lineTo(width, length * 0.17);
      shape.lineTo(0, length);
      shape.lineTo(-width, length * 0.17);
      shape.lineTo(-width * 0.55, -tail * 0.15);
    }
    shape.closePath();
    return extrude(shape, lume ? 0.006 : 0.016, lume ? 0 : 0.005, 4);
  });
}

export function secondsHandGeometry() {
  return memo("hand:seconds", () => {
    const shape = new THREE.Shape();
    const w = 0.009;
    shape.moveTo(-w, -0.5);
    shape.lineTo(w, -0.5);
    shape.lineTo(w * 0.5, 2.0);
    shape.lineTo(-w * 0.5, 2.0);
    shape.closePath();
    return extrude(shape, 0.01, 0.002, 2);
  });
}

export function starGeometry(radius: number, depth: number) {
  return memo(`star:${radius}:${depth}`, () => extrude(new THREE.Shape(toVec(khatamStar(0, 0, radius))), depth, depth * 0.3, 2));
}

/** Dial disc with a 6 o'clock aperture for the tourbillon; UVs mapped to the disc. */
export function dialGeometry(radius: number, aperture: { x: number; y: number; r: number }) {
  return memo(`dial:${radius}:${aperture.x}:${aperture.y}:${aperture.r}`, () => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(aperture.x, aperture.y, aperture.r, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geometry = new THREE.ShapeGeometry(shape, 96);
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / (2 * radius) + 0.5, pos.getY(i) / (2 * radius) + 0.5);
    uv.needsUpdate = true;
    return geometry;
  });
}

/** Lathe profile given as [radius, z] pairs, revolved around the Z axis. */
export function latheZ(key: string, profile: Point[], segments: number) {
  return memo(`lathe:${key}:${segments}`, () => {
    const geometry = new THREE.LatheGeometry(
      profile.map(([r, z]) => new THREE.Vector2(r, z)),
      segments,
    );
    geometry.rotateX(Math.PI / 2);
    return geometry;
  });
}

/** Knurled crown: a cylinder whose rim alternates radius to read as fine ribs. */
export function crownGeometry() {
  return memo("crown", () => {
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.34, 72, 1, false);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z);
      if (r > 0.29) {
        const a = Math.atan2(z, x);
        const k = Math.round((a / (Math.PI * 2)) * 72) % 2 === 0 ? 1 : 0.94;
        pos.setX(i, Math.cos(a) * 0.3 * k);
        pos.setZ(i, Math.sin(a) * 0.3 * k);
      }
    }
    geometry.computeVertexNormals();
    geometry.rotateZ(Math.PI / 2);
    return geometry;
  });
}

export function roundedBoxShapeGeometry(width: number, height: number, depth: number, radius: number) {
  return memo(`rbox:${width}:${height}:${depth}:${radius}`, () => {
    const shape = new THREE.Shape();
    const w = width / 2;
    const h = height / 2;
    shape.moveTo(-w + radius, -h);
    shape.lineTo(w - radius, -h);
    shape.absarc(w - radius, -h + radius, radius, -Math.PI / 2, 0, false);
    shape.lineTo(w, h - radius);
    shape.absarc(w - radius, h - radius, radius, 0, Math.PI / 2, false);
    shape.lineTo(-w + radius, h);
    shape.absarc(-w + radius, h - radius, radius, Math.PI / 2, Math.PI, false);
    shape.lineTo(-w, -h + radius);
    shape.absarc(-w + radius, -h + radius, radius, Math.PI, Math.PI * 1.5, false);
    return extrude(shape, depth, depth * 0.18, 8);
  });
}

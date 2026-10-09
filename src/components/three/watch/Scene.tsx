"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { getUi, scene, setUi } from "@/lib/watch/store";
import CameraRig from "./CameraRig";
import Case from "./Case";
import Effects from "./Effects";
import Face, { introSeconds } from "./Face";
import Movement from "./Movement";
import Tourbillon from "./Tourbillon";
import { Dust, Lighting, VoidGears } from "./Atmosphere";
import type { DialCopy, EngravingCopy } from "./textures";

export interface SceneCopy {
  dial: DialCopy;
  inner: EngravingCopy;
  outer: EngravingCopy;
  locale: string;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Pointer tilt with a damped spring (critically under-damped for a little life),
 * intro materialisation, the hero "recede" behind the name, and the exploded-view easing.
 */
function WatchRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const spring = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 30);
    const s = spring.current;
    const cf = scene.chapterFloat;
    const heroWeight = 1 - clamp01(cf * 1.5);
    const weight = 0.25 + 0.75 * heroWeight;

    const tx = -scene.pointer.y * 0.28 * weight;
    const ty = scene.pointer.x * 0.38 * weight;
    const stiffness = 38;
    const damping = 7.5;
    s.vx += ((tx - s.x) * stiffness - s.vx * damping) * dt;
    s.vy += ((ty - s.y) * stiffness - s.vy * damping) * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;

    const t = introSeconds();
    const m = 1 - (1 - clamp01(t / 1.8)) ** 3;
    const recede = clamp01((t - 2.4) / 1.3) * heroWeight;

    g.rotation.x = s.x;
    g.rotation.y = s.y;
    g.rotation.z = (1 - m) * -0.6;
    g.scale.setScalar(0.78 + 0.22 * m);
    g.position.z = -recede * 1.6;
    g.position.y = recede * 0.15;

    const target = getUi().exploded ? 1 : 0;
    scene.explode += (target - scene.explode) * (1 - Math.exp(-3 * dt));
    if (Math.abs(scene.explode - target) < 0.0005) scene.explode = target;
  });

  return <group ref={group}>{children}</group>;
}

function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) setUi({ sceneReady: true });
  });
  return null;
}

export default function Scene({ lite, copy }: { lite: boolean; copy: SceneCopy }) {
  return (
    <>
      <color attach="background" args={["#07080A"]} />
      <fog attach="fog" args={["#07080A", 14, 34]} />
      <CameraRig />
      <Lighting lite={lite} />
      <WatchRig>
        <Case lite={lite} inner={copy.inner} outer={copy.outer} locale={copy.locale} />
        <Movement lite={lite} />
        <Tourbillon lite={lite} />
        <Face copy={copy.dial} />
      </WatchRig>
      <VoidGears lite={lite} />
      <Dust count={lite ? 260 : 700} />
      {!lite && <Effects />}
      <ReadySignal />
    </>
  );
}

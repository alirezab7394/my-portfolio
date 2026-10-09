"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { scene } from "@/lib/watch/store";
import { gearGeometry } from "./geometry";
import { getMaterials } from "./materials";
import { introSeconds } from "./Face";
import { movementClock } from "./Movement";

const ease = (x: number) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3;

/** Studio lighting: a baked lightformer environment for reflections plus a light that follows the cursor. */
export function Lighting({ lite }: { lite: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const cursor = useRef<THREE.PointLight>(null);
  const three = useThree((s) => s.scene);
  const tmp = useMemo(() => ({ ray: new THREE.Vector3(), target: new THREE.Vector3() }), []);

  useFrame(({ camera }) => {
    const m = ease(introSeconds() / 1.6);
    three.environmentIntensity = 0.04 + 0.96 * m;
    if (key.current) key.current.intensity = 2.4 * m;
      if (rim.current) rim.current.intensity = 0.9 * m;
    const light = cursor.current;
    if (light) {
      tmp.ray.set(scene.pointer.x, scene.pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const distance = THREE.MathUtils.clamp(camera.position.length() * 0.45, 0.7, 5);
      tmp.target.copy(camera.position).addScaledVector(tmp.ray, distance);
      light.position.lerp(tmp.target, 0.18);
      light.intensity = (lite ? 10 : 16) * m * (distance / 5) ** 1.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.06} />
      <directionalLight ref={key} position={[3, 5, 6]} color="#ffe2b0" intensity={0} />
      <directionalLight ref={rim} position={[-6, -2, -5]} color="#bfe6f2" intensity={0} />
      <pointLight ref={cursor} color="#fff1d6" intensity={0} distance={10} decay={2} />
      <Environment resolution={lite ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#fff1da" position={[0, 5, 5]} scale={[10, 2.2, 1]} rotation-x={Math.PI / 2.6} />
        <Lightformer form="rect" intensity={1.1} color="#ffffff" position={[-6, 1, 3]} scale={[2, 9, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={0.9} color="#d6eef5" position={[6, -1, -2]} scale={[1.5, 7, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1.3} color="#ffe2b0" position={[0, 0, 8]} scale={4} />
        <Lightformer form="rect" intensity={0.9} color="#c8a15a" position={[0, -5, -6]} scale={[12, 3, 1]} rotation-x={-Math.PI / 3} />
      </Environment>
    </>
  );
}

const VOID_GEARS = [
  { pos: [-9, 4.5, -11], teeth: 90, rot: 0.04, metal: "bridge" },
  { pos: [10, -5, -14], teeth: 120, rot: -0.025, metal: "bridge" },
  { pos: [7.5, 6, -8], teeth: 48, rot: 0.08, metal: "brass" },
  { pos: [-11, -6.5, -6], teeth: 64, rot: -0.05, metal: "bridge" },
  { pos: [0, 9, -16], teeth: 140, rot: 0.02, metal: "bridge" },
  { pos: [-6, 0, 10], teeth: 40, rot: -0.09, metal: "brass" },
  { pos: [6, -2, 12], teeth: 56, rot: 0.06, metal: "bridge" },
] as const;

/** Huge, slow gears floating in the void — depth cues for the camera flight. */
export function VoidGears({ lite }: { lite: boolean }) {
  const materials = getMaterials();
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const gears = lite ? VOID_GEARS.slice(0, 3) : VOID_GEARS;
  useFrame(() => {
    gears.forEach((g, i) => {
      const mesh = refs.current[i];
      if (mesh) mesh.rotation.z = movementClock.time * g.rot + movementClock.scrollPhase * g.rot * 4;
    });
  });
  return (
    <>
      {gears.map((g, i) => (
        <mesh
          key={i}
          ref={(el) => void (refs.current[i] = el)}
          position={g.pos as unknown as [number, number, number]}
          rotation-x={-0.25 + i * 0.13}
          rotation-y={0.3 - i * 0.11}
          geometry={gearGeometry({ teeth: g.teeth, module: 0.09, thickness: 0.25, spokes: 6, twist: 0.6, bore: 0.3, curveSegments: 4 })}
          material={g.metal === "brass" ? materials.brass : materials.bridge}
        />
      ))}
    </>
  );
}

export function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 26;
      positions[i * 3 + 1] = (rand() - 0.5) * 18;
      positions[i * 3 + 2] = (rand() - 0.5) * 30;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#e9cf98",
        size: 0.035,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    [],
  );
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.01;
    ref.current.rotation.x = scene.chapterFloat * 0.05;
  });
  return <points ref={ref} geometry={geometry} material={material} />;
}

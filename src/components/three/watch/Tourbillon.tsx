"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { scene } from "@/lib/watch/store";
import { cageGeometry, gearGeometry } from "./geometry";
import { getMaterials } from "./materials";
import { BEAT_HZ, movementClock } from "./Movement";
import { TOURBILLON_POS } from "./movement-layout";

/** Rotating carriage at 6 o'clock: cage plates, pillars, mini balance and escape wheel. */
export default function Tourbillon({ lite }: { lite: boolean }) {
  const materials = getMaterials();
  const cage = useRef<THREE.Group>(null);
  const balance = useRef<THREE.Group>(null);
  const escape = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = movementClock.time;
    if (cage.current) cage.current.rotation.z = -(t * 0.42 + movementClock.scrollPhase * 0.6);
    if (balance.current) balance.current.rotation.z = Math.sin(t * Math.PI * BEAT_HZ * 1.2) * 2.6;
    if (escape.current) escape.current.rotation.z = Math.floor(t * BEAT_HZ * 1.2) * (Math.PI / 15);
    if (root.current) root.current.position.z = scene.explode * 1.7;
  });

  const pillars = [0, 1, 2].map((i) => (i * Math.PI * 2) / 3 + Math.PI / 6);

  return (
    <group ref={root}>
      <group position={[TOURBILLON_POS[0], TOURBILLON_POS[1], 0]}>
        <mesh material={materials.steel}>
          <torusGeometry args={[0.66, 0.022, 10, lite ? 48 : 96]} />
        </mesh>
        <group ref={cage}>
          <mesh geometry={cageGeometry(0.56, 3, 0.03)} material={materials.steel} position-z={-0.16} />
          <mesh geometry={cageGeometry(0.5, 3, 0.03)} material={materials.steel} position-z={0.2} />
          {pillars.map((a, i) => (
            <mesh key={i} material={materials.steel} position={[Math.cos(a) * 0.46, Math.sin(a) * 0.46, 0.02]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.022, 0.022, 0.36, 8]} />
            </mesh>
          ))}
          <group ref={balance} position-z={0.06}>
            <mesh material={materials.gold}>
              <torusGeometry args={[0.32, 0.022, 10, 64]} />
            </mesh>
            {[0, 1, 2].map((i) => (
              <mesh key={i} material={materials.gold} rotation-z={(i * Math.PI * 2) / 3}>
                <boxGeometry args={[0.62, 0.025, 0.02]} />
              </mesh>
            ))}
          </group>
          <group ref={escape} position={[0.22, -0.14, -0.06]}>
            <mesh
              geometry={gearGeometry({ teeth: 15, module: 0.022, thickness: 0.025, style: "escape", spokes: 3 })}
              material={materials.steel}
            />
          </group>
          <mesh material={materials.ruby} position-z={0.22} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { chapterDialMinutes, nowDialMinutes } from "@/lib/watch/chapters";
import { scene } from "@/lib/watch/store";
import { dialGeometry, handGeometry, secondsHandGeometry, starGeometry } from "./geometry";
import { getMaterials } from "./materials";
import { TOURBILLON_POS } from "./movement-layout";
import { cssFont, drawDial, toTexture, type DialCopy } from "./textures";

export const DIAL_RADIUS = 2.52;
const APERTURE = { x: TOURBILLON_POS[0], y: TOURBILLON_POS[1], r: 0.72 };
const DIAL_Z = 0.36;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const easeOutBack = (x: number) => 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2;

export function introSeconds() {
  return scene.introStart < 0 ? 0 : (performance.now() - scene.introStart) / 1000;
}

function useDialTexture(copy: DialCopy) {
  const texture = useMemo(() => toTexture(drawDial(copy, DIAL_RADIUS, APERTURE), { srgb: true }), [copy]);
  useEffect(() => {
    let cancelled = false;
    const families = [
      cssFont("--font-instrument-serif", "serif"),
      cssFont("--font-inter-tight", "sans-serif"),
      cssFont("--font-jetbrains-mono", "monospace"),
      ...(copy.locale === "fa" ? [cssFont("--font-naskh", "serif")] : []),
    ];
    Promise.all(families.map((family) => document.fonts?.load(`64px ${family}`, copy.brand) ?? Promise.resolve()))
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        texture.image = drawDial(copy, DIAL_RADIUS, APERTURE);
        texture.needsUpdate = true;
      });
    return () => {
      cancelled = true;
    };
  }, [copy, texture]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

export default function Face({ copy }: { copy: DialCopy }) {
  const materials = getMaterials();
  const texture = useDialTexture(copy);
  const dialMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ map: texture, metalness: 0.55, roughness: 0.42, transparent: true }),
    [texture],
  );
  const indexMaterial = useMemo(() => {
    const m = materials.gold.clone();
    m.transparent = true;
    return m;
  }, [materials.gold]);

  const dial = useRef<THREE.Group>(null);
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);
  const hands = useRef<THREE.Group>(null);

  const indices = useMemo(() => [1, 2, 4, 5, 7, 8, 10, 11].map((h) => (h / 12) * Math.PI * 2), []);

  useFrame(() => {
    const cf = scene.chapterFloat;
    const t = introSeconds();
    const explode = scene.explode;

    const visible = Math.max(1 - smoothstep(0.04, 0.4, cf), smoothstep(4.3, 4.95, cf));
    const morph = clamp01((t - 2.4) / 1.2);
    const brightness = 1 - 0.45 * morph * (1 - smoothstep(0, 0.2, cf));
    dialMaterial.opacity = visible;
    dialMaterial.color.setScalar(brightness);
    indexMaterial.opacity = visible;
    if (dial.current) {
      dial.current.visible = visible > 0.01;
      dial.current.position.z = explode * 3.2;
    }

    const sweep = easeInOutCubic(clamp01((t - 0.5) / 1.9));
    const minutes = chapterDialMinutes(cf, nowDialMinutes()) * sweep;
    const now = Date.now() / 1000;
    const whole = Math.floor(now);
    const seconds = ((whole % 60) + easeOutBack(Math.min((now - whole) * 7, 1))) * sweep;

    if (hour.current) hour.current.rotation.z = -(minutes / 720) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -((minutes % 60) / 60) * Math.PI * 2;
    if (second.current) second.current.rotation.z = -(seconds / 60) * Math.PI * 2;
    if (hands.current) {
      hands.current.position.z = explode * 3.9;
      hands.current.visible = visible > 0.01;
      hands.current.scale.setScalar(Math.max(visible, 0.001));
    }
  });

  return (
    <group>
      <group ref={dial} position-z={0}>
        <mesh geometry={dialGeometry(DIAL_RADIUS, APERTURE)} material={dialMaterial} position-z={DIAL_Z} />
        {indices.map((a, i) => (
          <mesh
            key={i}
            material={indexMaterial}
            position={[Math.sin(a) * 1.98, Math.cos(a) * 1.98, DIAL_Z + 0.02]}
            rotation-z={-a}
          >
            <boxGeometry args={[0.055, 0.26, 0.03]} />
          </mesh>
        ))}
      </group>

      <group ref={hands}>
        <group ref={hour} position-z={0.41}>
          <mesh geometry={handGeometry("hour")} material={materials.gold} />
          <mesh geometry={handGeometry("hour", true)} material={materials.lume} position-z={0.012} />
        </group>
        <group ref={minute} position-z={0.44}>
          <mesh geometry={handGeometry("minute")} material={materials.gold} />
          <mesh geometry={handGeometry("minute", true)} material={materials.lume} position-z={0.012} />
        </group>
        <group ref={second} position-z={0.47}>
          <mesh geometry={secondsHandGeometry()} material={materials.steel} />
          <mesh geometry={starGeometry(0.075, 0.01)} material={materials.steel} position-y={-0.36} />
          <mesh material={materials.lume} position={[0, 1.88, 0.004]}>
            <boxGeometry args={[0.022, 0.26, 0.008]} />
          </mesh>
        </group>
        <mesh material={materials.gold} rotation-x={Math.PI / 2} position-z={0.49}>
          <cylinderGeometry args={[0.06, 0.07, 0.04, 24]} />
        </mesh>
      </group>
    </group>
  );
}

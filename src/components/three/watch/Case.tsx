"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/watch/store";
import { crownGeometry, latheZ, rotorGeometry, roundedBoxShapeGeometry } from "./geometry";
import { getMaterials } from "./materials";
import { cssFont, drawEngraving, toTexture, type EngravingCopy } from "./textures";

const CASE_PROFILE: [number, number][] = [
  [2.62, -0.7],
  [2.92, -0.72],
  [3.08, -0.64],
  [3.18, -0.42],
  [3.21, -0.1],
  [3.18, 0.22],
  [3.08, 0.44],
  [2.92, 0.58],
  [2.72, 0.64],
  [2.64, 0.61],
  [2.62, 0.5],
  [2.62, -0.7],
];
const BACK_BEZEL: [number, number][] = [
  [2.1, -0.7],
  [2.62, -0.7],
  [2.66, -0.78],
  [2.5, -0.85],
  [2.1, -0.85],
  [2.1, -0.7],
];
const REHAUT: [number, number][] = [
  [2.5, 0.37],
  [2.62, 0.56],
  [2.62, 0.37],
  [2.5, 0.37],
];
const LID_R = 2.62;
const HINGE_X = -2.66;
const LID_Z = -0.9;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function useEngraving(copy: EngravingCopy, locale: string) {
  const texture = useMemo(() => {
    const t = toTexture(drawEngraving(copy, locale), { srgb: true });
    // Cylinder cap UVs end up a quarter turn off once the lid is rotated onto the Z axis.
    t.center.set(0.5, 0.5);
    t.rotation = Math.PI / 2;
    return t;
  }, [copy, locale]);
  useEffect(() => {
    let cancelled = false;
    const family = locale === "fa" ? cssFont("--font-naskh", "serif") : cssFont("--font-instrument-serif", "serif");
    Promise.all([
      document.fonts?.load(`italic 108px ${family}`, copy.lines.join(" ")),
      document.fonts?.load(`30px ${cssFont("--font-jetbrains-mono", "monospace")}`),
    ])
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        texture.image = drawEngraving(copy, locale);
        texture.needsUpdate = true;
      });
    return () => {
      cancelled = true;
    };
  }, [copy, locale, texture]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

export default function Case({
  lite,
  inner,
  outer,
  locale,
}: {
  lite: boolean;
  inner: EngravingCopy;
  outer: EngravingCopy;
  locale: string;
}) {
  const materials = getMaterials();
  const segments = lite ? 96 : 180;
  const innerTex = useEngraving(inner, locale);
  const outerTex = useEngraving(outer, locale);
  const lidMaterials = useMemo(
    () => [
      materials.caseMetal,
      new THREE.MeshStandardMaterial({ map: innerTex, bumpMap: innerTex, bumpScale: 1.5, metalness: 1, roughness: 0.32 }),
      new THREE.MeshStandardMaterial({ map: outerTex, bumpMap: outerTex, bumpScale: 1.5, metalness: 1, roughness: 0.3 }),
    ],
    [materials.caseMetal, innerTex, outerTex],
  );

  const crown = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const hinge = useRef<THREE.Group>(null);
  const rotor = useRef<THREE.Group>(null);
  const back = useRef<THREE.Group>(null);
  const motion = useRef({ open: 0, rotor: 0, rotorVel: 0 });

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const cf = scene.chapterFloat;
    const explode = scene.explode;
    const m = motion.current;

    if (crown.current) crown.current.rotation.x = scene.scroll * 0.006;

    if (crystal.current) {
      crystal.current.position.z = explode * 4.4;
      const inside = Math.hypot(camera.position.x, camera.position.y) < 3.2 && camera.position.z < 3.5 && camera.position.z > -0.9;
      crystal.current.visible = !inside;
    }

    const target = smoothstep(4.5, 4.95, cf);
    m.open += (target - m.open) * (1 - Math.exp(-3.2 * dt));
    if (hinge.current) {
      hinge.current.rotation.y = m.open * 2.55;
    }
    if (back.current) back.current.position.z = -explode * 2.2;

    const rotorTarget = scene.scroll * 0.0022;
    m.rotorVel += ((rotorTarget - m.rotor) * 14 - m.rotorVel * 4.5) * dt;
    m.rotor += m.rotorVel * dt;
    if (rotor.current) rotor.current.rotation.z = m.rotor + Math.sin(performance.now() / 2400) * 0.08;
  });

  const lugs = useMemo(
    () =>
      [
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
      ] as const,
    [],
  );

  return (
    <group>
      <mesh geometry={latheZ("case", CASE_PROFILE, segments)} material={materials.caseMetal} />
      <mesh geometry={latheZ("rehaut", REHAUT, segments)} material={materials.obsidianPolished} />
      {lugs.map(([sx, sy], i) => (
        <mesh
          key={i}
          geometry={roundedBoxShapeGeometry(0.5, 1.15, 0.5, 0.18)}
          material={materials.caseMetal}
          position={[sx * 1.5, sy * 3.18, -0.12]}
          rotation-z={sx * sy * -0.12}
        />
      ))}

      <group position={[3.27, 0, -0.08]}>
        <mesh material={materials.steel} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.09, 0.09, 0.2, 16]} />
        </mesh>
        <group ref={crown} position-x={0.22}>
          <mesh geometry={crownGeometry()} material={materials.caseMetal} />
          <mesh material={materials.turquoise} position-x={0.18} scale={[0.35, 1, 1]}>
            <sphereGeometry args={[0.17, 24, 16]} />
          </mesh>
        </group>
      </group>

      <mesh ref={crystal} material={materials.crystal} rotation-x={Math.PI / 2} position-z={-13.16}>
        <sphereGeometry args={[14, lite ? 48 : 96, 6, 0, Math.PI * 2, 0, 0.1925]} />
      </mesh>

      <group ref={back}>
        <mesh geometry={latheZ("backBezel", BACK_BEZEL, segments)} material={materials.caseMetal} />
        <mesh material={materials.crystal} rotation-x={Math.PI / 2} position-z={-0.78}>
          <cylinderGeometry args={[2.1, 2.1, 0.02, 64]} />
        </mesh>
        <group ref={rotor} position-z={-0.66}>
          <mesh geometry={rotorGeometry(2.25, 0.05)} material={materials.gold} />
          <mesh material={materials.ruby} rotation-x={Math.PI / 2} position-z={-0.03}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
          </mesh>
        </group>
        <group ref={hinge} position={[HINGE_X, 0, LID_Z]}>
          <mesh material={lidMaterials} position-x={-HINGE_X} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[LID_R, LID_R, 0.08, segments]} />
          </mesh>
          <mesh material={materials.caseMetal}>
            <cylinderGeometry args={[0.09, 0.09, 0.9, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

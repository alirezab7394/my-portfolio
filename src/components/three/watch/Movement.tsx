"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/watch/store";
import { capsuleGeometry, gearGeometry } from "./geometry";
import { getMaterials } from "./materials";
import {
  BALANCE_POS,
  BRIDGES,
  BRIDGE_Z,
  ESCAPE_RATIO,
  ESCAPE_TEETH,
  JEWELS,
  KEYLESS,
  PALLET_POS,
  PLATE_TOP,
  SCREWS,
  TRAIN,
  type WheelPart,
} from "./movement-layout";

export const BEAT_HZ = 5;
const BALANCE_HZ = BEAT_HZ / 2;

/** Shared clock for every ticking part, advanced once per frame by <Movement/>. */
export const movementClock = { time: 0, scrollPhase: 0, speed: 1 };

const easeOutBack = (x: number) => {
  const c1 = 2.2;
  const c3 = c1 + 1;
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
};

function Wheel({ part, lite }: { part: WheelPart; lite: boolean }) {
  const materials = getMaterials();
  const geometry = gearGeometry({
    teeth: part.teeth,
    module: part.module,
    thickness: part.thickness,
    style: part.style,
    spokes: part.spokes,
    curveSegments: lite ? 4 : 8,
  });
  return <mesh geometry={geometry} material={materials[part.material]} position-z={part.z} />;
}

function Hairspring() {
  const line = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const turns = 9;
    for (let i = 0; i <= turns * 64; i++) {
      const t = i / 64;
      const r = 0.06 + t * 0.042;
      const a = t * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), getMaterials().hairspring);
  }, []);
  return <primitive object={line} position-z={0.05} />;
}

function Balance({ groupRef, springRef }: { groupRef: React.RefObject<THREE.Group | null>; springRef: React.RefObject<THREE.Group | null> }) {
  const materials = getMaterials();
  const screws = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);
  return (
    <group position={[BALANCE_POS[0], BALANCE_POS[1], 0.16]}>
      <group ref={groupRef}>
        <mesh material={materials.gold}>
          <torusGeometry args={[0.56, 0.035, 12, 96]} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={materials.gold} rotation-z={(i * Math.PI * 2) / 3}>
            <boxGeometry args={[1.08, 0.04, 0.03]} />
          </mesh>
        ))}
        {screws.map((a, i) => (
          <mesh key={i} material={materials.gold} position={[Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0]} rotation-z={a} >
            <boxGeometry args={[0.06, 0.035, 0.035]} />
          </mesh>
        ))}
      </group>
      <group ref={springRef}>
        <Hairspring />
      </group>
    </group>
  );
}

function Pallet({ palletRef }: { palletRef: React.RefObject<THREE.Group | null> }) {
  const materials = getMaterials();
  return (
    <group position={[PALLET_POS[0], PALLET_POS[1], 0.1]}>
      <group ref={palletRef}>
        <mesh material={materials.steel} rotation-z={-0.9}>
          <boxGeometry args={[0.62, 0.035, 0.025]} />
        </mesh>
        <mesh material={materials.steel} rotation-z={0.55} position={[0.05, -0.08, 0]}>
          <boxGeometry args={[0.38, 0.03, 0.025]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={materials.ruby} position={[s * 0.17, -0.2 + s * 0.04, 0]}>
            <boxGeometry args={[0.03, 0.08, 0.03]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Bridges() {
  const materials = getMaterials();
  const segments = useMemo(
    () =>
      BRIDGES.flatMap(({ points, width }) =>
        points.slice(1).map((b, i) => {
          const a = points[i];
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          return { a, length: Math.hypot(dx, dy), angle: Math.atan2(dy, dx), width };
        }),
      ),
    [],
  );
  return (
    <>
      {segments.map((s, i) => (
        <mesh
          key={i}
          geometry={capsuleGeometry(s.length, s.width, 0.05)}
          material={materials.bridge}
          position={[s.a[0], s.a[1], BRIDGE_Z]}
          rotation-z={s.angle}
        />
      ))}
    </>
  );
}

function Instanced({ points, z, kind }: { points: [number, number][]; z: number; kind: "jewel" | "screw" }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const materials = getMaterials();
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Object3D();
    points.forEach(([x, y], i) => {
      m.position.set(x, y, z);
      m.rotation.set(Math.PI / 2, 0, 0);
      m.updateMatrix();
      mesh.setMatrixAt(i, m.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [points, z]);
  return (
    <instancedMesh ref={ref} args={[undefined, kind === "jewel" ? materials.ruby : materials.blued, points.length]}>
      {kind === "jewel" ? <cylinderGeometry args={[0.045, 0.045, 0.03, 20]} /> : <cylinderGeometry args={[0.055, 0.06, 0.028, 18]} />}
    </instancedMesh>
  );
}

export default function Movement({ lite }: { lite: boolean }) {
  const materials = getMaterials();
  const arbors = useRef<(THREE.Group | null)[]>([]);
  const keyless = useRef<(THREE.Group | null)[]>([]);
  const balance = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Group>(null);
  const pallet = useRef<THREE.Group>(null);
  const bridges = useRef<THREE.Group>(null);
  const plate = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const clock = movementClock;
    const targetSpeed = 1 - 0.85 * scene.gearSlow;
    clock.speed += (targetSpeed - clock.speed) * (1 - Math.exp(-5 * dt));
    clock.time += dt * clock.speed;
    const velocity = Math.max(-45, Math.min(45, scene.velocity));
    clock.scrollPhase += velocity * 0.0018 * clock.speed;

    const beats = clock.time * BEAT_HZ;
    const beat = Math.floor(beats);
    const tick = beat + easeOutBack(Math.min((beats - beat) * 6, 1));
    const escapeAngle = tick * (Math.PI / ESCAPE_TEETH);
    const master = clock.scrollPhase + escapeAngle / ESCAPE_RATIO;
    const explode = scene.explode;

    TRAIN.forEach((arbor, i) => {
      const g = arbors.current[i];
      if (!g) return;
      g.rotation.z = arbor.phase + arbor.ratio * master;
      g.position.z = explode * arbor.layer * 0.42;
    });
    KEYLESS.forEach((k, i) => {
      const g = keyless.current[i];
      if (g) g.rotation.z = k.ratio * scene.scroll * 0.004;
    });

    const swing = Math.sin(clock.time * Math.PI * 2 * BALANCE_HZ);
    if (balance.current) balance.current.rotation.z = swing * 3.1;
    if (spring.current) {
      spring.current.rotation.z = swing * 0.6;
      spring.current.scale.setScalar(1 + swing * 0.05);
    }
    if (pallet.current) pallet.current.rotation.z = Math.tanh(swing * 6) * 0.14;
    if (bridges.current) bridges.current.position.z = explode * 2.4;

    const p = plate.current;
    if (p) {
      p.position.z = PLATE_TOP - 0.05 - explode * 1.1;
      const mat = p.material as THREE.MeshStandardMaterial;
      const transparent = explode > 0.01;
      if (mat.transparent !== transparent) {
        mat.transparent = transparent;
        mat.needsUpdate = true;
      }
      mat.opacity = 1 - explode * 0.7;
    }
  });

  return (
    <group>
      <mesh ref={plate} material={materials.plate} rotation-x={Math.PI / 2} position-z={PLATE_TOP - 0.05}>
        <cylinderGeometry args={[2.6, 2.6, 0.1, lite ? 64 : 128]} />
      </mesh>

      {TRAIN.map((arbor, i) => (
        <group key={arbor.id} position={[arbor.pos[0], arbor.pos[1], 0]}>
          <group ref={(el) => void (arbors.current[i] = el)}>
            {arbor.wheel && <Wheel part={arbor.wheel} lite={lite} />}
            {arbor.pinion && <Wheel part={arbor.pinion} lite={lite} />}
            {arbor.id === "barrel" && (
              <>
                <mesh material={materials.brass} rotation-x={Math.PI / 2} position-z={-0.17}>
                  <cylinderGeometry args={[0.7, 0.7, 0.2, lite ? 48 : 96]} />
                </mesh>
                <mesh
                  geometry={gearGeometry({ teeth: 44, module: 0.026, thickness: 0.03, style: "ratchet", spokes: 0 })}
                  material={materials.steel}
                  position-z={-0.05}
                />
              </>
            )}
            <mesh material={materials.steel} rotation-x={Math.PI / 2} position-z={(PLATE_TOP + BRIDGE_Z) / 2}>
              <cylinderGeometry args={[0.022, 0.022, BRIDGE_Z - PLATE_TOP, 10]} />
            </mesh>
          </group>
        </group>
      ))}

      {!lite &&
        KEYLESS.map((k, i) => (
          <group key={i} position={[k.pos[0], k.pos[1], k.z]}>
            <group ref={(el) => void (keyless.current[i] = el)}>
              <mesh geometry={gearGeometry({ teeth: k.teeth, module: 0.03, thickness: 0.035, spokes: k.teeth > 20 ? 3 : 0 })} material={materials.steel} />
            </group>
          </group>
        ))}

      <Balance groupRef={balance} springRef={spring} />
      <Pallet palletRef={pallet} />

      <group ref={bridges}>
        <Bridges />
        <Instanced points={JEWELS} z={BRIDGE_Z + 0.035} kind="jewel" />
        {!lite && <Instanced points={SCREWS} z={BRIDGE_Z + 0.035} kind="screw" />}
      </group>
    </group>
  );
}

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/watch/store";
import { CAMERA_KEYS, createCurves, pathIndex } from "./camera-path";
import { introSeconds } from "./Face";

const BASE_FOV = 35;

export default function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);
  const curves = useMemo(() => createCurves(), []);
  const state = useRef({
    pos: new THREE.Vector3(...CAMERA_KEYS[0].pos),
    look: new THREE.Vector3(...CAMERA_KEYS[0].look),
    targetPos: new THREE.Vector3(),
    targetLook: new THREE.Vector3(),
  });

  useEffect(() => {
    // Keep the watch's horizontal extent on narrow (portrait) screens.
    const fov = aspect < 1 ? (2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2)) / (aspect * 1.05)) * 180) / Math.PI : BASE_FOV;
    camera.fov = Math.min(fov, 72);
    camera.updateProjectionMatrix();
  }, [aspect, camera]);

  useFrame((_, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 1 / 20);
    const index = pathIndex(scene.chapterFloat, scene.anchors, scene.viewport);
    const t = index / (CAMERA_KEYS.length - 1);
    curves.pos.getPoint(t, s.targetPos);
    curves.look.getPoint(t, s.targetLook);

    const intro = Math.min(1, introSeconds() / 2.6);
    const dolly = (1 - intro) ** 3;
    s.targetPos.z += dolly * 6;

    const far = Math.min(1, s.targetPos.length() / 8);
    s.targetPos.x += scene.pointer.x * (0.08 + 0.35 * far);
    s.targetPos.y += scene.pointer.y * (0.06 + 0.22 * far);

    const k = 1 - Math.exp(-5.5 * dt);
    s.pos.lerp(s.targetPos, k);
    s.look.lerp(s.targetLook, k);
    camera.position.copy(s.pos);
    camera.lookAt(s.look);
  });

  return null;
}

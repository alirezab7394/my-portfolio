import * as THREE from "three";
import { drawGeneva, drawPerlage, toTexture } from "./textures";

export interface WatchMaterials {
  brass: THREE.MeshStandardMaterial;
  gold: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  blued: THREE.MeshStandardMaterial;
  plate: THREE.MeshStandardMaterial;
  bridge: THREE.MeshStandardMaterial;
  caseMetal: THREE.MeshStandardMaterial;
  obsidianPolished: THREE.MeshStandardMaterial;
  ruby: THREE.MeshPhysicalMaterial;
  lume: THREE.MeshStandardMaterial;
  turquoise: THREE.MeshPhysicalMaterial;
  crystal: THREE.MeshPhysicalMaterial;
  hairspring: THREE.LineBasicMaterial;
}

let cached: WatchMaterials | null = null;

/** One shared set of materials for the whole movement — no per-mesh material allocations. */
export function getMaterials(): WatchMaterials {
  if (cached) return cached;
  const perlage = toTexture(drawPerlage(), { repeat: 3 });
  const geneva = toTexture(drawGeneva(), { repeat: 1.6 });
  geneva.rotation = Math.PI / 5;

  cached = {
    brass: new THREE.MeshStandardMaterial({ color: "#c8a15a", metalness: 1, roughness: 0.34 }),
    gold: new THREE.MeshStandardMaterial({ color: "#dcb36b", metalness: 1, roughness: 0.2 }),
    steel: new THREE.MeshStandardMaterial({ color: "#d9dde1", metalness: 1, roughness: 0.16 }),
    blued: new THREE.MeshStandardMaterial({ color: "#2c52c4", metalness: 0.9, roughness: 0.22 }),
    plate: new THREE.MeshStandardMaterial({ color: "#15171c", metalness: 0.9, roughness: 0.55, roughnessMap: perlage }),
    bridge: new THREE.MeshStandardMaterial({ color: "#1d2026", metalness: 1, roughness: 0.42, roughnessMap: geneva }),
    caseMetal: new THREE.MeshStandardMaterial({ color: "#d2ad68", metalness: 1, roughness: 0.14 }),
    obsidianPolished: new THREE.MeshStandardMaterial({ color: "#0c0d10", metalness: 1, roughness: 0.12 }),
    ruby: new THREE.MeshPhysicalMaterial({
      color: "#6e0a1d",
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1,
      emissive: "#2a0009",
      emissiveIntensity: 0.5,
    }),
    lume: new THREE.MeshStandardMaterial({
      color: "#06110f",
      emissive: "#22d3c5",
      emissiveIntensity: 2.6,
      toneMapped: false,
    }),
    turquoise: new THREE.MeshPhysicalMaterial({
      color: "#22d3c5",
      roughness: 0.2,
      clearcoat: 1,
      emissive: "#0d6e66",
      emissiveIntensity: 0.6,
    }),
    crystal: new THREE.MeshPhysicalMaterial({
      color: "#e9f3ff",
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0,
      envMapIntensity: 2.6,
      depthWrite: false,
    }),
    hairspring: new THREE.LineBasicMaterial({ color: "#c9ced4", transparent: true, opacity: 0.85 }),
  };
  return cached;
}

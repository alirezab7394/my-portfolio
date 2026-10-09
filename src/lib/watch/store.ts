"use client";

import { useSyncExternalStore } from "react";
import type Lenis from "lenis";
import type { ProjectId } from "@/types/portfolio";

/**
 * Mutable, non-reactive state shared between the scroll engine and the WebGL scene.
 * It is written by Lenis / pointer handlers and read inside `useFrame`, so nothing here
 * triggers React renders.
 */
export const scene = {
  scroll: 0,
  /** Smoothed scroll velocity in px/frame (signed). */
  velocity: 0,
  maxScroll: 1,
  viewport: 1,
  /** Scroll offset at which each chapter starts (same order as CHAPTERS). */
  anchors: [0, 1, 2, 3, 4, 5] as number[],
  /** 0..CHAPTERS.length-1, fractional. Drives the camera path and the dial time. */
  chapterFloat: 0,
  /** Normalised pointer, -1..1 on both axes (y up). */
  pointer: { x: 0, y: 0 },
  /** performance.now() when the loader finished; -1 while loading. */
  introStart: -1,
  /** 0..1 target, eased in the scene. 1 = project card hovered. */
  gearSlow: 0,
  /** Eased 0..1 exploded-view factor, written once per frame by the scene. */
  explode: 0,
  lite: false,
};

export interface UiState {
  /** null until detected on the client. */
  motion: boolean | null;
  webgl: boolean | null;
  sceneReady: boolean;
  phase: "loading" | "intro" | "ready";
  chapter: number;
  soundOn: boolean;
  exploded: boolean;
  caseStudy: ProjectId | null;
}

const initialUi: UiState = {
  motion: null,
  webgl: null,
  sceneReady: false,
  phase: "loading",
  chapter: 0,
  soundOn: false,
  exploded: false,
  caseStudy: null,
};

let ui: UiState = initialUi;
const listeners = new Set<() => void>();

export function getUi(): UiState {
  return ui;
}

export function setUi(patch: Partial<UiState>) {
  let changed = false;
  for (const key in patch) {
    const k = key as keyof UiState;
    if (patch[k] !== ui[k]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  ui = { ...ui, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUi<T>(selector: (state: UiState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(ui),
    () => selector(initialUi),
  );
}

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

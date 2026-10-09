"use client";

import { Component, Suspense, useMemo, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useLocale, useTranslations } from "next-intl";
import * as THREE from "three";
import { scene, setUi } from "@/lib/watch/store";
import Scene, { type SceneCopy } from "./Scene";

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[watch] WebGL scene failed, falling back to 2D", error);
    document.documentElement.classList.add("te-static");
    setUi({ webgl: false, sceneReady: true });
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Lazy-loaded entry for the whole 3D chunk (three, r3f, drei, postprocessing). */
export default function WatchCanvas() {
  const locale = useLocale();
  const t = useTranslations("TimeEngineered.Dial");
  const lite = scene.lite;
  const [dpr, setDpr] = useState(lite ? 1.25 : 1.75);

  const copy = useMemo<SceneCopy>(
    () => ({
      locale,
      dial: { locale, brand: t("brand"), motto: t("motto"), city: t("city"), since: t("since") },
      inner: { lines: t.raw("engraving") as string[], ring: "ALIREZA BAGHERI · TABRIZ · MMXXVI", center: "alireza7394@gmail.com" },
      outer: { lines: t.raw("caseback") as string[], ring: "TIME, ENGINEERED · CALIBRE AB-08 · 31 JEWELS", center: "N° 0001" },
    }),
    [locale, t],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          dpr={[1, dpr]}
          camera={{ fov: 35, near: 0.03, far: 80, position: [0, 0, 16] }}
          gl={{ antialias: lite, powerPreference: "high-performance", alpha: false, stencil: false }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
            onIncline={() => setDpr((d) => Math.min(lite ? 1.5 : 2, d + 0.25))}
          />
          <Suspense fallback={null}>
            <Scene lite={lite} copy={copy} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}

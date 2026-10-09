"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode, type ChromaticAberrationEffect } from "postprocessing";
import { scene } from "@/lib/watch/store";

/** Desktop-only post stack. Chromatic aberration widens with scroll velocity. */
export default function Effects() {
  const aberration = useRef<ChromaticAberrationEffect>(null);

  useFrame(() => {
    const effect = aberration.current;
    if (!effect) return;
    const v = Math.min(Math.abs(scene.velocity), 60) / 60;
    const amount = 0.00035 + v * 0.0035;
    effect.offset.set(amount, amount * 0.6);
  });

  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={0.92} luminanceSmoothing={0.18} intensity={0.85} radius={0.72} />
      <ChromaticAberration ref={aberration} radialModulation modulationOffset={0.3} />
      <Vignette offset={0.22} darkness={0.82} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { formatNumber } from "@/lib/watch/navigation";
import { getUi, scene, setUi, useUi } from "@/lib/watch/store";

const LOADED_KEY = "te:loaded";
export const FLIP_KEY = "te:flip";
const MAX_WAIT = 9000;

/**
 * Branded loader: a hand sweeps the dial 0 → 100%. Progress eases toward a soft ceiling
 * while the 3D chunk downloads and compiles, then completes once the scene has rendered.
 * The exit is an iris that opens onto the watch (or a dial flip after a language switch).
 */
export default function Loader() {
  const t = useTranslations("TimeEngineered.Loader");
  const locale = useLocale();
  const phase = useUi((s) => s.phase);
  const [variant, setVariant] = useState<"wind" | "flip">("wind");
  const hand = useRef<SVGGElement>(null);
  const arc = useRef<SVGCircleElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let quick = false;
    try {
      quick = sessionStorage.getItem(LOADED_KEY) === "1";
      if (sessionStorage.getItem(FLIP_KEY)) {
        sessionStorage.removeItem(FLIP_KEY);
        setVariant("flip");
      }
    } catch {
      /* storage unavailable */
    }

    let fontsReady = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => (fontsReady = true));
    const start = performance.now();
    let progress = 0;
    let raf = 0;
    let done = false;

    const render = (p: number) => {
      if (hand.current) hand.current.style.transform = `rotate(${p * 360}deg)`;
      if (arc.current) arc.current.style.strokeDashoffset = String(100 - p * 100);
      if (label.current) label.current.textContent = `${formatNumber(Math.round(p * 100), locale)}%`;
    };

    const finish = () => {
      done = true;
      scene.introStart = performance.now();
      setUi({ phase: "intro" });
      try {
        sessionStorage.setItem(LOADED_KEY, "1");
      } catch {
        /* storage unavailable */
      }
      window.setTimeout(() => setUi({ phase: "ready" }), 3600);
    };

    const loop = (now: number) => {
      if (done) return;
      const ui = getUi();
      const elapsed = now - start;
      if (ui.motion === null && elapsed < MAX_WAIT) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const needsScene = ui.motion === true && ui.webgl === true;
      const ready = (fontsReady && (!needsScene || ui.sceneReady)) || elapsed > MAX_WAIT;
      const ceiling = Math.min(0.92, 0.3 + (elapsed / 5000) * 0.62);
      const target = ready ? 1 : ceiling;
      const rate = (ready ? 0.12 : 0.04) * (quick ? 2.5 : 1);
      progress += (target - progress) * rate;
      if (ready && progress > 0.995) {
        render(1);
        finish();
        return;
      }
      render(progress);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      done = true;
      cancelAnimationFrame(raf);
    };
  }, [locale]);

  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <m.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label={t("label")}
          className="te-loader fixed inset-0 z-[100] flex items-center justify-center bg-obsidian text-ivory"
          initial={false}
          exit={
            variant === "flip"
              ? { rotateY: -90, opacity: 0, transition: { duration: 0.7, ease: [0.7, 0, 0.3, 1] } }
              : { clipPath: "circle(0% at 50% 50%)", transition: { duration: 1.25, ease: [0.76, 0, 0.24, 1] } }
          }
          style={{ clipPath: "circle(150% at 50% 50%)", transformPerspective: 1400 }}
        >
          <div className="flex flex-col items-center gap-8">
            <svg viewBox="-110 -110 220 220" className="h-44 w-44" aria-hidden="true">
              <circle r="104" fill="none" stroke="rgb(200 161 90 / 0.25)" strokeWidth="1" />
              {ticks.map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i % 5 === 0 ? -92 : -96}
                  x2="0"
                  y2="-100"
                  stroke={i % 5 === 0 ? "#C8A15A" : "rgb(244 239 230 / 0.35)"}
                  strokeWidth={i % 5 === 0 ? 2 : 1}
                  transform={`rotate(${i * 6})`}
                />
              ))}
              <circle
                ref={arc}
                r="84"
                fill="none"
                stroke="#22D3C5"
                strokeWidth="1.5"
                pathLength={100}
                strokeDasharray="100"
                strokeDashoffset="100"
                transform="rotate(-90)"
              />
              <g ref={hand} style={{ transformOrigin: "0 0" }}>
                <line x1="0" y1="14" x2="0" y2="-80" stroke="#F4EFE6" strokeWidth="2" strokeLinecap="round" />
                <circle cy="-80" r="3" fill="#22D3C5" />
              </g>
              <circle r="5" fill="#C8A15A" />
            </svg>
            <div className="flex flex-col items-center gap-2">
              <span ref={label} className="font-mono text-sm tabular-nums tracking-[0.2em] text-ivory">
                {formatNumber(0, locale)}%
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-brass">
                {variant === "flip" ? t("flip") : t("label")}
              </span>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

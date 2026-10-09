"use client";

import { useEffect, useRef, useState } from "react";
import { scene, useUi } from "@/lib/watch/store";

type CursorKind = "default" | "crown" | "hand" | "hidden";

/**
 * Custom cursor: a dot plus a spring-lagged ring. Over links and buttons it becomes a
 * tiny crown; over project cards and skills it becomes a watch hand. It also feeds the
 * normalised pointer used by the scene for parallax and the moving light.
 */
export default function Cursor() {
  const motion = useUi((s) => s.motion);
  const [enabled, setEnabled] = useState(false);
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<CursorKind>("default");

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!motion) return;
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(fine.matches);
    update();
    fine.addEventListener("change", update);
    return () => fine.removeEventListener("change", update);
  }, [motion]);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("te-has-cursor");
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lag = { ...pos };
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        lag.x = pos.x;
        lag.y = pos.y;
        ring.current?.style.setProperty("opacity", "1");
        dot.current?.style.setProperty("opacity", "1");
      }
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const tagged = target?.closest<HTMLElement>("[data-cursor]");
      if (tagged) return setKind((tagged.dataset.cursor as CursorKind) ?? "default");
      if (target?.closest("a, button, [role='button'], label, summary")) return setKind("crown");
      if (target?.closest("input, textarea, [contenteditable='true']")) return setKind("hidden");
      setKind("default");
    };
    const onLeave = () => {
      visible = false;
      ring.current?.style.setProperty("opacity", "0");
      dot.current?.style.setProperty("opacity", "0");
    };
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.2;
      lag.y += (pos.y - lag.y) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("te-has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = kind === "crown" || kind === "hand" ? 56 : kind === "hidden" ? 0 : 34;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] mix-blend-difference">
      <div ref={ring} className="absolute left-0 top-0 opacity-0 transition-opacity duration-300">
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/80 transition-[width,height,background-color] duration-300 ease-watch"
          style={{ width: ringSize, height: ringSize, backgroundColor: kind === "default" ? "transparent" : "rgb(244 239 230 / 0.06)" }}
        >
          {kind === "crown" && (
            <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-ivory">
              <rect x="7" y="4" width="10" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              {[9, 11, 13, 15].map((x) => (
                <line key={x} x1={x} y1="5.5" x2={x} y2="15.5" stroke="currentColor" strokeWidth="0.9" />
              ))}
              <rect x="10.5" y="17" width="3" height="3.5" fill="currentColor" />
            </svg>
          )}
          {kind === "hand" && (
            <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 text-ivory">
              <path d="M12 2 L14 13 L12 16 L10 13 Z" fill="currentColor" />
              <circle cx="12" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          )}
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 opacity-0">
        <div
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory transition-opacity"
          style={{ opacity: kind === "default" ? 1 : 0 }}
        />
      </div>
    </div>
  );
}

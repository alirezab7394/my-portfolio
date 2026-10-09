"use client";

import { useEffect, useRef } from "react";
import { useUi } from "@/lib/watch/store";

/** Pulls its child toward the pointer when nearby, then springs back. */
export default function Magnetic({
  children,
  strength = 0.35,
  radius = 90,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motion = useUi((s) => s.motion);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = Math.max(rect.width, rect.height) / 2 + radius;
      if (Math.hypot(dx, dy) < reach) {
        el.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      } else if (el.style.transform) {
        el.style.transition = "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
        el.style.transform = "";
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motion, radius, strength]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className ?? ""}`}>
      {children}
    </span>
  );
}

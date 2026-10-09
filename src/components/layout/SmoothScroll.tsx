"use client";

import { useEffect } from "react";
import { CHAPTERS } from "@/lib/watch/chapters";
import { loadGsap, loadLenis } from "@/lib/watch/lazy";
import { scene, setLenis, setUi, useUi } from "@/lib/watch/store";

type LenisCtor = Awaited<ReturnType<typeof loadLenis>>;
type GsapLib = Awaited<ReturnType<typeof loadGsap>>;

function measureAnchors() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scene.maxScroll = max;
  scene.viewport = window.innerHeight;
  let previous = 0;
  scene.anchors = CHAPTERS.map(({ id }) => {
    const el = document.querySelector<HTMLElement>(`[data-chapter="${id}"]`);
    const top = el ? el.getBoundingClientRect().top + window.scrollY : previous;
    previous = Math.max(previous, Math.min(top, max));
    return previous;
  });
}

function updateChapter(y: number) {
  scene.scroll = y;
  const a = scene.anchors;
  const last = a.length - 1;
  let i = 0;
  while (i < last && y >= a[i + 1]) i++;
  const span = i < last ? a[i + 1] - a[i] : 1;
  scene.chapterFloat = i >= last ? last : i + Math.min(1, Math.max(0, (y - a[i]) / Math.max(1, span)));

  let active = 0;
  const probe = y + scene.viewport * 0.5;
  for (let k = 0; k <= last; k++) if (probe >= a[k]) active = k;
  if (y >= scene.maxScroll - 2) active = last;
  setUi({ chapter: active });

  const ring = document.getElementById("te-progress");
  if (ring) ring.style.setProperty("--te-p", (y / scene.maxScroll).toFixed(4));
}

/**
 * Lenis drives native scroll (so ScrollTrigger and position: sticky just work) and
 * GSAP's ticker drives Lenis. Scroll position, velocity and chapter progress are written
 * into the shared `scene` object for the WebGL frame loop.
 */
export default function SmoothScroll() {
  const motion = useUi((s) => s.motion);

  useEffect(() => {
    if (motion === null) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let kinetic: HTMLElement[] = [];
    const collectKinetic = () => {
      kinetic = Array.from(document.querySelectorAll<HTMLElement>(".te-kinetic"));
    };
    const onRefresh = () => {
      measureAnchors();
      collectKinetic();
      updateChapter(window.scrollY);
    };

    if (!motion) {
      const onScroll = () => updateChapter(window.scrollY);
      const onResize = () => onRefresh();
      onRefresh();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }

    window.scrollTo(0, 0);
    onRefresh();
    let teardown: (() => void) | undefined;
    let cancelled = false;
    void Promise.all([loadLenis(), loadGsap()]).then(([Lenis, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      teardown = startSmoothScroll(Lenis, gsap, ScrollTrigger, onRefresh, () => kinetic);
    });
    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [motion]);

  return null;
}

function startSmoothScroll(
  Lenis: LenisCtor,
  gsap: GsapLib["gsap"],
  ScrollTrigger: GsapLib["ScrollTrigger"],
  onRefresh: () => void,
  getKinetic: () => HTMLElement[],
) {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
  setLenis(lenis);

  let skew = 0;
  const onScroll = () => {
    updateChapter(lenis.scroll);
    ScrollTrigger.update();
  };
  lenis.on("scroll", onScroll);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
    scene.velocity += (lenis.velocity - scene.velocity) * 0.18;
    const target = Math.max(-5, Math.min(5, scene.velocity * 0.12));
    const eased = skew + (target - skew) * 0.14;
    const next = Math.abs(eased) < 0.004 ? 0 : eased;
    if (Math.abs(next - skew) > 0.003 || (next === 0 && skew !== 0)) {
      skew = next;
      const blur = Math.min(Math.abs(skew) * 0.45, 2.2);
      for (const el of getKinetic()) {
        el.style.setProperty("--te-skew", `${skew.toFixed(3)}deg`);
        el.style.setProperty("--te-blur", `${blur.toFixed(2)}px`);
      }
    }
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.addEventListener("refresh", onRefresh);
  onRefresh();
  const refresh = () => ScrollTrigger.refresh();
  const raf = requestAnimationFrame(refresh);
  document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("load", refresh);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    gsap.ticker.remove(tick);
    lenis.destroy();
    setLenis(null);
  };
}

"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { notify } from "@/lib/watch/lazy";
import { restoreSoundPreference } from "@/lib/watch/sound";
import { getUi, scene, setUi, useUi } from "@/lib/watch/store";
import CaseStudy from "@/components/project/CaseStudy";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Cursor from "./Cursor";
import Hud from "./Hud";
import Loader from "./Loader";
import MotionProvider from "./MotionProvider";
import { GirihBackdrop, Grain } from "./Ornaments";
import SmoothScroll from "./SmoothScroll";

const WatchCanvas = dynamic(() => import("@/components/three/watch/WatchCanvas"), { ssr: false });
const Toaster = dynamic(() => import("sonner").then((m) => m.Toaster), { ssr: false });

function detectEnvironment() {
  const params = new URLSearchParams(window.location.search);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const forceStatic = params.has("static");
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowPower = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  const handheld = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  scene.lite = params.has("lite") || handheld || lowPower;
  const motion = !reduced && !forceStatic;
  const use3d = motion && webgl && !forceStatic;
  document.documentElement.classList.toggle("te-static", !use3d);
  setUi({ motion, webgl: webgl && !forceStatic });
}

function useExplodedShortcut() {
  const t = useTranslations("TimeEngineered.Hud");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "t" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const ui = getUi();
      if (!ui.webgl || !ui.motion) return;
      setUi({ exploded: !ui.exploded });
      notify(!ui.exploded ? t("explodedOn") : t("explodedOff"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t]);
}

export default function TimeEngineered() {
  const t = useTranslations("TimeEngineered.Hud");
  const locale = useLocale();
  const use3d = useUi((s) => s.motion === true && s.webgl === true);

  useEffect(() => {
    detectEnvironment();
    restoreSoundPreference();
  }, []);
  useExplodedShortcut();

  return (
    <MotionProvider>
      <div className="te-root relative min-h-screen bg-obsidian text-ivory">
        <a
          href="#main"
          className="sr-only z-[300] rounded-full bg-ivory px-5 py-3 text-obsidian focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t("skip")}
        </a>
        {use3d && <WatchCanvas />}
        <GirihBackdrop />
        <SmoothScroll />
        <Hud />
        <main id="main" className="relative">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <CaseStudy />
        <Grain />
        <Cursor />
        <Loader />
        <Toaster
          position="bottom-center"
          dir={locale === "fa" ? "rtl" : "ltr"}
          toastOptions={{
            classNames: {
              toast: "!rounded-full !border !border-brass/40 !bg-obsidian-2 !text-ivory !font-mono !text-xs !tracking-[0.15em] !shadow-2xl",
            },
          }}
        />
      </div>
    </MotionProvider>
  );
}

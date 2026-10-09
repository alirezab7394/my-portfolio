"use client";

import { m } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useNow } from "@/hooks/use-now";
import { scrollToSection } from "@/lib/watch/navigation";
import { useUi } from "@/lib/watch/store";
import Magnetic from "@/components/layout/Magnetic";
import StaticWatch from "@/components/layout/StaticWatch";
import { toPersianDigits } from "@/components/layout/Hud";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const t = useTranslations("TimeEngineered.Hero");
  const locale = useLocale();
  const phase = useUi((s) => s.phase);
  const is3d = useUi((s) => s.motion === true && s.webgl === true);
  const started = phase !== "loading";
  // In 3D the name lands as the dial dims (≈2.5s into the intro); the 2D version reveals at once.
  const delay = is3d ? 2.5 : 0.25;
  const now = useNow();
  const clock = now
    ? now.toLocaleTimeString(locale === "fa" ? "fa-IR" : "en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";

  const rise = (i: number) => ({
    initial: { y: "110%" },
    animate: started ? { y: "0%" } : undefined,
    transition: { duration: 1.5, delay: delay + i * 0.12, ease: EASE },
  });
  const fade = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: started ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay: delay + 0.5 + i * 0.1, ease: EASE },
  });

  return (
    <section
      id="hero"
      data-chapter="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-24 pt-28 md:px-10 md:pb-24"
    >
      <div className="te-static-only pointer-events-none absolute inset-0">
        <div className="flex h-full items-center justify-center">
          <StaticWatch className="h-[min(74vh,92vw)] w-auto opacity-80" />
        </div>
      </div>

      <h1
        id="hero-title"
        tabIndex={-1}
        data-focus-target
        className="te-kinetic relative font-display text-[clamp(4.4rem,15.5vw,17.5rem)] leading-[0.84] tracking-[-0.035em] text-ivory mix-blend-difference outline-none rtl:leading-[1.2] rtl:tracking-normal"
      >
        <span className="sr-only">{t("srTitle")}</span>
        <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
          <m.span data-reveal className="block" {...rise(0)}>
            {t("firstName")}
          </m.span>
        </span>
        <span aria-hidden="true" className="block overflow-hidden pb-[0.1em]">
          <m.span data-reveal className="block ps-[0.9em] italic" {...rise(1)}>
            {t("lastName")}
          </m.span>
        </span>
      </h1>

      <div className="relative mt-8 grid items-end gap-8 md:grid-cols-[1fr_auto_1fr]">
        <m.div data-reveal className="max-w-sm" {...fade(0)}>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">{t("eyebrow")}</p>
          <p className="mt-3 text-base leading-relaxed text-ivory/80 md:text-lg">{t("intro")}</p>
        </m.div>

        <m.div data-reveal className="justify-self-start md:justify-self-center" {...fade(1)}>
          <Magnetic>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="group flex items-center gap-4 rounded-full border border-ivory/20 bg-obsidian/40 py-2 ps-2 pe-6 backdrop-blur-md transition-colors hover:border-turq"
            >
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-obsidian">
                <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-700 ease-watch group-hover:rotate-[360deg]" aria-hidden="true">
                  <rect x="6" y="5" width="12" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  {[8.5, 11, 13.5, 16].map((x) => (
                    <line key={x} x1={x - 0.5} y1="6.5" x2={x - 0.5} y2="14.5" stroke="currentColor" strokeWidth="1" />
                  ))}
                  <rect x="10.5" y="16" width="3" height="4" fill="currentColor" />
                </svg>
              </span>
              <span className="flex flex-col text-start">
                <span className="text-sm font-medium text-ivory">{t("cta")}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/60">{t("ctaHint")}</span>
              </span>
            </button>
          </Magnetic>
        </m.div>

        <m.dl data-reveal className="grid gap-1 font-mono text-[11px] uppercase tracking-[0.25em] md:justify-self-end md:text-end" {...fade(2)}>
          <dt className="text-ivory/60">{t("localTime")}</dt>
          <dd className="text-lg tabular-nums tracking-[0.12em] text-ivory">{locale === "fa" ? toPersianDigits(clock) : clock}</dd>
          <dt className="mt-2 text-ivory/60">{t("basedIn")}</dt>
          <dd className="text-ivory">{t("location")}</dd>
        </m.dl>
      </div>
    </section>
  );
}

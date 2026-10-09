"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useTranslations } from "next-intl";
import { PROJECTS } from "@/lib/portfolio-data";
import { getLenis, setUi, useUi } from "@/lib/watch/store";
import type { Project, ProjectCopy } from "@/types/portfolio";
import ProjectMedia from "./ProjectMedia";

const EASE = [0.16, 1, 0.3, 1] as const;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), video[controls]';

function Dialog({ project }: { project: Project }) {
  const t = useTranslations("TimeEngineered.CaseStudy");
  const tp = useTranslations("TimeEngineered.Projects");
  const copy = tp.raw(`items.${project.id}`) as ProjectCopy;
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = () => setUi({ caseStudy: null });

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setUi({ caseStudy: null });
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      lenis?.start();
      opener?.focus({ preventScroll: true });
    };
  }, []);

  const reveal = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.25 + i * 0.06, ease: EASE } },
    exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
  });

  return (
    <m.div
      className="fixed inset-0 z-[150]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-obsidian/85 backdrop-blur-xl" onClick={close} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        data-lenis-prevent
        className="relative h-full overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-20 md:px-10 md:pt-24">
          <button
            ref={closeButton}
            type="button"
            onClick={close}
            className="fixed top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 bg-obsidian/70 text-ivory backdrop-blur-md transition-colors hover:border-turq hover:text-turq ltr:right-5 rtl:left-5 md:top-7 ltr:md:right-8 rtl:md:left-8"
          >
            <span className="sr-only">{t("close")}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <m.div
            layoutId={`case-media-${project.id}`}
            className="relative aspect-[16/9] overflow-hidden border border-ivory/10"
            style={{ borderRadius: 28 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <ProjectMedia project={project} title={copy.title} category={copy.category} sizes="(min-width: 1152px) 1152px, 100vw" playVideo priority />
          </m.div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div>
              <m.p {...reveal(0)} className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: project.accent }}>
                {copy.category}
              </m.p>
              <m.h2 {...reveal(1)} id="case-study-title" className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] text-ivory">
                {copy.title}
              </m.h2>
              <m.p {...reveal(2)} className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80">
                {copy.description}
              </m.p>

              <m.h3 {...reveal(3)} className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
                {t("features")}
              </m.h3>
              <m.ul {...reveal(4)} className="mt-5 grid gap-3">
                {copy.features.map((feature, i) => (
                  <li key={feature} className="flex items-start gap-4 border-b border-ivory/10 pb-3 text-ivory/80">
                    <span dir="ltr" className="font-mono text-[11px] tabular-nums text-ivory/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {feature}
                  </li>
                ))}
              </m.ul>
            </div>

            <m.aside {...reveal(3)} className="grid content-start gap-8 rounded-3xl border border-ivory/10 bg-obsidian-2/70 p-6 md:p-8">
              <dl className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50">{t("role")}</dt>
                  <dd className="mt-2 text-ivory">{copy.role}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50">{t("year")}</dt>
                  <dd className="mt-2 text-ivory">{copy.year}</dd>
                </div>
              </dl>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50">{t("metrics")}</h3>
                <dl className="mt-4 grid grid-cols-3 gap-3">
                  {copy.metrics.map((metric) => (
                    <div key={metric.label} className="flex flex-col-reverse gap-2">
                      <dt className="text-xs leading-snug text-ivory/60">{metric.label}</dt>
                      <dd className="font-display text-4xl leading-none" style={{ color: project.accent }}>
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50">{t("stack")}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li key={s} dir="ltr" className="rounded-full border border-ivory/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ivory/75">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hand"
                className="inline-flex items-center justify-between gap-4 rounded-full bg-ivory px-6 py-3.5 text-sm font-medium text-obsidian transition-colors hover:bg-brass"
              >
                {t("visit")}
                <span dir="ltr" className="font-mono text-[11px] text-obsidian/60">
                  {project.domain} ↗
                </span>
              </a>
            </m.aside>
          </div>
        </div>
      </div>
    </m.div>
  );
}

export default function CaseStudy() {
  const id = useUi((s) => s.caseStudy);
  const project = id ? PROJECTS.find((p) => p.id === id) : undefined;
  return <AnimatePresence>{project && <Dialog key={project.id} project={project} />}</AnimatePresence>;
}

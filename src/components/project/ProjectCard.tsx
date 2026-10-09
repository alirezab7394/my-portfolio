"use client";

import { useRef } from "react";
import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { scene, setUi } from "@/lib/watch/store";
import type { Project, ProjectCopy } from "@/types/portfolio";
import ProjectMedia from "./ProjectMedia";

const MAX_TILT = 9;

export default function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const t = useTranslations("TimeEngineered.Projects");
  const copy = t.raw(`items.${project.id}`) as ProjectCopy;
  const card = useRef<HTMLElement>(null);

  const tilt = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${(-y * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const engage = () => {
    scene.gearSlow = 1;
  };
  const release = () => {
    scene.gearSlow = 0;
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  const open = () => {
    scene.gearSlow = 0;
    setUi({ caseStudy: project.id });
  };
  const number = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <article
      ref={card}
      data-project-card
      aria-labelledby={`project-${project.id}`}
      onPointerMove={tilt}
      onPointerEnter={engage}
      onPointerLeave={release}
      onFocus={engage}
      onBlur={release}
      className="group/card relative w-[min(82vw,30rem)] shrink-0 [perspective:1200px]"
    >
      <div
        className="relative rounded-[1.75rem] border border-ivory/10 bg-obsidian-2/80 p-3 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] backdrop-blur-xl transition-[transform,border-color] duration-500 ease-watch [transform-style:preserve-3d] group-hover/card:border-brass/40 group-focus-within/card:border-brass/40"
        style={{ transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}
      >
        <m.div
          layoutId={`case-media-${project.id}`}
          className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem]"
          style={{ borderRadius: 20 }}
        >
          <ProjectMedia project={project} title={copy.title} category={copy.category} sizes="(min-width: 768px) 30rem, 82vw" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover/card:opacity-100"
            style={{ background: "radial-gradient(40% 50% at var(--gx, 50%) var(--gy, 50%), rgb(255 255 255 / 0.55), transparent 70%)" }}
          />
        </m.div>

        <div className="px-3 pb-2 pt-5 [transform:translateZ(30px)]">
          <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/55">
            <span dir="ltr">{number}</span>
            <span>
              {copy.category} · {copy.year}
            </span>
          </div>
          <h3 id={`project-${project.id}`} className="mt-3 font-display text-4xl leading-none text-ivory">
            {copy.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ivory/70">{copy.description}</p>

          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-watch group-hover/card:grid-rows-[1fr] group-focus-within/card:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <dl className="mt-5 grid grid-cols-3 gap-2" aria-label={t("metrics")}>
                {copy.metrics.map((metric) => (
                  <div key={metric.label} className="flex flex-col-reverse gap-1.5 rounded-xl border border-ivory/10 bg-obsidian/60 p-3">
                    <dt className="text-[11px] leading-snug text-ivory/60">{metric.label}</dt>
                    <dd className="font-display text-2xl leading-none" style={{ color: project.accent }}>
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t("stack")}>
                {project.stack.slice(0, 7).map((s) => (
                  <li key={s} dir="ltr" className="rounded-full border border-ivory/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ivory/65">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={open}
              data-cursor="crown"
              aria-label={t("open", { title: copy.title })}
              className="rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-obsidian transition-colors hover:bg-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turq"
            >
              {t("openShort")}
            </button>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hand"
              className="rounded-full border border-ivory/20 px-5 py-2.5 text-sm text-ivory/85 transition-colors hover:border-turq hover:text-turq"
            >
              {t("visit")}
              <span className="sr-only"> — {copy.title}</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PROJECTS, SKILLS } from "@/lib/portfolio-data";
import { setUi, useUi } from "@/lib/watch/store";
import type { ProjectCopy, SkillId } from "@/types/portfolio";

/** Orbit radii as a fraction of the stage half-width, and angular speed in rad/s. */
const RINGS = [
  { radius: 0.56, speed: 0.12, tilt: 0.42 },
  { radius: 0.84, speed: -0.075, tilt: 0.36 },
] as const;

export default function Skills() {
  const t = useTranslations("TimeEngineered.Skills");
  const tp = useTranslations("TimeEngineered.Projects");
  const motion = useUi((s) => s.motion);
  const [active, setActive] = useState<SkillId | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const activeRef = useRef<SkillId | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const el = stage.current;
    if (!el || !motion) return;
    const perRing = [0, 1].map((r) => SKILLS.filter((s) => s.ring === r).length);
    const slot = SKILLS.map((s) => SKILLS.filter((o, j) => o.ring === s.ring && j < SKILLS.indexOf(s)).length);
    let raf = 0;
    let visible = false;
    let last = performance.now();
    let time = 0;
    let speed = 1;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed += ((paused.current ? 0.08 : 1) - speed) * Math.min(1, dt * 4);
      time += dt * speed;
      const half = el.clientWidth / 2;
      SKILLS.forEach((skill, i) => {
        const node = items.current[i];
        if (!node) return;
        const ring = RINGS[skill.ring];
        const angle = (slot[i] / perRing[skill.ring]) * Math.PI * 2 + time * ring.speed * Math.PI * 2 + skill.ring * 0.4;
        const depth = Math.sin(angle);
        const x = Math.cos(angle) * ring.radius * half;
        const y = depth * ring.radius * half * ring.tilt;
        const focused = activeRef.current === skill.id;
        const scale = focused ? 1.22 : 0.78 + (depth + 1) * 0.16;
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        node.style.opacity = focused ? "1" : (0.42 + (depth + 1) * 0.29).toFixed(3);
        node.style.zIndex = focused ? "50" : String(Math.round((depth + 1) * 10));
      });
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      items.current.forEach((node) => node?.removeAttribute("style"));
    };
  }, [motion]);

  const current = SKILLS.find((s) => s.id === active);
  const orbit = motion !== false;

  return (
    <section
      id="skills"
      data-chapter="skills"
      aria-labelledby="skills-title"
      className="relative flex min-h-[140vh] items-center overflow-x-clip px-5 py-28 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">{t("eyebrow")}</p>
          <h2
            id="skills-title"
            tabIndex={-1}
            data-focus-target
            className="te-kinetic mt-5 font-display text-[clamp(2.6rem,5vw,5.2rem)] leading-[0.95] tracking-[-0.02em] text-ivory outline-none rtl:leading-[1.3] rtl:tracking-normal"
          >
            {t("title")}
          </h2>

          <div aria-live="polite" className="mt-10 min-h-[13rem] rounded-3xl border border-ivory/10 bg-obsidian/70 p-6 backdrop-blur-xl">
            {current ? (
              <>
                <p dir="ltr" className="font-display text-4xl text-ivory rtl:text-end">
                  {current.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/75">{t(`items.${current.id}`)}</p>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50">{t("builtWith")}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {current.projects.length === 0 && (
                    <li className="rounded-full border border-turq/40 px-3 py-1.5 text-xs text-turq">{t("thisSite")}</li>
                  )}
                  {current.projects.map((id) => {
                    const project = PROJECTS.find((p) => p.id === id);
                    const copy = tp.raw(`items.${id}`) as ProjectCopy;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => setUi({ caseStudy: id })}
                          className="flex items-center gap-2 rounded-full border border-ivory/20 px-3 py-1.5 text-xs text-ivory/85 transition-colors hover:border-brass hover:text-brass"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: project?.accent }} />
                          {copy.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-ivory/60">{t("hint")}</p>
            )}
          </div>
        </div>

        <div
          ref={stage}
          className={orbit ? "relative mx-auto aspect-square w-full max-w-[44rem]" : "relative"}
          onFocus={() => (paused.current = true)}
          onBlur={() => (paused.current = false)}
        >
          {orbit && (
            <svg aria-hidden="true" viewBox="-100 -100 200 200" className="pointer-events-none absolute inset-0 h-full w-full">
              {RINGS.map((ring) => (
                <ellipse
                  key={ring.radius}
                  rx={ring.radius * 100}
                  ry={ring.radius * 100 * ring.tilt}
                  fill="none"
                  stroke="#C8A15A"
                  strokeOpacity="0.28"
                  strokeWidth="0.3"
                  strokeDasharray="0.6 2.2"
                />
              ))}
            </svg>
          )}
          <ul className={orbit ? "absolute inset-0" : "flex flex-wrap gap-3"}>
            {SKILLS.map((skill, i) => (
              <li
                key={skill.id}
                ref={(node) => void (items.current[i] = node)}
                className={orbit ? "absolute left-1/2 top-1/2 will-change-transform" : ""}
              >
                <button
                  type="button"
                  dir="ltr"
                  onPointerEnter={() => {
                    paused.current = true;
                    setActive(skill.id);
                  }}
                  onPointerLeave={() => (paused.current = false)}
                  onFocus={() => setActive(skill.id)}
                  onClick={() => setActive(skill.id)}
                  aria-pressed={active === skill.id}
                  data-cursor="hand"
                  className="whitespace-nowrap rounded-full border border-ivory/15 bg-obsidian-2/80 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory shadow-[0_10px_30px_-10px_rgb(0_0_0/0.8)] backdrop-blur-md transition-colors aria-pressed:border-turq aria-pressed:text-turq"
                >
                  {skill.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

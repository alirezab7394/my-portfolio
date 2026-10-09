"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CAREER_END, CAREER_START, EXPERIENCE } from "@/lib/portfolio-data";
import { withGsap } from "@/lib/watch/lazy";
import { playTick } from "@/lib/watch/sound";
import { useUi } from "@/lib/watch/store";
import { toPersianDigits } from "@/components/layout/Hud";
import type { ExperienceEntry } from "@/types/portfolio";

const SPAN = CAREER_END - CAREER_START;
/** Sub-dial hand angle for a year, using 300° of the dial like a 30-minute counter. */
const yearAngle = (year: number) => -150 + ((year - CAREER_START) / SPAN) * 300;

function SubDial({ entry, current }: { entry: ExperienceEntry; current: boolean }) {
  const end = entry.end ?? CAREER_END;
  const a0 = yearAngle(entry.start);
  const a1 = yearAngle(end + (entry.end === entry.start ? 0.35 : 0));
  const arc = (from: number, to: number, r: number) => {
    const p = (deg: number) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return `${(Math.cos(rad) * r).toFixed(2)} ${(Math.sin(rad) * r).toFixed(2)}`;
    };
    return `M${p(from)}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${p(to)}`;
  };

  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full" aria-hidden="true">
      <circle r="57" fill="#0d0f13" stroke="#C8A15A" strokeOpacity="0.5" />
      <circle r="50" fill="none" stroke="#F4EFE6" strokeOpacity="0.06" strokeWidth="6" />
      {Array.from({ length: SPAN + 1 }, (_, i) => {
        const rad = ((yearAngle(CAREER_START + i) - 90) * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={Math.cos(rad) * 46}
            y1={Math.sin(rad) * 46}
            x2={Math.cos(rad) * 40}
            y2={Math.sin(rad) * 40}
            stroke="#F4EFE6"
            strokeOpacity="0.45"
          />
        );
      })}
      <path d={arc(a0, a1, 50)} fill="none" stroke={current ? "#22D3C5" : "#C8A15A"} strokeWidth="6" strokeLinecap="round" />
      <g data-hand data-angle={a1} transform={`rotate(${a1})`}>
        <path d="M-1.6 6 L-0.8 -38 L0 -42 L0.8 -38 L1.6 6 Z" fill="#F4EFE6" />
        <circle r="4" fill="#C8A15A" />
        <circle r="1.4" fill="#07080A" />
      </g>
    </svg>
  );
}

export default function Experience() {
  const t = useTranslations("TimeEngineered.Experience");
  const locale = useLocale();
  const motion = useUi((s) => s.motion);
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const digits = (value: string | number) => (locale === "fa" ? toPersianDigits(String(value)) : String(value));

  useEffect(() => {
    const ol = list.current;
    const bar = fill.current;
    if (!ol || !bar || !motion) return;
    return withGsap(({ gsap, ScrollTrigger }) => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          bar,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: ol, start: "top 60%", end: "bottom 60%", scrub: true } },
        );
        ol.querySelectorAll<HTMLElement>("[data-entry]").forEach((item) => {
          const dial = item.querySelector<HTMLElement>("[data-dial]");
          const hand = item.querySelector<SVGGElement>("[data-hand]");
          const body = item.querySelectorAll<HTMLElement>("[data-entry-body] > *");
          const handTo = Number(hand?.dataset.angle ?? 0);
          const tl = gsap.timeline({ paused: true });
          tl.fromTo(dial, { scale: 0.55, rotate: -90, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.9, ease: "back.out(2.2)" })
            .fromTo(hand, { rotation: -150, svgOrigin: "0 0" }, { rotation: handTo, svgOrigin: "0 0", duration: 1.1, ease: "elastic.out(1, 0.55)" }, 0.15)
            .fromTo(body, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: "power3.out" }, 0.1);
          ScrollTrigger.create({
            trigger: item,
            start: "top 72%",
            once: true,
            onEnter: () => {
              tl.play();
              gsap.delayedCall(0.32, () => playTick(1));
            },
          });
        });
      }, ol);
      return () => ctx.revert();
    });
  }, [motion]);

  return (
    <section
      id="experience"
      data-chapter="experience"
      aria-labelledby="experience-title"
      className="relative px-5 pb-[40vh] pt-[30vh] md:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <header className="lg:sticky lg:top-[28vh] lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">{t("eyebrow")}</p>
          <h2
            id="experience-title"
            tabIndex={-1}
            data-focus-target
            className="te-kinetic mt-5 font-display text-[clamp(2.6rem,5.4vw,5.6rem)] leading-[0.95] tracking-[-0.02em] text-ivory outline-none rtl:leading-[1.3] rtl:tracking-normal"
          >
            {t("title")}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75">{t("subtitle")}</p>
        </header>

        <div className="relative">
          <div aria-hidden="true" className="absolute inset-y-0 w-px bg-ivory/10 ltr:left-[2.75rem] rtl:right-[2.75rem] md:ltr:left-[3.5rem] md:rtl:right-[3.5rem]">
            <div ref={fill} className="h-full w-full origin-top bg-linear-to-b from-turq via-brass to-brass/40" />
          </div>
          <ol ref={list} className="relative grid gap-[18vh]">
            {EXPERIENCE.map((entry) => {
              const current = entry.end === null;
              const period =
                entry.end === null
                  ? `${digits(entry.start)} — ${t("present")}`
                  : entry.end === entry.start
                    ? digits(entry.start)
                    : `${digits(entry.start)} — ${digits(entry.end)}`;
              return (
                <li key={entry.id} data-entry className="relative grid grid-cols-[5.5rem_1fr] gap-6 md:grid-cols-[7rem_1fr] md:gap-10">
                  <div data-dial className="relative h-[5.5rem] w-[5.5rem] rounded-full bg-obsidian shadow-[0_0_0_6px_#07080A,0_20px_60px_-20px_rgb(200_161_90/0.35)] md:h-28 md:w-28">
                    <SubDial entry={entry} current={current} />
                  </div>
                  <article data-entry-body className="rounded-3xl border border-ivory/10 bg-obsidian/70 p-6 backdrop-blur-xl md:p-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em]">
                      <span className="text-brass">{period}</span>
                      <span className="text-ivory/50">{t(`items.${entry.id}.location`)}</span>
                      {current && (
                        <span className="rounded-full border border-turq/50 px-2.5 py-1 text-turq">{t("current")}</span>
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-3xl text-ivory md:text-4xl">
                      {entry.url ? (
                        <a href={entry.url} target="_blank" rel="noopener noreferrer" className="underline-offset-8 hover:underline" data-cursor="hand">
                          {entry.company}
                        </a>
                      ) : (
                        entry.company
                      )}
                      <span className="text-ivory/50"> · </span>
                      <span className="italic text-ivory/80">{t(`items.${entry.id}.role`)}</span>
                    </h3>
                    <p className="mt-3 text-ivory/75">{t(`items.${entry.id}.summary`)}</p>
                    <ul className="mt-5 grid gap-2.5">
                      {(t.raw(`items.${entry.id}.points`) as string[]).map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-ivory/70">
                          <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-brass" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label={entry.company}>
                      {entry.stack.map((s) => (
                        <li key={s} dir="ltr" className="rounded-full border border-ivory/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

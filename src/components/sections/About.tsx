"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { STATS } from "@/lib/portfolio-data";
import { withGsap } from "@/lib/watch/lazy";
import { formatNumber } from "@/lib/watch/navigation";
import { useUi } from "@/lib/watch/store";

const RIM = 420;
const TEETH = 96;
/** Plate i is 70° behind plate i-1 on the rim; the rim turns 3 × 70° over the chapter. */
const STEP = 70;

function rimPath() {
  const r0 = RIM - 14;
  const r1 = RIM;
  const parts: string[] = [];
  for (let i = 0; i < TEETH; i++) {
    const a = (i / TEETH) * Math.PI * 2;
    const w = (Math.PI * 2) / TEETH;
    const pts = [
      [a, r0],
      [a + w * 0.18, r1],
      [a + w * 0.52, r1],
      [a + w * 0.7, r0],
    ].map(([ang, r]) => `${(Math.cos(ang) * r).toFixed(2)} ${(Math.sin(ang) * r).toFixed(2)}`);
    parts.push(`${i === 0 ? "M" : "L"}${pts.join("L")}`);
  }
  return `${parts.join("")}Z`;
}

export default function About() {
  const t = useTranslations("TimeEngineered.About");
  const locale = useLocale();
  const rtl = locale === "fa";
  const motion = useUi((s) => s.motion);
  const section = useRef<HTMLElement>(null);
  const rim = useRef<HTMLDivElement>(null);
  const path = useMemo(rimPath, []);
  // The window faces the copy: left of the rim in LTR, right of it in RTL.
  const windowAngle = rtl ? 0 : 180;

  useEffect(() => {
    const el = section.current;
    const wheel = rim.current;
    if (!el || !wheel || !motion) return;
    return withGsap(({ gsap, ScrollTrigger }) => {
      const values = Array.from(wheel.querySelectorAll<HTMLElement>("[data-stat-value]"));
      const plates = Array.from(wheel.querySelectorAll<HTMLElement>("[data-stat-plate]"));
      const counted = new Set<number>();
      values.forEach((v) => (v.textContent = formatNumber(0, locale)));

      const countUp = (i: number) => {
        if (counted.has(i)) return;
        counted.add(i);
        const counter = { n: 0 };
        gsap.to(counter, {
          n: STATS[i].value,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: () => {
            values[i].textContent = formatNumber(Math.round(counter.n), locale);
          },
        });
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const turn = self.progress * STEP * (STATS.length - 1) * (rtl ? -1 : 1);
          wheel.style.setProperty("--rot", `${turn}deg`);
          const active = Math.round(self.progress * (STATS.length - 1));
          plates.forEach((p, i) => p.toggleAttribute("data-active", i === active));
          for (let i = 0; i <= active; i++) countUp(i);
        },
      });
      countUp(0);
      plates[0]?.setAttribute("data-active", "");
      return () => {
        st.kill();
        values.forEach((v, i) => (v.textContent = formatNumber(STATS[i].value, locale)));
      };
    });
  }, [locale, motion, rtl]);

  const stat = (i: number) => `${formatNumber(STATS[i].value, locale)}${STATS[i].suffix}`;

  return (
    <section
      ref={section}
      id="about"
      data-chapter="about"
      aria-labelledby="about-title"
      className="relative min-h-[100svh] lg:min-h-[300vh]"
    >
      <div className="relative overflow-hidden lg:sticky lg:top-0 lg:h-[100svh]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-full bg-linear-to-r from-obsidian/85 via-obsidian/45 to-transparent ltr:left-0 rtl:right-0 rtl:bg-linear-to-l lg:w-3/4"
        />
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-5 py-28 md:px-10 lg:w-1/2 lg:py-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">{t("eyebrow")}</p>
          <h2
            id="about-title"
            tabIndex={-1}
            data-focus-target
            className="te-kinetic mt-5 font-display text-[clamp(2.8rem,6.2vw,6.4rem)] leading-[0.95] tracking-[-0.02em] text-ivory outline-none rtl:leading-[1.3] rtl:tracking-normal"
          >
            {t("titleA")} <em className="text-brass">{t("titleB")}</em>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-ivory/80 md:text-lg">{t("body")}</p>
          <ul className="mt-8 grid max-w-xl gap-3">
            {(t.raw("points") as string[]).map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-ivory/80">
                <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rotate-45 bg-turq" />
                {point}
              </li>
            ))}
          </ul>

          <h3 className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-ivory/60 lg:sr-only">{t("statsLabel")}</h3>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ivory/10 bg-ivory/10 lg:sr-only">
            {STATS.map((s, i) => (
              <div key={s.id} className="bg-obsidian/80 p-5 backdrop-blur-md">
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-ivory/60">{t(`stats.${s.id}`)}</dt>
                <dd className="mt-2 font-display text-4xl text-ivory">{stat(i)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 hidden aspect-square w-[min(92vh,880px)] -translate-y-1/2 [container-type:size] lg:block ltr:-right-[18%] rtl:-left-[18%]"
        >
          <div ref={rim} className="absolute inset-0" style={{ transform: "rotate(var(--rot, 0deg))" }}>
            <svg viewBox={`${-RIM - 20} ${-RIM - 20} ${(RIM + 20) * 2} ${(RIM + 20) * 2}`} className="absolute inset-0 h-full w-full">
              <path d={path} fill="none" stroke="#C8A15A" strokeOpacity="0.55" strokeWidth="1.2" />
              <circle r={RIM - 34} fill="none" stroke="#C8A15A" strokeOpacity="0.25" strokeWidth="0.8" />
              <circle r={RIM - 118} fill="none" stroke="#F4EFE6" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="2 7" />
              {Array.from({ length: 60 }, (_, i) => {
                const a = (i / 60) * Math.PI * 2;
                const r0 = RIM - 34;
                const r1 = r0 - (i % 5 === 0 ? 16 : 7);
                return (
                  <line
                    key={i}
                    x1={Math.cos(a) * r0}
                    y1={Math.sin(a) * r0}
                    x2={Math.cos(a) * r1}
                    y2={Math.sin(a) * r1}
                    stroke="#C8A15A"
                    strokeOpacity={i % 5 === 0 ? 0.6 : 0.3}
                  />
                );
              })}
            </svg>

            {STATS.map((s, i) => {
              const angle = windowAngle + (rtl ? i : -i) * STEP;
              return (
                <div
                  key={s.id}
                  data-stat-plate
                  className="group absolute left-1/2 top-1/2 h-0 w-0"
                  style={{ transform: `rotate(${angle}deg) translateX(${(((RIM - 96) / (RIM + 20)) * 50).toFixed(2)}cqw)` }}
                >
                  <div
                    className="absolute left-0 top-0 w-[15.5rem]"
                    style={{
                      // The plate sits on the rim but its type always stays upright.
                      transform: `translate(-50%, -50%) rotate(calc(${-angle}deg - var(--rot, 0deg)))`,
                    }}
                  >
                    <div className="rounded-2xl border border-brass/25 bg-obsidian-2/70 px-6 py-5 opacity-45 shadow-[inset_0_1px_0_rgb(244_239_230/0.08)] backdrop-blur-md transition-[opacity,border-color,scale] duration-500 group-data-[active]:scale-105 group-data-[active]:border-brass/70 group-data-[active]:opacity-100">
                      <div className="flex items-baseline gap-1 font-display text-6xl leading-none text-ivory">
                        <span data-stat-value className="tabular-nums">
                          {formatNumber(s.value, locale)}
                        </span>
                        <span className="text-brass">{s.suffix}</span>
                      </div>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ivory/65">{t(`stats.${s.id}`)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

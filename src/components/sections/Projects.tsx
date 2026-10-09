"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PROJECTS } from "@/lib/portfolio-data";
import { withGsap } from "@/lib/watch/lazy";
import { scrollToSection } from "@/lib/watch/navigation";
import { getLenis, useUi } from "@/lib/watch/store";
import Magnetic from "@/components/layout/Magnetic";
import ProjectCard from "@/components/project/ProjectCard";

export default function Projects() {
  const t = useTranslations("TimeEngineered.Projects");
  const locale = useLocale();
  const rtl = locale === "fa";
  const motion = useUi((s) => s.motion);
  const horizontal = motion !== false;
  const wrapper = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const distance = useRef(0);

  useEffect(() => {
    const outer = wrapper.current;
    const row = track.current;
    if (!outer || !row || !motion) return;
    return withGsap(({ ScrollTrigger }) => {
      const measure = () => {
        distance.current = Math.max(0, row.scrollWidth - window.innerWidth);
        outer.style.height = `${distance.current + window.innerHeight}px`;
        outer.style.minHeight = "0px";
      };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);

      const st = ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const x = self.progress * distance.current * (rtl ? 1 : -1);
          row.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
          bar.current?.style.setProperty("--p", self.progress.toFixed(4));
        },
      });
      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", measure);
        st.kill();
        outer.style.height = "";
        outer.style.minHeight = "";
        row.style.transform = "";
      };
    });
  }, [motion, rtl]);

  /** Keyboard users tab along the strap: scroll the page so the focused card is centred. */
  const onFocus = (e: React.FocusEvent) => {
    const outer = wrapper.current;
    const row = track.current;
    const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-strap-item]");
    if (!outer || !row || !panel || !motion || distance.current <= 0) return;
    const start = rtl ? row.scrollWidth - (panel.offsetLeft + panel.offsetWidth) : panel.offsetLeft;
    const p = Math.min(1, Math.max(0, (start + panel.offsetWidth / 2 - window.innerWidth / 2) / distance.current));
    const top = outer.getBoundingClientRect().top + window.scrollY;
    const y = top + p * (outer.offsetHeight - window.innerHeight);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  };

  return (
    <div ref={wrapper} id="projects" data-chapter="projects" className={horizontal ? "relative min-h-[400vh]" : "relative"}>
      <section
        aria-labelledby="projects-title"
        className={horizontal ? "sticky top-0 flex h-[100svh] items-center overflow-x-clip" : "relative py-28"}
      >
        {horizontal && (
          <div aria-hidden="true" className="te-strap pointer-events-none absolute inset-x-0 top-1/2 h-[46%] -translate-y-1/2 border-y border-brass/15">
            <div className="absolute inset-x-0 top-3 border-t border-dashed border-brass/30" />
            <div className="absolute inset-x-0 bottom-3 border-b border-dashed border-brass/30" />
          </div>
        )}

        <div
          ref={track}
          onFocus={onFocus}
          className={
            horizontal
              ? "relative flex w-max items-center gap-8 px-[6vw] will-change-transform md:gap-14"
              : "mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:px-10"
          }
        >
          <header data-strap-item className={horizontal ? "w-[min(86vw,34rem)] shrink-0" : "md:col-span-2"}>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">{t("eyebrow")}</p>
            <h2
              id="projects-title"
              tabIndex={-1}
              data-focus-target
              className="te-kinetic mt-5 font-display text-[clamp(3rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.02em] text-ivory outline-none rtl:leading-[1.25] rtl:tracking-normal"
            >
              {t("title")}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75">{t("subtitle")}</p>
            {horizontal && (
              <p className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/55">
                <span aria-hidden="true" className="inline-block h-px w-10 bg-brass" />
                {t("hint")}
              </p>
            )}
          </header>

          {PROJECTS.map((project, i) => (
            <div key={project.id} data-strap-item className={horizontal ? "te-float" : ""} style={horizontal ? { animationDelay: `${i * -1.3}s` } : undefined}>
              <ProjectCard project={project} index={i} total={PROJECTS.length} />
            </div>
          ))}

          <aside data-strap-item className={horizontal ? "flex w-[min(80vw,26rem)] shrink-0 flex-col items-start" : "md:col-span-2"}>
            <p className="font-display text-6xl leading-none text-ivory md:text-7xl">{t("endTitle")}</p>
            <p className="mt-5 max-w-xs text-ivory/70">{t("endBody")}</p>
            <Magnetic className="mt-8">
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="rounded-full border border-brass/50 px-6 py-3 text-sm text-ivory transition-colors hover:bg-brass hover:text-obsidian"
              >
                {t("endCta")}
              </button>
            </Magnetic>
          </aside>
        </div>

        {horizontal && (
          <div
            ref={bar}
            aria-hidden="true"
            className="absolute bottom-10 h-px w-[min(40vw,22rem)] bg-ivory/15 ltr:left-[6vw] rtl:right-[6vw]"
          >
            <div
              className="h-full bg-brass ltr:origin-left rtl:origin-right"
              style={{ transform: "scaleX(var(--p, 0))" }}
            />
          </div>
        )}
      </section>
    </div>
  );
}

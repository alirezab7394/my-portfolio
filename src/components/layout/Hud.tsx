"use client";

import { useLocale, useTranslations } from "next-intl";
import { useNow } from "@/hooks/use-now";
import { CHAPTERS, formatChapterTime } from "@/lib/watch/chapters";
import { formatNumber, scrollToSection } from "@/lib/watch/navigation";
import { setSound } from "@/lib/watch/sound";
import { setUi, useUi } from "@/lib/watch/store";
import LanguageDial from "./LanguageDial";

export const toPersianDigits = (value: string) => value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/** Fixed chrome: monogram, chapter chronometer, chapter rail, sound + language, progress crown. */
export default function Hud() {
  const t = useTranslations("TimeEngineered.Hud");
  const locale = useLocale();
  const chapter = useUi((s) => s.chapter);
  const soundOn = useUi((s) => s.soundOn);
  const exploded = useUi((s) => s.exploded);
  const webgl = useUi((s) => s.webgl && s.motion);
  const now = useNow();
  const current = CHAPTERS[chapter];
  const time = now ? formatChapterTime(chapter, now) : "--:--";
  const localized = locale === "fa" ? toPersianDigits(time) : time;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-5 pt-5 md:px-10 md:pt-7">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("hero");
          }}
          className="pointer-events-auto group flex items-center gap-3"
          aria-label={t("home")}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/50 font-display text-lg italic text-ivory transition-colors group-hover:border-turq">
            ab
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-medium text-ivory">{t("name")}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/60">{t("role")}</span>
          </span>
        </a>

        <div
          className="pointer-events-none absolute left-1/2 top-7 hidden -translate-x-1/2 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-ivory/70 md:flex"
          aria-hidden="true"
        >
          <span className="text-brass">{current.numeral}</span>
          <span className="h-px w-8 bg-ivory/30" />
          <span className="tabular-nums text-ivory">{localized}</span>
          <span className="h-px w-8 bg-ivory/30" />
          <span>{t(`chapters.${current.id}`)}</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSound(!soundOn)}
            aria-pressed={soundOn}
            aria-label={t("soundToggle")}
            className="flex h-11 items-center gap-2 rounded-full border border-ivory/15 px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/80 transition-colors hover:border-brass hover:text-ivory"
          >
            <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
              {[0.5, 1, 0.7].map((h, i) => (
                <span
                  key={i}
                  className={`w-[2px] rounded-full bg-current transition-all duration-500 ${soundOn ? "" : "!h-[2px]"}`}
                  style={{ height: `${h * 12}px` }}
                />
              ))}
            </span>
            <span className="hidden sm:inline">{soundOn ? t("soundOn") : t("soundOff")}</span>
          </button>
          <LanguageDial />
        </div>
      </header>

      <nav
        aria-label={t("nav")}
        className="fixed top-1/2 z-40 hidden -translate-y-1/2 ltr:right-6 rtl:left-6 lg:block"
      >
        <ol className="flex flex-col gap-1">
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(c.id);
                }}
                aria-current={i === chapter ? "step" : undefined}
                className="group flex items-center justify-end gap-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em]"
              >
                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    i === chapter ? "text-ivory opacity-100" : "text-ivory/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  {t(`chapters.${c.id}`)}
                </span>
                <span className={`w-7 text-center transition-colors ${i === chapter ? "text-turq" : "text-brass/80"}`}>{c.numeral}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between px-5 pb-5 md:px-10 md:pb-7">
        {webgl ? (
          <button
            type="button"
            onClick={() => setUi({ exploded: !exploded })}
            aria-pressed={exploded}
            className="pointer-events-auto hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/60 transition-colors hover:text-ivory md:flex"
          >
            <kbd className="flex h-7 w-7 items-center justify-center rounded border border-ivory/25 font-mono text-[11px] text-ivory">T</kbd>
            {t("exploded")}
          </button>
        ) : (
          <span />
        )}
        <div
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-ivory/60"
          aria-hidden="true"
        >
          <span className="tabular-nums">
            {formatNumber(chapter + 1, locale)} / {formatNumber(CHAPTERS.length, locale)}
          </span>
          <svg id="te-progress" viewBox="0 0 40 40" className="h-10 w-10 -rotate-90" style={{ ["--te-p" as string]: 0 }}>
            <circle cx="20" cy="20" r="17" fill="none" stroke="rgb(244 239 230 / 0.15)" strokeWidth="1" />
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="#C8A15A"
              strokeWidth="1.5"
              pathLength={100}
              strokeDasharray="100"
              style={{ strokeDashoffset: "calc(100 - var(--te-p) * 100)" }}
            />
            <circle cx="20" cy="20" r="2" fill="#22D3C5" />
          </svg>
        </div>
      </div>
    </>
  );
}

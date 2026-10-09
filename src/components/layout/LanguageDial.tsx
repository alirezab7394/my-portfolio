"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { playTick } from "@/lib/watch/sound";
import { FLIP_KEY } from "./Loader";

/**
 * Language toggle drawn as a tiny two-faced dial. Switching flips the dial (and the whole
 * screen) on its Y axis before navigating; the next page's loader flips back in.
 */
export default function LanguageDial() {
  const t = useTranslations("TimeEngineered.Hud");
  const locale = useLocale();
  const next = locale === "en" ? "fa" : "en";
  const router = useRouter();
  const pathname = usePathname();
  const [flipping, setFlipping] = useState(false);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    playTick();
    try {
      sessionStorage.setItem(FLIP_KEY, next);
    } catch {
      /* storage unavailable */
    }
    window.setTimeout(() => router.replace(pathname, { locale: next }), 620);
  };

  const face = "absolute inset-0 flex items-center justify-center rounded-full border border-brass/50 bg-obsidian-2 [backface-visibility:hidden]";

  return (
    <>
      <button
        type="button"
        onClick={flip}
        lang={next}
        aria-label={t("language")}
        className="relative h-11 w-11 shrink-0 [perspective:400px]"
      >
        <m.span
          className="absolute inset-0 [transform-style:preserve-3d]"
          animate={{ rotateY: flipping ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
        >
          <span className={`${face} font-mono text-[11px] tracking-widest text-ivory`}>{locale === "en" ? "EN" : "فا"}</span>
          <span className={`${face} font-mono text-[11px] tracking-widest text-turq [transform:rotateY(180deg)]`}>
            {next === "en" ? "EN" : "فا"}
          </span>
        </m.span>
      </button>
      {flipping && (
        <m.div
          aria-hidden="true"
          className="fixed inset-0 z-[150] flex items-center justify-center bg-obsidian"
          initial={{ rotateY: 90, opacity: 0.4 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
          style={{ transformPerspective: 1400 }}
        >
          <span className="font-display text-[22vw] leading-none text-brass">{next === "en" ? "En" : "فا"}</span>
        </m.div>
      )}
    </>
  );
}

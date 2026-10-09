"use client";

import { getLenis, getUi } from "./store";

/** Scrolls to a chapter and moves keyboard focus to its heading once there. */
export function scrollToSection(id: string) {
  const el = document.querySelector<HTMLElement>(`[data-chapter="${id}"]`) ?? document.getElementById(id);
  if (!el) return;
  const focusTarget = el.querySelector<HTMLElement>("[data-focus-target]") ?? el;
  const focus = () => focusTarget.focus({ preventScroll: true });
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.8, onComplete: focus });
    return;
  }
  el.scrollIntoView({ behavior: getUi().motion ? "smooth" : "auto" });
  focus();
}

export function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}

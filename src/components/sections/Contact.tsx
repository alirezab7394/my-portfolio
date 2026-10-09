"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { LINKS } from "@/lib/portfolio-data";
import { notify } from "@/lib/watch/lazy";
import { useUi } from "@/lib/watch/store";
import Magnetic from "@/components/layout/Magnetic";
import { toPersianDigits } from "@/components/layout/Hud";

export default function Contact() {
  const t = useTranslations("TimeEngineered.Contact");
  const locale = useLocale();
  const is3d = useUi((s) => s.motion === true && s.webgl === true);
  const year = String(new Date().getFullYear());

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      notify(t("copied"), "success");
    } catch {
      notify(t("copyFailed"));
      window.location.href = `mailto:${LINKS.email}`;
    }
  };

  const links = [
    { label: t("github"), href: LINKS.github, external: true },
    { label: t("linkedin"), href: LINKS.linkedin, external: true },
    { label: t("resume"), href: LINKS.resume, external: true },
  ];

  return (
    <section
      id="contact"
      data-chapter="contact"
      aria-labelledby="contact-title"
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-8 pt-28 md:px-10"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] bg-linear-to-t from-obsidian via-obsidian/70 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">{t("eyebrow")}</p>
        <h2
          id="contact-title"
          tabIndex={-1}
          data-focus-target
          className="te-kinetic mt-5 max-w-5xl font-display text-[clamp(3rem,8.5vw,9rem)] leading-[0.9] tracking-[-0.025em] text-ivory outline-none rtl:leading-[1.25] rtl:tracking-normal"
        >
          {t("title")}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75 md:text-lg">{t("body")}</p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
          <Magnetic strength={0.28} radius={120}>
            <button
              type="button"
              onClick={copyEmail}
              data-cursor="crown"
              className="group flex items-center gap-5 rounded-full bg-ivory py-2.5 ps-7 pe-2.5 text-obsidian transition-colors hover:bg-brass"
            >
              <span dir="ltr" className="font-display text-xl md:text-3xl">
                {LINKS.email}
              </span>
              <span className="flex h-11 items-center gap-2 rounded-full bg-obsidian px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory md:h-14">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span className="sr-only sm:not-sr-only">{t("copy")}</span>
              </span>
            </button>
          </Magnetic>

          <nav aria-label={t("links")}>
            <ul className="flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hand"
                    className="block rounded-full border border-ivory/20 px-5 py-2.5 text-sm text-ivory/85 transition-colors hover:border-turq hover:text-turq"
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  data-cursor="hand"
                  className="block rounded-full border border-ivory/20 px-5 py-2.5 text-sm text-ivory/85 transition-colors hover:border-turq hover:text-turq"
                >
                  {t("form")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50">
          <span className="font-display text-base normal-case tracking-normal text-ivory/80 italic">{t("footer")}</span>
          <span>{t("rights", { year: locale === "fa" ? toPersianDigits(year) : year })}</span>
          <span>{t("made")}</span>
          {is3d && <span className="hidden lg:inline">{t("hint")}</span>}
        </footer>
      </div>
    </section>
  );
}

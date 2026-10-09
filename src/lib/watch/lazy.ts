"use client";

/**
 * GSAP, Lenis and sonner stay out of the initial bundle: nothing they drive is visible
 * before the loader finishes, so they are fetched right after hydration instead.
 */
let gsapModule: Promise<typeof import("./gsap")> | null = null;

export const loadGsap = () => (gsapModule ??= import("./gsap"));

export const loadLenis = () => import("lenis").then((m) => m.default);

export function notify(message: string, kind: "default" | "success" = "default") {
  void import("sonner").then(({ toast }) => (kind === "success" ? toast.success(message) : toast(message)));
}

/**
 * Runs `setup` once GSAP has loaded; the returned cleanup runs on unmount (or immediately
 * if the effect was torn down before the chunk arrived).
 */
export function withGsap(setup: (lib: Awaited<ReturnType<typeof loadGsap>>) => (() => void) | void) {
  let cleanup: (() => void) | void;
  let cancelled = false;
  void loadGsap().then((lib) => {
    if (!cancelled) cleanup = setup(lib);
  });
  return () => {
    cancelled = true;
    cleanup?.();
  };
}

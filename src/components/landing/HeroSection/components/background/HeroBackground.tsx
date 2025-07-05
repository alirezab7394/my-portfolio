"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./HeroBackground.module.css";

export default function HeroBackground() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Enhanced Gradient Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-stone-50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/40 via-transparent to-primary/15" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-slate-50/30 to-primary/10" />

      {/* Multi-layered Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>

      {/* Enhanced Radial Gradients */}
      <div
        className="absolute inset-0 opacity-45"
        style={{
          background: `radial-gradient(circle at 20% 30%, rgba(30,64,175,0.13) 0%, transparent 50%), 
                       radial-gradient(circle at 80% 70%, rgba(31,41,55,0.10) 0%, transparent 50%),
                       radial-gradient(circle at 60% 20%, rgba(148,163,184,0.07) 0%, transparent 40%)`,
        }}
      />

      {/* Primary Floating Geometric Elements */}
      <div
        className={`absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-slate-200/65 to-slate-300/45 rounded-full opacity-35 blur-sm ${styles["float-gentle-large"]}`}
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      <div
        className={`absolute top-40 right-20 w-8 h-8 bg-gradient-to-br from-primary/25 to-primary/15 rounded-full opacity-45 ${styles["float-gentle-medium"]}`}
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      />

      <div
        className={`absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-br from-slate-300/45 to-slate-400/25 rounded-full opacity-35 blur-[1px] ${styles["float-gentle-small"]}`}
        style={{
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      />

      {/* Additional Floating Circles */}
      <div
        className={`absolute top-1/4 left-1/3 w-6 h-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full opacity-40 ${styles["float-and-pulse"]}`}
        style={{
          transform: `translateY(${scrollY * 0.06}px)`,
        }}
      />

      <div
        className={`absolute bottom-1/3 right-1/4 w-10 h-10 bg-gradient-to-br from-slate-400/35 to-slate-500/20 rounded-full opacity-30 blur-[2px] ${styles["float-gentle-xlarge"]}`}
        style={{
          transform: `translateY(${scrollY * 0.04}px)`,
        }}
      />

      {/* Enhanced Floating Rectangles */}
      <div
        className={`hidden md:block absolute top-1/3 right-10 w-6 h-20 bg-gradient-to-b from-slate-200/55 to-slate-300/35 rounded-sm opacity-25 ${styles["float-gentle-large"]}`}
        style={{
          transform: `translateY(${scrollY * 0.12}px) rotate(15deg)`,
        }}
      />

      <div
        className={`hidden lg:block absolute bottom-1/4 right-1/3 w-4 h-16 bg-gradient-to-b from-primary/20 to-primary/10 rounded-sm opacity-35 ${styles["float-gentle-medium"]}`}
        style={{
          transform: `translateY(${scrollY * 0.06}px) rotate(-10deg)`,
        }}
      />

      {/* New Geometric Shapes */}
      <div
        className={`hidden lg:block absolute top-16 left-1/2 w-8 h-12 bg-gradient-to-b from-slate-300/40 to-slate-400/20 rounded-sm opacity-30 ${styles["float-and-drift"]}`}
        style={{
          transform: `translateY(${scrollY * 0.09}px) rotate(25deg)`,
        }}
      />

      <div
        className={`absolute top-3/4 left-16 w-5 h-18 bg-gradient-to-b from-primary/15 to-primary/5 rounded-sm opacity-25 ${styles["drift-horizontal"]}`}
        style={{
          transform: `translateY(${scrollY * 0.11}px) rotate(-20deg)`,
        }}
      />

      {/* Diamond Shapes */}
      <div
        className={`absolute top-1/2 left-1/4 w-4 h-4 bg-gradient-to-br from-slate-300/45 to-slate-400/25 opacity-35 ${styles["float-gentle-small"]}`}
        style={{
          transform: `translateY(${scrollY * 0.05}px) rotate(45deg)`,
        }}
      />

      <div
        className={`absolute bottom-1/4 left-3/4 w-3 h-3 bg-gradient-to-br from-primary/30 to-primary/15 opacity-40 ${styles["rotate-slow"]}`}
        style={{
          transform: `translateY(${scrollY * 0.07}px)`,
        }}
      />

      {/* Enhanced Accent Lines */}
      <div
        className={`absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-slate-300/65 to-transparent ${styles["float-gentle-small"]}`}
        style={{
          transform: `translateY(${scrollY * 0.04}px)`,
        }}
      />

      <div
        className={`absolute bottom-1/3 right-0 w-24 h-px bg-gradient-to-l from-transparent via-primary/45 to-transparent ${styles["float-gentle-large"]}`}
        style={{
          transform: `translateY(${scrollY * 0.07}px)`,
        }}
      />

      {/* Additional Accent Lines */}
      <div
        className={`absolute top-1/2 left-1/2 w-20 h-px bg-gradient-to-r from-transparent via-slate-400/55 to-transparent ${styles["drift-horizontal"]}`}
        style={{
          transform: `translateY(${scrollY * 0.06}px)`,
        }}
      />

      <div
        className={`absolute bottom-1/2 left-1/4 w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent ${styles["float-gentle-medium"]}`}
        style={{
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      />

      {/* Enhanced Minimalist Dots */}
      <div
        className={`absolute top-2/3 left-1/3 w-2 h-2 bg-slate-400/35 rounded-full ${styles["float-gentle-small"]}`}
        style={{
          transform: `translateY(${scrollY * 0.03}px)`,
        }}
      />

      <div
        className={`absolute top-1/2 right-1/4 w-1 h-1 bg-primary/45 rounded-full ${styles["float-gentle-medium"]}`}
        style={{
          transform: `translateY(${scrollY * 0.09}px)`,
        }}
      />

      {/* Additional Dot Patterns */}
      <div
        className={`absolute top-1/3 left-2/3 w-1.5 h-1.5 bg-slate-500/30 rounded-full ${styles["pulse-gentle"]}`}
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      />

      <div
        className={`absolute bottom-2/3 right-1/3 w-2.5 h-2.5 bg-primary/30 rounded-full ${styles["float-and-pulse"]}`}
        style={{
          transform: `translateY(${scrollY * 0.07}px)`,
        }}
      />

      <div
        className={`absolute top-1/4 right-2/3 w-1 h-1 bg-slate-400/40 rounded-full ${styles["float-gentle-xlarge"]}`}
        style={{
          transform: `translateY(${scrollY * 0.04}px)`,
        }}
      />

      {/* Complex Geometric Patterns */}
      <div
        className={`absolute top-1/5 right-1/5 w-8 h-1 bg-gradient-to-r from-transparent via-slate-300/45 to-transparent ${styles["rotate-slow"]}`}
        style={{
          transform: `translateY(${scrollY * 0.06}px)`,
        }}
      />

      <div
        className={`absolute bottom-1/5 left-1/5 w-1 h-8 bg-gradient-to-b from-transparent via-primary/35 to-transparent ${styles["float-gentle-large"]}`}
        style={{
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      />

      {/* Subtle Mesh Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.25)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Enhanced Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/0" />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function HeroBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Throttled mouse move handler for performance
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    });
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const container = containerRef.current?.parentNode;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove as EventListener, { passive: true });
      container.addEventListener("mouseenter", () => setIsVisible(true));
      container.addEventListener("mouseleave", () => setIsVisible(false));
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove as EventListener);
        container.removeEventListener("mouseenter", () => setIsVisible(true));
        container.removeEventListener("mouseleave", () => setIsVisible(false));
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Base Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />

      {/* Interactive Wave Elements - Primary Layer */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          opacity: isVisible ? 0.8 : 0.2,
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(30,64,175,0.3) 0%, rgba(30,64,175,0.15) 30%, transparent 70%)`,
          transform: `translate(${(mousePosition.x - 50) * 0.4}px, ${(mousePosition.y - 50) * 0.4}px) scale(${
            isVisible ? 1.15 : 1
          })`,
          transition: "transform 0.15s ease-out, opacity 0.25s ease-out",
        }}
      />

      {/* Secondary Wave Layer - Counter Movement */}
      <div
        className="absolute inset-0 transition-all duration-400"
        style={{
          opacity: isVisible ? 0.6 : 0.1,
          background: `radial-gradient(circle at ${100 - mousePosition.x}% ${
            100 - mousePosition.y
          }%, rgba(31,41,55,0.25) 0%, rgba(31,41,55,0.1) 40%, transparent 80%)`,
          transform: `translate(${(mousePosition.x - 50) * -0.3}px, ${(mousePosition.y - 50) * -0.3}px) scale(${
            isVisible ? 1.08 : 1
          })`,
          transition: "transform 0.2s ease-out, opacity 0.3s ease-out",
        }}
      />

      {/* Tertiary Wave Layer - Larger Radius */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          opacity: isVisible ? 0.5 : 0.05,
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(30,64,175,0.08) 0%, transparent 90%)`,
          transform: `translate(${(mousePosition.x - 50) * 0.6}px, ${(mousePosition.y - 50) * 0.6}px) scale(${
            isVisible ? 1.3 : 1
          })`,
          transition: "transform 0.1s ease-out, opacity 0.4s ease-out",
        }}
      />

      {/* Floating Wave Particles - Enhanced */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full transition-all duration-300 shadow-lg ${
            i % 3 === 0 ? "border border-blue-400/30 bg-transparent" : "bg-blue-400/50"
          } ${i >= 4 ? "hidden md:block" : ""}`}
          style={{
            width: `${8 + i * 2}px`,
            height: `${8 + i * 2}px`,
            left: `${15 + i * 12}%`,
            top: `${25 + (i % 3) * 25}%`,
            transform: `translate(${(mousePosition.x - 50) * (0.1 + i * 0.03)}px, ${
              (mousePosition.y - 50) * (0.08 + i * 0.02)
            }px) scale(${1 + (isVisible ? 1.5 + i * 0.2 : 0)})`,
            opacity: isVisible ? 0.8 : 0.3,
            animationDelay: `${i * 0.3}s`,
            background:
              i % 3 === 0
                ? "transparent"
                : `radial-gradient(circle, rgba(30,64,175,${0.6 + i * 0.1}) 0%, rgba(30,64,175,0.2) 100%)`,
            boxShadow: isVisible ? "0 0 20px rgba(30,64,175,0.4)" : "0 0 5px rgba(30,64,175,0.2)",
          }}
        />
      ))}

      {/* Additional Floating Elements */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`extra-${i}`}
          className={`absolute rounded-full transition-all duration-400 ${
            i % 2 === 0 ? "border border-slate-400/30 bg-transparent" : "bg-slate-400/40"
          } ${i >= 2 ? "hidden lg:block" : ""}`}
          style={{
            width: `${6 + i * 3}px`,
            height: `${6 + i * 3}px`,
            left: `${25 + i * 20}%`,
            top: `${35 + (i % 2) * 30}%`,
            transform: `translate(${(mousePosition.x - 50) * (-0.05 + i * 0.02)}px, ${
              (mousePosition.y - 50) * (0.04 + i * 0.015)
            }px) scale(${1 + (isVisible ? 1 + i * 0.3 : 0)})`,
            opacity: isVisible ? 0.7 : 0.2,
            background:
              i % 2 === 0
                ? "transparent"
                : `radial-gradient(circle, rgba(31,41,55,${0.5 + i * 0.1}) 0%, rgba(31,41,55,0.1) 100%)`,
            boxShadow: isVisible ? "0 0 15px rgba(31,41,55,0.3)" : "none",
          }}
        />
      ))}

      {/* Floating Geometric Shapes */}
      <div className="hidden md:block absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-40 animate-pulse blur-sm" />
      <div
        className="absolute top-32 left-20 w-6 h-6 md:w-8 md:h-8 bg-blue-500/20 rounded-full animate-bounce"
        style={{ animationDelay: "2s", animationDuration: "3s" }}
      />

      <div
        className="hidden lg:block absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-tl from-slate-100 to-slate-200 rounded-full opacity-20 animate-pulse blur-md"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-20 right-32 w-4 h-4 md:w-6 md:h-6 bg-slate-400/30 rounded-full animate-ping"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Interactive Floating Rectangles - Enhanced */}
      <div
        className="hidden md:block absolute top-1/3 left-8 w-16 h-20 bg-gradient-to-b from-blue-200/60 to-blue-300/40 rounded-lg animate-pulse transition-all duration-200 shadow-xl"
        style={{
          animationDelay: "0.5s",
          animationDuration: "4s",
          transform: `rotate(${12 + (mousePosition.x - 50) * 0.1}deg) translate(${(mousePosition.x - 50) * 0.15}px, ${
            (mousePosition.y - 50) * 0.1
          }px) scale(${isVisible ? 1.2 : 1})`,
          opacity: isVisible ? 0.8 : 0.4,
          boxShadow: isVisible ? "0 10px 30px rgba(30,64,175,0.3)" : "0 5px 15px rgba(30,64,175,0.1)",
        }}
      />
      <div
        className="hidden md:block absolute top-1/2 right-12 w-14 h-18 bg-gradient-to-t from-slate-200/50 to-slate-300/30 rounded-md animate-pulse transition-all duration-200 shadow-xl"
        style={{
          animationDelay: "2.5s",
          animationDuration: "5s",
          transform: `rotate(${-15 + (mousePosition.x - 50) * -0.08}deg) translate(${
            (mousePosition.x - 50) * -0.12
          }px, ${(mousePosition.y - 50) * 0.15}px) scale(${isVisible ? 1.15 : 1})`,
          opacity: isVisible ? 0.7 : 0.3,
          boxShadow: isVisible ? "0 8px 25px rgba(31,41,55,0.3)" : "0 4px 12px rgba(31,41,55,0.1)",
        }}
      />

      {/* Floating Dots */}
      <div
        className="absolute top-1/4 right-1/4 w-2 h-2 md:w-3 md:h-3 border border-blue-400/20 bg-transparent rounded-full animate-bounce"
        style={{ animationDelay: "1s", animationDuration: "2s" }}
      />
      <div
        className="hidden md:block absolute bottom-1/3 left-1/3 w-2 h-2 bg-slate-400/50 rounded-full animate-ping"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute top-3/4 left-1/4 w-3 h-3 md:w-4 md:h-4 border border-blue-300/20 bg-transparent rounded-full animate-pulse"
        style={{ animationDelay: "4s" }}
      />

      {/* Larger Floating Elements with Mouse Interaction */}
      <div
        className="hidden lg:block absolute top-16 right-20 w-32 h-32 bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-2xl opacity-60 animate-pulse blur-sm transition-transform duration-500"
        style={{
          animationDelay: "0.8s",
          animationDuration: "6s",
          transform: `rotate(45deg) translateY(-10px) translate(${(mousePosition.x - 50) * 0.04}px, ${
            (mousePosition.y - 50) * 0.03
          }px)`,
        }}
      />

      {/* Subtle Particle Effects */}
      <div
        className="hidden md:block absolute top-1/2 left-1/2 w-1 h-1 border border-blue-500/40 bg-transparent rounded-full animate-ping"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="hidden md:block absolute top-3/5 left-3/5 w-1 h-1 bg-slate-500/40 rounded-full animate-ping"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="hidden md:block absolute bottom-1/4 right-1/3 w-1 h-1 border border-blue-400/30 bg-transparent rounded-full animate-ping"
        style={{ animationDelay: "6s" }}
      />

      {/* Luxury Gradient Orbs with Enhanced Wave Effect */}
      <div
        className="absolute bottom-40 left-24 w-72 h-72 rounded-full animate-pulse blur-2xl transition-all duration-300"
        style={{
          background: `radial-gradient(circle, rgba(219,234,254,${isVisible ? 0.4 : 0.2}) 0%, rgba(239,246,255,${
            isVisible ? 0.25 : 0.1
          }) 50%, transparent 100%)`,
          opacity: isVisible ? 0.9 : 0.6,
          animationDelay: "1.2s",
          animationDuration: "8s",
          transform: `translate(${(mousePosition.x - 50) * 0.2}px, ${(mousePosition.y - 50) * 0.15}px) scale(${
            isVisible ? 1.3 : 1
          })`,
        }}
      />
      <div
        className="absolute top-24 right-32 w-64 h-64 rounded-full animate-pulse blur-2xl transition-all duration-400"
        style={{
          background: `radial-gradient(circle, rgba(241,245,249,${isVisible ? 0.35 : 0.2}) 0%, rgba(248,250,252,${
            isVisible ? 0.2 : 0.1
          }) 50%, transparent 100%)`,
          opacity: isVisible ? 0.8 : 0.5,
          animationDelay: "2.8s",
          animationDuration: "7s",
          transform: `translate(${(mousePosition.x - 50) * -0.15}px, ${(mousePosition.y - 50) * 0.2}px) scale(${
            isVisible ? 1.25 : 1
          })`,
        }}
      />

      {/* Subtle Line Elements */}
      <div
        className="hidden lg:block absolute top-1/3 left-1/2 w-px h-16 bg-gradient-to-b from-transparent via-blue-200/40 to-transparent opacity-60 animate-pulse"
        style={{ animationDelay: "3.5s" }}
      />
      <div
        className="hidden lg:block absolute bottom-1/3 right-1/3 w-12 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent opacity-50 animate-pulse"
        style={{ animationDelay: "5s" }}
      />
    </div>
  );
}

"use client";
import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animationType?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "rotate";
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export default function AnimatedSection({
  children,
  className,
  animationType = "fade",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
  triggerOnce = true,
  disabled = false,
  ref,
}: AnimatedSectionProps) {
  const { ref: animationRef, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  // If disabled, just return children without animation
  if (disabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const getAnimationClasses = () => {
    const baseClasses = "transition-all ease-out";
    const durationClass = `duration-[${duration}ms]`;
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : "";

    const initial = {
      fade: "opacity-0",
      "slide-up": "opacity-0 translate-y-8",
      "slide-down": "opacity-0 -translate-y-8",
      "slide-left": "opacity-0 translate-x-8",
      "slide-right": "opacity-0 -translate-x-8",
      scale: "opacity-0 scale-95",
      rotate: "opacity-0 rotate-3 scale-95",
    };

    const visible = {
      fade: "opacity-100",
      "slide-up": "opacity-100 translate-y-0",
      "slide-down": "opacity-100 translate-y-0",
      "slide-left": "opacity-100 translate-x-0",
      "slide-right": "opacity-100 translate-x-0",
      scale: "opacity-100 scale-100",
      rotate: "opacity-100 rotate-0 scale-100",
    };

    return cn(baseClasses, durationClass, delayClass, isVisible ? visible[animationType] : initial[animationType]);
  };

  return (
    <div
      ref={(node) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        animationRef.current = node;
      }}
      className={cn(getAnimationClasses(), className)}
    >
      {children}
    </div>
  );
}

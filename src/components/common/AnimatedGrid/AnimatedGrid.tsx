"use client";
import { ReactNode, Children } from "react";
import { useStaggerAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
  animationType?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale";
  staggerDelay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  disabled?: boolean;
}

export default function AnimatedGrid({
  children,
  className,
  animationType = "slide-up",
  staggerDelay = 100,
  duration = 600,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  triggerOnce = true,
  disabled = false,
}: AnimatedGridProps) {
  const childrenArray = Children.toArray(children);
  const { ref, visibleItems } = useStaggerAnimation(childrenArray.length, {
    threshold,
    rootMargin,
    triggerOnce,
  });

  // If disabled, just return children without animation
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const getAnimationClasses = (isVisible: boolean, index: number) => {
    const baseClasses = "transition-all ease-out";
    const durationClass = `duration-[${duration}ms]`;
    const delayClass = `delay-[${index * staggerDelay}ms]`;

    const initial = {
      fade: "opacity-0",
      "slide-up": "opacity-0 translate-y-8",
      "slide-down": "opacity-0 -translate-y-8",
      "slide-left": "opacity-0 translate-x-8",
      "slide-right": "opacity-0 -translate-x-8",
      scale: "opacity-0 scale-95",
    };

    const visible = {
      fade: "opacity-100",
      "slide-up": "opacity-100 translate-y-0",
      "slide-down": "opacity-100 translate-y-0",
      "slide-left": "opacity-100 translate-x-0",
      "slide-right": "opacity-100 translate-x-0",
      scale: "opacity-100 scale-100",
    };

    return cn(baseClasses, durationClass, delayClass, isVisible ? visible[animationType] : initial[animationType]);
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {childrenArray.map((child, index) => {
        const isVisible = visibleItems[index];

        return (
          <div key={index} className={getAnimationClasses(isVisible, index)}>
            {child}
          </div>
        );
      })}
    </div>
  );
}

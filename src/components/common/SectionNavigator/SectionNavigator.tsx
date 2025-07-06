"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SectionId } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionNavigatorProps {
  sections: { id: SectionId; label: string }[];
  className?: string;
}

export default function SectionNavigator({ sections, className }: SectionNavigatorProps) {
  const t = useTranslations("SectionNavigator");
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<SectionId | "">("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<SectionId | "">("");
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id as SectionId;
            setActiveSection(sectionId);

            // Show tooltip for 2 seconds when section becomes visible
            setShowTooltip(sectionId);
            setTimeout(() => setShowTooltip(""), 2000);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    // Progress observer for section scroll progress
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id as SectionId;
          const progress = Math.min(1, Math.max(0, entry.intersectionRatio));
          setSectionProgress((prev) => ({
            ...prev,
            [sectionId]: progress,
          }));
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
        progressObserver.observe(element);
      }
    });

    // Show navigator after initial load
    const timer = setTimeout(() => setIsVisible(true), 1000);

    return () => {
      observer.disconnect();
      progressObserver.disconnect();
      clearTimeout(timer);
    };
  }, [sections]);

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed left-1/2 -translate-x-1/2 bottom-6 md:left-auto md:translate-x-0 md:right-4 md:bottom-4 z-50 transition-all duration-300 opacity-70 hover:opacity-100",
          className
        )}
      >
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-full p-1 shadow-md">
          <div className="flex flex-row md:flex-col gap-0.5">
            {sections.map((section) => (
              <Tooltip key={section.id} delayDuration={200} open={showTooltip === section.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-6 h-6 p-0 rounded-full transition-all duration-300 hover:bg-primary/10 group relative overflow-hidden",
                      activeSection === section.id
                        ? "bg-primary text-white hover:bg-primary/90 scale-110 shadow-lg"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                    onClick={() => scrollToSection(section.id)}
                    aria-label={t("scrollTo", { section: section.label })}
                  >
                    {/* Progress indicator */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full transition-all duration-500",
                        activeSection === section.id ? "bg-primary/20" : "bg-primary/5"
                      )}
                      style={{
                        transform: `scale(${0.8 + (sectionProgress[section.id] || 0) * 0.4})`,
                      }}
                    />

                    {/* Main dot */}
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300 relative z-10",
                        activeSection === section.id
                          ? "bg-white scale-125 animate-pulse"
                          : "bg-current scale-100 group-hover:scale-110"
                      )}
                    />

                    {/* Ripple effect for active section */}
                    {activeSection === section.id && (
                      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={isMobile ? "top" : "left"} className="bg-primary text-white border-primary">
                  {section.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

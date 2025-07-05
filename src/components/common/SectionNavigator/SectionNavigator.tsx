"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SectionId } from "@/lib/constants";

interface SectionNavigatorProps {
  sections: { id: SectionId; label: string }[];
  className?: string;
}

export default function SectionNavigator({ sections, className }: SectionNavigatorProps) {
  const t = useTranslations("SectionNavigator");
  const [activeSection, setActiveSection] = useState<SectionId | "">("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Show navigator after initial load
    const timer = setTimeout(() => setIsVisible(true), 1000);

    return () => {
      observer.disconnect();
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
          "fixed right-4 bottom-4 z-50 transition-all duration-300 opacity-70 hover:opacity-100",
          className
        )}
      >
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-full p-1 shadow-md">
          <div className="flex flex-col gap-0.5">
            {sections.map((section) => (
              <Tooltip key={section.id} delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-6 h-6 p-0 rounded-full transition-all duration-300 hover:bg-primary/10 group",
                      activeSection === section.id
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                    onClick={() => scrollToSection(section.id)}
                    aria-label={t("scrollTo", { section: section.label })}
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        activeSection === section.id
                          ? "bg-white scale-125"
                          : "bg-current scale-100 group-hover:scale-110"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">{section.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

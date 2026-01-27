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
          "fixed left-1/2 -translate-x-1/2 bottom-6 md:left-auto md:translate-x-0 md:right-6 md:bottom-6 z-50 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          className
        )}
      >
        <div className="bg-white/95 backdrop-blur-md border border-secondary-200 rounded-full p-2 shadow-lg">
          <div className="flex flex-row md:flex-col gap-1">
            {sections.map((section) => (
              <Tooltip key={section.id} delayDuration={200} open={showTooltip === section.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-7 h-7 p-0 rounded-full transition-all duration-300 relative",
                      activeSection === section.id
                        ? "bg-primary text-white hover:bg-primary shadow-md scale-110"
                        : "text-secondary-400 hover:text-primary hover:bg-primary/10"
                    )}
                    onClick={() => scrollToSection(section.id)}
                    aria-label={t("scrollTo", { section: section.label })}
                  >
                    {/* Main dot */}
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        activeSection === section.id ? "bg-white" : "bg-current"
                      )}
                    />

                    {/* Active indicator ring */}
                    {activeSection === section.id && (
                      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side={isMobile ? "top" : "left"}
                  className="font-medium"
                >
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

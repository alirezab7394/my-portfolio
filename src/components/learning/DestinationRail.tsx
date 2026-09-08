"use client";

import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { HeadlineProgress, StudyDestination } from "@/types/learning";

interface DestinationRailProps {
  destinations: StudyDestination[];
  activeId: string;
  progress: Record<string, HeadlineProgress>;
  onSelect: (id: string) => void;
}

export function DestinationRail({ destinations, activeId, progress, onSelect }: DestinationRailProps) {
  return (
    <nav aria-label="Destinations" className="h-full">
      <ScrollArea className="h-full">
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pe-2">
          {destinations.map((dest) => {
            const total = dest.seedHeadlines.length;
            const reviewed = dest.seedHeadlines.filter((h) => progress[h.id]?.status === "reviewed").length;
            const active = dest.id === activeId;
            return (
              <li key={dest.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => onSelect(dest.id)}
                  className={cn(
                    "flex w-full cursor-pointer flex-col rounded-lg border px-3 py-2.5 text-start transition-colors duration-200 lg:min-w-0",
                    active ? "border-primary bg-primary/8" : "hover:bg-muted/50"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{dest.title}</span>
                    {reviewed > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-[11px] tabular-nums text-muted-foreground">
                        <Check className="size-3" aria-hidden />
                        {reviewed}/{total}
                      </span>
                    ) : (
                      <span className="text-[11px] tabular-nums text-muted-foreground">{total}</span>
                    )}
                  </span>
                  <span className="mt-0.5 hidden text-xs text-muted-foreground lg:line-clamp-2">{dest.subtitle}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </nav>
  );
}

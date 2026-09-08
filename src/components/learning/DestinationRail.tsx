"use client";

import type { LucideIcon } from "lucide-react";
import {
  Binary,
  Bot,
  Braces,
  Check,
  Component,
  Database,
  Globe,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Server,
  Share2,
  Sparkles,
} from "lucide-react";
import { HeadlineList } from "@/components/learning/HeadlineList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { destinationProgressCounts, headlinesForDestination } from "@/lib/learning/destinations";
import { cn } from "@/lib/utils";
import type { HeadlineProgress, StudyDestination, StudyHeadline } from "@/types/learning";

const ICONS: Record<string, LucideIcon> = {
  "js-ts": Braces,
  browser: Globe,
  react: Component,
  "node-api": Server,
  data: Database,
  systems: Share2,
  llm: Sparkles,
  "rag-dest": Search,
  agents: Bot,
  dsa: Binary,
  interview: MessagesSquare,
};

interface DestinationRailProps {
  destinations: StudyDestination[];
  activeId: string;
  progress: Record<string, HeadlineProgress>;
  expanded: boolean;
  headlineMap: Record<string, StudyHeadline[]>;
  activeHeadlineId: string | null;
  readyIds: Set<string>;
  headlinesLoading: boolean;
  generatingId: string | null;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onSelectHeadline: (destinationId: string, headline: StudyHeadline) => void;
  onRefresh: () => void;
  onAddHeadline: (destinationId: string, headline: { title: string; why: string; depth: StudyHeadline["depth"] }) => void;
}

export function DestinationRail({
  destinations,
  activeId,
  progress,
  expanded,
  headlineMap,
  activeHeadlineId,
  readyIds,
  headlinesLoading,
  generatingId,
  onToggle,
  onSelect,
  onSelectHeadline,
  onRefresh,
  onAddHeadline,
}: DestinationRailProps) {
  return (
    <TooltipProvider delayDuration={250}>
      <nav aria-label="Destinations" className="flex h-full min-h-0 min-w-0 flex-col">
        <ul className="flex min-w-0 gap-1 overflow-x-auto overscroll-x-contain pb-0.5 [-webkit-overflow-scrolling:touch] xl:hidden">
          {destinations.map((dest) => (
            <li key={dest.id} className="shrink-0">
              <DestinationChip
                dest={dest}
                progress={progress}
                headlineMap={headlineMap}
                active={dest.id === activeId}
                onSelect={onSelect}
              />
            </li>
          ))}
        </ul>

        <div className={cn("mb-2 hidden items-center xl:flex", expanded ? "justify-between gap-2 px-1" : "justify-center")}>
          {expanded ? (
            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Destinations
            </p>
          ) : null}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8 shrink-0 cursor-pointer"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse destinations" : "Expand destinations"}
          >
            {expanded ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
          </Button>
        </div>

        {expanded ? (
          <Accordion
            type="single"
            value={activeId}
            onValueChange={(value) => {
              if (value) onSelect(value);
            }}
            className="hidden min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden xl:block"
          >
            {destinations.map((dest) => {
              const { total, reviewed } = destinationProgressCounts(dest, headlineMap, progress);
              const pct = total ? Math.round((reviewed / total) * 100) : 0;
              const active = dest.id === activeId;
              const Icon = ICONS[dest.id] ?? Braces;
              const headlines = headlinesForDestination(dest, headlineMap);
              return (
                <AccordionItem key={dest.id} value={dest.id} className="border-b border-border/80 last:border-b-0">
                  <AccordionTrigger
                    className={cn(
                      "cursor-pointer items-center gap-2 py-2 hover:no-underline",
                      active ? "text-foreground" : "text-foreground/80"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md",
                        active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 text-start">
                      <span className="flex items-center gap-1">
                        <span className="truncate text-sm font-medium">{dest.title}</span>
                        {reviewed === total && total > 0 ? (
                          <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
                        ) : (
                          <span className="ms-auto shrink-0 text-[10px] tabular-nums text-muted-foreground">
                            {reviewed}/{total}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block h-0.5 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-primary transition-[width] duration-200"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <HeadlineList
                      destination={dest}
                      headlines={headlines}
                      activeId={active ? activeHeadlineId : null}
                      progress={progress}
                      readyIds={readyIds}
                      loading={active && headlinesLoading}
                      generatingId={active ? generatingId : null}
                      embedded
                      onSelect={(headline) => onSelectHeadline(dest.id, headline)}
                      onRefresh={onRefresh}
                      onAddHeadline={(draft) => onAddHeadline(dest.id, draft)}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <ul className="hidden min-h-0 min-w-0 gap-1 overflow-x-auto xl:flex xl:flex-1 xl:flex-col xl:items-center xl:overflow-x-hidden xl:overflow-y-auto">
            {destinations.map((dest) => {
              const { total, reviewed } = destinationProgressCounts(dest, headlineMap, progress);
              const active = dest.id === activeId;
              const Icon = ICONS[dest.id] ?? Braces;
              return (
                <li key={dest.id} className="shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onSelect(dest.id)}
                        aria-label={`${dest.title}, ${reviewed} of ${total} reviewed`}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-200",
                          active ? "bg-primary/10 text-foreground" : "text-foreground/80 hover:bg-muted/70"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-md",
                            active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="size-4" aria-hidden />
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-56">
                      <p className="font-medium">{dest.title}</p>
                      <p className="text-primary-foreground/80">
                        {reviewed}/{total} reviewed
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </TooltipProvider>
  );
}

function DestinationChip({
  dest,
  progress,
  headlineMap,
  active,
  onSelect,
}: {
  dest: StudyDestination;
  progress: Record<string, HeadlineProgress>;
  headlineMap: Record<string, StudyHeadline[]>;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const { total, reviewed } = destinationProgressCounts(dest, headlineMap, progress);
  const Icon = ICONS[dest.id] ?? Braces;
  return (
    <button
      type="button"
      onClick={() => onSelect(dest.id)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex max-w-[11rem] cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors duration-200",
        active ? "bg-primary/10 text-foreground" : "text-foreground/80 hover:bg-muted/70"
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md",
          active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-3.5" aria-hidden />
      </span>
      <span className="min-w-0 text-start">
        <span className="block truncate text-xs font-medium">{dest.title}</span>
        <span className="block text-[10px] tabular-nums text-muted-foreground">
          {reviewed}/{total}
        </span>
      </span>
    </button>
  );
}

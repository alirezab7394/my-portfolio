"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { HeadlineProgress, StudyDestination, StudyHeadline } from "@/types/learning";

interface HeadlineListProps {
  destination: StudyDestination;
  headlines: StudyHeadline[];
  activeId: string | null;
  progress: Record<string, HeadlineProgress>;
  readyIds: Set<string>;
  loading: boolean;
  generatingId: string | null;
  onSelect: (headline: StudyHeadline) => void;
  onRefresh: () => void;
}

export function HeadlineList({
  destination,
  headlines,
  activeId,
  progress,
  readyIds,
  loading,
  generatingId,
  onSelect,
  onRefresh,
}: HeadlineListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">{destination.title}</h2>
          <p className="text-xs text-muted-foreground">{destination.interviewSignal}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="cursor-pointer shrink-0"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Regenerate headlines"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
        </Button>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <ol className="space-y-1.5 pe-2">
          {headlines.map((headline, index) => {
            const active = headline.id === activeId;
            const status = progress[headline.id]?.status;
            const generating = generatingId === headline.id;
            return (
              <li key={headline.id}>
                <button
                  type="button"
                  onClick={() => onSelect(headline)}
                  className={cn(
                    "w-full cursor-pointer rounded-lg border px-3 py-2.5 text-start transition-colors duration-200",
                    active ? "border-primary bg-primary/8" : "hover:bg-muted/50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">{index + 1}</span>
                    <span className="text-sm font-medium leading-snug">{headline.title}</span>
                  </span>
                  <span className="mt-1 block ps-7 text-xs leading-5 text-muted-foreground">{headline.why}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-1.5 ps-7">
                    <Badge variant="outline" className="font-normal capitalize">
                      {headline.depth}
                    </Badge>
                    {readyIds.has(headline.id) ? (
                      <Badge variant="secondary" className="font-normal">
                        Cached
                      </Badge>
                    ) : null}
                    {status === "reviewed" ? (
                      <Badge className="font-normal">Reviewed</Badge>
                    ) : generating ? (
                      <Badge variant="secondary" className="gap-1 font-normal">
                        <Loader2 className="size-3 animate-spin" />
                        Writing
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-normal">
                        Click to generate
                      </Badge>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 space-y-1.5 border-t pt-3 pe-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Start here</p>
          {destination.resources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer truncate text-xs text-primary underline-offset-4 hover:underline"
            >
              {resource.title}
            </a>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

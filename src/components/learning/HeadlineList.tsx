"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  embedded?: boolean;
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
  embedded = false,
}: HeadlineListProps) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-x-hidden">
      <div className={cn("flex min-w-0 items-start justify-between gap-2", embedded ? "mb-1" : "mb-2")}>
        <div className="min-w-0">
          {embedded ? (
            <p className="line-clamp-2 break-words text-xs text-muted-foreground">{destination.interviewSignal}</p>
          ) : (
            <>
              <h2 className="truncate text-sm font-semibold">{destination.title}</h2>
              <p className="line-clamp-2 break-words text-xs text-muted-foreground">{destination.interviewSignal}</p>
            </>
          )}
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 shrink-0 cursor-pointer"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Regenerate headlines"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
        </Button>
      </div>
      <ol className={cn("min-h-0 min-w-0 space-y-0.5 overflow-x-hidden pe-1", embedded ? "max-h-80 overflow-y-auto" : "flex-1 overflow-y-auto")}>
        {headlines.map((headline, index) => {
          const active = headline.id === activeId;
          const status = progress[headline.id]?.status;
          const generating = generatingId === headline.id;
          const cached = readyIds.has(headline.id);
          return (
            <li key={headline.id} className="min-w-0">
              <button
                type="button"
                onClick={() => onSelect(headline)}
                className={cn(
                  "w-full min-w-0 cursor-pointer rounded-md px-2 py-2 text-start transition-colors duration-200",
                  active ? "bg-primary/10" : "hover:bg-muted/70"
                )}
              >
                <span className="flex min-w-0 items-start gap-2">
                  <span className="w-5 shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm font-medium leading-snug">{headline.title}</span>
                    <span className="mt-0.5 line-clamp-2 break-words text-xs leading-5 text-muted-foreground">
                      {headline.why}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="capitalize">{headline.depth}</span>
                      <span aria-hidden>·</span>
                      {status === "reviewed" ? (
                        <span className="text-primary">Reviewed</span>
                      ) : generating ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="size-3 animate-spin" aria-hidden />
                          Writing
                        </span>
                      ) : cached ? (
                        <span>Ready</span>
                      ) : (
                        <span>Generate</span>
                      )}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 min-w-0 space-y-1 border-t pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Start here</p>
        {destination.resources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block min-w-0 cursor-pointer truncate text-xs text-primary underline-offset-4 transition-colors duration-200 hover:underline"
          >
            {resource.title}
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown, Loader2, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { HeadlineDepth, HeadlineProgress, StudyDestination, StudyHeadline } from "@/types/learning";

interface HeadlineDraft {
  title: string;
  why: string;
  depth: HeadlineDepth;
}

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
  onAddHeadline: (draft: HeadlineDraft) => void;
  embedded?: boolean;
  compact?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
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
  onAddHeadline,
  embedded = false,
  compact = false,
  open: openProp,
  onOpenChange,
  defaultOpen = true,
}: HeadlineListProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [depth, setDepth] = useState<HeadlineDepth>("interview");
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const active = headlines.find((headline) => headline.id === activeId) ?? null;

  function submitHeadline(event: FormEvent) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    onAddHeadline({
      title: nextTitle,
      why: why.trim() || "Custom topic added to this destination.",
      depth,
    });
    setTitle("");
    setWhy("");
    setDepth("interview");
    setAdding(false);
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="flex h-full min-h-0 min-w-0 flex-col overflow-x-hidden"
    >
      {!compact && !embedded ? (
        <div className="mb-1 min-w-0 px-1">
          <h2 className="truncate text-sm font-semibold">{destination.title}</h2>
          <p className="line-clamp-2 break-words text-xs text-muted-foreground">{destination.interviewSignal}</p>
        </div>
      ) : null}

      <div className={cn("flex min-w-0 items-center gap-1", compact || embedded ? "mb-1" : "mb-2")}>
        <CollapsibleTrigger
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-start transition-colors duration-200 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={open ? "Collapse headlines" : "Expand headlines"}
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {open ? "Headlines" : active?.title ?? "Headlines"}
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {open
                ? `${headlines.length} topics`
                : active
                  ? `${headlines.length} topics · tap to switch`
                  : `${headlines.length} topics · tap to choose`}
            </span>
          </span>
        </CollapsibleTrigger>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 shrink-0 cursor-pointer"
          onClick={() => {
            setAdding((current) => !current);
            setOpen(true);
          }}
          aria-expanded={adding}
          aria-label="Add headline"
        >
          <Plus className="size-4" />
        </Button>
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

      <CollapsibleContent className="min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "min-h-0 min-w-0 overflow-x-hidden overscroll-contain [-webkit-overflow-scrolling:touch]",
            compact
              ? "max-h-[min(40dvh,18rem)] overflow-y-auto"
              : embedded
                ? "max-h-80 overflow-y-auto"
                : "h-full overflow-y-auto"
          )}
        >
          {embedded ? (
            <p className="mb-2 px-2 text-xs leading-5 text-muted-foreground">{destination.subtitle}</p>
          ) : null}
          {adding ? (
            <form onSubmit={submitHeadline} className="mb-3 space-y-2 rounded-md border bg-background px-2 py-2">
              <div className="space-y-1">
                <Label htmlFor={`headline-title-${destination.id}`} className="text-xs">
                  New headline
                </Label>
                <Input
                  id={`headline-title-${destination.id}`}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Topic title"
                  maxLength={240}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`headline-why-${destination.id}`} className="text-xs">
                  Why it matters
                </Label>
                <Input
                  id={`headline-why-${destination.id}`}
                  value={why}
                  onChange={(event) => setWhy(event.target.value)}
                  placeholder="One sentence"
                  maxLength={500}
                />
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {(["core", "interview", "lab"] as const).map((value) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={depth === value ? "default" : "outline"}
                    className="h-7 cursor-pointer capitalize"
                    onClick={() => setDepth(value)}
                  >
                    {value}
                  </Button>
                ))}
                <Button type="submit" size="sm" className="ms-auto h-7 cursor-pointer" disabled={!title.trim()}>
                  Add
                </Button>
              </div>
            </form>
          ) : null}
          <ol className="min-w-0 space-y-0.5 pe-1">
            {headlines.map((headline, index) => {
              const isActive = headline.id === activeId;
              const status = progress[headline.id]?.status;
              const generating = generatingId === headline.id;
              const cached = readyIds.has(headline.id);
              return (
                <li key={headline.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(headline);
                      if (compact || embedded) setOpen(false);
                    }}
                    className={cn(
                      "w-full min-w-0 cursor-pointer rounded-md px-2 py-2 text-start transition-colors duration-200",
                      isActive ? "bg-primary/10" : "hover:bg-muted/70"
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
          {compact ? null : (
            <div className="mt-3 min-w-0 space-y-1 border-t px-2 pt-3">
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
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

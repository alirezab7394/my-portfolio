"use client";

import { Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecallDeck } from "@/components/learning/RecallDeck";
import { extractRecall, markdownWithoutRecall } from "@/lib/learning/recall";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MarkdownContent } from "@/components/learning/MarkdownContent";
import { SourceList } from "@/components/learning/LessonReader";
import { Skeleton } from "@/components/ui/skeleton";
import type { RagSource } from "@/types/learning";

interface ExplainPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selection: string;
  markdown: string | null;
  sources: RagSource[];
  loading: boolean;
  error: string | null;
  ease: number;
  onSimplify: () => void;
  onBookmark: () => void;
}

export function ExplainPanel({
  open,
  onOpenChange,
  selection,
  markdown,
  sources,
  loading,
  error,
  ease,
  onSimplify,
  onBookmark,
}: ExplainPanelProps) {
  const recall = markdown ? extractRecall(markdown) : null;
  const body = markdown ? markdownWithoutRecall(markdown) : "";
  const easeLabel = ease >= 3 ? "Shortest version" : ease === 2 ? "Simpler version" : "Clear version";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden sm:max-w-lg">
        <SheetHeader className="shrink-0">
          <SheetTitle>Explain more</SheetTitle>
          <SheetDescription>
            {easeLabel}. Easier words, the missing detail, and a line you can say if you blank.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 [-webkit-overflow-scrolling:touch]">
          <blockquote className="mb-4 border-s-2 border-primary/40 bg-primary/5 px-3 py-2 text-sm">{selection}</blockquote>
          {loading && !markdown ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : null}
          {error ? (
            <p role="alert" className="mb-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {markdown ? (
            <>
              {loading ? <p className="mb-3 text-sm text-muted-foreground">Rewriting in simpler words…</p> : null}
              {recall ? (
                <div className="mb-4">
                  <RecallDeck pack={recall} />
                </div>
              ) : null}
              <MarkdownContent markdown={body || markdown} />
              {sources.length > 0 ? <div className="mt-4"><SourceList sources={sources} /></div> : null}
            </>
          ) : null}
        </div>
        <SheetFooter className="shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            disabled={!markdown || loading || ease >= 3}
            onClick={onSimplify}
          >
            <Sparkles className="size-4" />
            {ease >= 3 ? "This is the simplest" : "Make it simpler"}
          </Button>
          <Button type="button" className="cursor-pointer" disabled={!markdown} onClick={onBookmark}>
            <Bookmark className="size-4" />
            Save passage + explanation
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

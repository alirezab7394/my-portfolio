"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  onBookmark,
}: ExplainPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Explain more</SheetTitle>
          <SheetDescription>RAG-grounded expansion of the highlighted passage.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1 px-4">
          <blockquote className="mb-4 border-s-2 border-primary/40 bg-primary/5 px-3 py-2 text-sm">{selection}</blockquote>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : markdown ? (
            <>
              <MarkdownContent markdown={markdown} />
              {sources.length > 0 ? <div className="mt-4"><SourceList sources={sources} /></div> : null}
            </>
          ) : null}
        </ScrollArea>
        <SheetFooter>
          <Button type="button" className="cursor-pointer" disabled={!markdown} onClick={onBookmark}>
            <Bookmark className="size-4" />
            Save passage + explanation
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

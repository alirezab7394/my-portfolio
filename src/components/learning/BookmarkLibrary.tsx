"use client";

import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownContent } from "@/components/learning/MarkdownContent";
import type { StudyBookmark, StudyDestination } from "@/types/learning";

interface BookmarkLibraryProps {
  bookmarks: StudyBookmark[];
  destinations: StudyDestination[];
  onOpen: (bookmark: StudyBookmark) => void;
  onRemove: (id: string) => void;
}

export function BookmarkLibrary({ bookmarks, destinations, onOpen, onRemove }: BookmarkLibraryProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
        <Bookmark className="mb-3 size-8 text-primary" aria-hidden />
        <h2 className="text-base font-semibold">Nothing saved yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Save a whole lesson, or highlight a passage and bookmark just that slice. Saved text is fed back into RAG for later lessons.
        </p>
      </div>
    );
  }

  const titleFor = (id: string) => destinations.find((d) => d.id === id)?.title ?? id;

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <ul className="mx-auto max-w-3xl space-y-3 pb-10">
        {bookmarks.map((b) => (
          <li key={b.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <button type="button" className="cursor-pointer text-start" onClick={() => onOpen(b)}>
                <p className="text-xs text-muted-foreground">
                  {titleFor(b.destinationId)} · {b.kind === "lesson" ? "Full lesson" : "Passage"}
                </p>
                <h3 className="mt-0.5 text-sm font-semibold">{b.title}</h3>
              </button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="cursor-pointer"
                aria-label="Remove bookmark"
                onClick={() => onRemove(b.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground/90">{b.excerpt}</p>
            {b.explanation ? (
              <div className="mt-3 border-t pt-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Saved explanation</p>
                <MarkdownContent markdown={b.explanation} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

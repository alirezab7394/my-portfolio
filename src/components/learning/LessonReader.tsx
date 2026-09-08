"use client";

import { useEffect, useRef } from "react";
import { Bookmark, BookmarkCheck, Highlighter, PenLine, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/learning/MarkdownContent";
import { QuestionCard } from "@/components/learning/QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { GeneratedLesson, RagSource } from "@/types/learning";

export interface LessonSelection {
  text: string;
  x: number;
  y: number;
  surrounding: string;
}

interface LessonReaderProps {
  lesson: GeneratedLesson | null;
  loading: boolean;
  error: string | null;
  bookmarked: boolean;
  onBookmarkLesson: () => void;
  onRegenerate: () => void;
  onSelection: (payload: LessonSelection | null) => void;
}

export function LessonReader({
  lesson,
  loading,
  error,
  bookmarked,
  onBookmarkLesson,
  onRegenerate,
  onSelection,
}: LessonReaderProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = bodyRef.current;
    if (!root || !lesson) return;

    let timer: number | null = null;
    const article = root;

    function report() {
      const selection = window.getSelection();
      const text = selection?.toString().trim() ?? "";
      if (!selection || text.length < 4 || selection.rangeCount === 0) {
        onSelection(null);
        return;
      }
      const range = selection.getRangeAt(0);
      if (!article.contains(range.commonAncestorContainer)) {
        onSelection(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      onSelection({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top,
        surrounding: article.innerText.slice(0, 1500),
      });
    }

    function schedule() {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(report, 280);
    }

    document.addEventListener("selectionchange", schedule);
    root.addEventListener("pointerup", schedule);
    root.addEventListener("touchend", schedule);
    return () => {
      if (timer) window.clearTimeout(timer);
      document.removeEventListener("selectionchange", schedule);
      root.removeEventListener("pointerup", schedule);
      root.removeEventListener("touchend", schedule);
    };
  }, [lesson, onSelection]);

  if (loading) {
    return (
      <div className="space-y-3 p-1">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span role="alert">{error}</span>
          <Button type="button" size="sm" variant="outline" className="cursor-pointer" onClick={onRegenerate}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
        <Highlighter className="mb-3 size-8 text-primary" aria-hidden />
        <h2 className="text-base font-semibold">Pick a headline</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Content is generated for that topic only — grounded in your RAG notes, then saved to the database.
        </p>
      </div>
    );
  }

  return (
    <article className="min-w-0 max-w-full space-y-6">
      <header className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-xl font-semibold tracking-tight">{lesson.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Highlight any sentence to explain more or bookmark it. Sources are listed at the bottom.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" className="cursor-pointer" onClick={onRegenerate}>
            <RefreshCw className="size-3.5" />
            Regenerate
          </Button>
          <Button type="button" size="sm" className="cursor-pointer" variant={bookmarked ? "secondary" : "default"} onClick={onBookmarkLesson}>
            {bookmarked ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
            {bookmarked ? "Saved" : "Save lesson"}
          </Button>
        </div>
      </header>

      <div ref={bodyRef} data-lesson-body className="select-text">
        <MarkdownContent markdown={lesson.markdown} />
      </div>

      {lesson.questions.length > 0 ? (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <PenLine className="size-4 text-primary" aria-hidden />
            Check yourself
          </h3>
          {lesson.questions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </section>
      ) : null}

      {lesson.sources.length > 0 ? <SourceList sources={lesson.sources} /> : null}
    </article>
  );
}

export function SourceList({ sources }: { sources: RagSource[] }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">RAG sources</h3>
      <ul className="flex min-w-0 flex-wrap gap-1.5">
        {sources.map((s) => (
          <li key={s.id} className="min-w-0 max-w-full">
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <Badge variant="secondary" className="max-w-full truncate font-normal">
                  {s.title}
                </Badge>
              </a>
            ) : (
              <Badge variant="outline" className="max-w-full truncate font-normal">
                {s.title}
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

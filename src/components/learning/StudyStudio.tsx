"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Database,
  LogOut,
  PenLine,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { BookmarkLibrary } from "@/components/learning/BookmarkLibrary";
import { DestinationRail } from "@/components/learning/DestinationRail";
import { ExplainPanel } from "@/components/learning/ExplainPanel";
import { HeadlineList } from "@/components/learning/HeadlineList";
import { LessonReader } from "@/components/learning/LessonReader";
import { PenPad } from "@/components/learning/PenPad";
import { SelectionToolbar } from "@/components/learning/SelectionToolbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STUDY_DESTINATIONS, getDestination } from "@/lib/learning/destinations";
import {
  lessonKey,
  loadBookmarks,
  loadHeadlineMap,
  loadLastDestination,
  loadLessonMap,
  loadProgress,
  loadRailExpanded,
  makeId,
  removeBookmark,
  saveHeadlines,
  saveLastDestination,
  saveLesson,
  saveRailExpanded,
  setHeadlineStatus,
  upsertBookmark,
} from "@/lib/learning/studio-store";
import { cn } from "@/lib/utils";
import type {
  ExplainResult,
  GeneratedLesson,
  HeadlineProgress,
  RagSource,
  StudyBookmark,
  StudyHeadline,
} from "@/types/learning";

type View = "study" | "saved";

interface StudyStudioProps {
  onLogout: () => void;
}

export function StudyStudio({ onLogout }: StudyStudioProps) {
  const [view, setView] = useState<View>("study");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [destinationId, setDestinationId] = useState(STUDY_DESTINATIONS[0].id);
  const [headlineMap, setHeadlineMap] = useState<Record<string, StudyHeadline[]>>({});
  const [lessonMap, setLessonMap] = useState<Record<string, GeneratedLesson>>({});
  const [progress, setProgress] = useState<Record<string, HeadlineProgress>>({});
  const [bookmarks, setBookmarks] = useState<StudyBookmark[]>([]);
  const [activeHeadline, setActiveHeadline] = useState<StudyHeadline | null>(null);
  const [headlinesLoading, setHeadlinesLoading] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selection, setSelection] = useState<{ text: string; x: number; y: number; surrounding: string } | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);
  const [explain, setExplain] = useState<ExplainResult | null>(null);
  const [explainSelection, setExplainSelection] = useState("");
  const [inkOpen, setInkOpen] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [railExpanded, setRailExpanded] = useState(true);
  const outlineAttempted = useRef(new Set<string>());

  const destination = getDestination(destinationId) ?? STUDY_DESTINATIONS[0];
  const headlines = headlineMap[destinationId] ?? destination.seedHeadlines;
  const lesson = activeHeadline ? lessonMap[lessonKey(destinationId, activeHeadline.id)] ?? null : null;

  useEffect(() => {
    setHeadlineMap(loadHeadlineMap());
    setLessonMap(loadLessonMap());
    setProgress(loadProgress());
    setBookmarks(loadBookmarks());
    const last = loadLastDestination();
    if (last && getDestination(last)) setDestinationId(last);
    setRailExpanded(loadRailExpanded());
    void fetch("/api/learning/studio")
      .then((res) => res.json())
      .then((data) => setConfigured(Boolean(data.configured)))
      .catch(() => setConfigured(false));
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[role="toolbar"]')) return;
      setSelection(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const readyIds = useMemo(() => {
    const ids = new Set<string>();
    for (const key of Object.keys(lessonMap)) {
      const sep = key.indexOf("::");
      if (sep >= 0) ids.add(key.slice(sep + 2));
    }
    return ids;
  }, [lessonMap]);

  const reviewedCount = STUDY_DESTINATIONS.reduce((sum, dest) => {
    return sum + dest.seedHeadlines.filter((h) => progress[h.id]?.status === "reviewed").length;
  }, 0);
  const seedTotal = STUDY_DESTINATIONS.reduce((sum, dest) => sum + dest.seedHeadlines.length, 0);

  const selectDestination = useCallback((id: string) => {
    setDestinationId(id);
    saveLastDestination(id);
    setActiveHeadline(null);
    setLessonError(null);
    setSelection(null);
  }, []);

  async function refreshHeadlines(silent = false) {
    if (configured === false) {
      if (!silent) toast.error("Set OPENAI_API_KEY to generate an outline. Seed headlines still work.");
      return;
    }
    setHeadlinesLoading(true);
    try {
      const data = await studioPost<{ headlines: StudyHeadline[] }>({
        action: "headlines",
        destinationId,
      });
      setHeadlineMap((prev) => {
        const next = { ...prev, [destinationId]: data.headlines };
        saveHeadlines(destinationId, data.headlines);
        return next;
      });
      if (!silent) toast.success("Outline updated from RAG.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate headlines");
    } finally {
      setHeadlinesLoading(false);
    }
  }

  useEffect(() => {
    if (configured !== true) return;
    if (headlineMap[destinationId]?.length) return;
    if (outlineAttempted.current.has(destinationId)) return;
    outlineAttempted.current.add(destinationId);
    void refreshHeadlines(true);
  }, [configured, destinationId, headlineMap]);

  async function openHeadline(headline: StudyHeadline, force = false, destId = destinationId) {
    if (destId !== destinationId) {
      setDestinationId(destId);
      saveLastDestination(destId);
    }
    setActiveHeadline(headline);
    setSelection(null);
    setLessonError(null);
    const key = lessonKey(destId, headline.id);
    if (!force && lessonMap[key]) {
      const current = loadProgress()[headline.id]?.status;
      if (current !== "reviewed") markStatus(headline.id, "ready", destId);
      return;
    }
    if (configured === false) {
      setLessonError("LLM is not configured. Add OPENAI_API_KEY to generate lessons.");
      return;
    }
    setLessonLoading(true);
    setGeneratingId(headline.id);
    try {
      const related = Object.values(lessonMap)
        .filter((item) => item.destinationId === destId && item.headlineId !== headline.id)
        .slice(0, 6)
        .map((item) => `Already studied: ${item.title}`)
        .join("\n");
      const bookmarkNotes = bookmarks
        .filter((b) => b.destinationId === destId)
        .slice(0, 8)
        .map((b) => `- ${b.title}: ${b.excerpt}`)
        .join("\n");
      const notes = [bookmarkNotes, related].filter(Boolean).join("\n") || undefined;
      const data = await studioPost<{ lesson: GeneratedLesson }>({
        action: "lesson",
        destinationId: destId,
        headlineId: headline.id,
        headlineTitle: headline.title,
        headlineWhy: headline.why,
        extraNotes: notes,
      });
      setLessonMap((prev) => {
        const next = { ...prev, [key]: data.lesson };
        saveLesson(data.lesson);
        return next;
      });
      markStatus(headline.id, "ready", destId);
    } catch (error) {
      setLessonError(error instanceof Error ? error.message : "Could not generate lesson");
    } finally {
      setLessonLoading(false);
      setGeneratingId(null);
    }
  }

  function markStatus(headlineId: string, status: HeadlineProgress["status"], destId = destinationId) {
    const record: HeadlineProgress = {
      headlineId,
      destinationId: destId,
      status,
      updatedAt: new Date().toISOString(),
    };
    setHeadlineStatus(record);
    setProgress((prev) => ({ ...prev, [headlineId]: record }));
  }

  function lessonBookmarked() {
    if (!activeHeadline || !lesson) return false;
    return bookmarks.some(
      (b) => b.kind === "lesson" && b.destinationId === destinationId && b.headlineId === activeHeadline.id
    );
  }

  async function ingestBookmarkChunk(bookmark: StudyBookmark) {
    try {
      await studioPost({
        action: "ingest",
        chunks: [
          {
            id: `bookmark-${bookmark.id}`,
            title: bookmark.title,
            text: `${bookmark.title}. ${bookmark.excerpt}${bookmark.explanation ? ` Explanation: ${bookmark.explanation}` : ""}`,
            kind: "bookmark",
          },
        ],
      });
    } catch {
      // local bookmark still saved
    }
  }

  function saveWholeLesson() {
    if (!activeHeadline || !lesson) return;
    const existing = bookmarks.find(
      (b) => b.kind === "lesson" && b.destinationId === destinationId && b.headlineId === activeHeadline.id
    );
    if (existing) {
      setBookmarks(removeBookmark(existing.id));
      toast.success("Lesson removed from saved.");
      return;
    }
    const bookmark: StudyBookmark = {
      id: makeId("bm"),
      kind: "lesson",
      destinationId,
      headlineId: activeHeadline.id,
      title: lesson.title,
      excerpt: lesson.markdown.replace(/[#>*_`]/g, "").replace(/\s+/g, " ").trim().slice(0, 320),
      createdAt: new Date().toISOString(),
    };
    setBookmarks(upsertBookmark(bookmark));
    void ingestBookmarkChunk(bookmark);
    toast.success("Lesson saved. It will feed later RAG retrieval.");
  }

  function savePassage(excerpt: string, explanation?: string) {
    if (!activeHeadline) return;
    const bookmark: StudyBookmark = {
      id: makeId("bm"),
      kind: "passage",
      destinationId,
      headlineId: activeHeadline.id,
      title: activeHeadline.title,
      excerpt: excerpt.slice(0, 800),
      explanation,
      createdAt: new Date().toISOString(),
    };
    setBookmarks(upsertBookmark(bookmark));
    void ingestBookmarkChunk(bookmark);
    toast.success("Passage saved.");
  }

  async function runExplain() {
    if (!selection || !activeHeadline) return;
    const text = selection.text;
    setExplainSelection(text);
    setExplain(null);
    setExplainError(null);
    setExplainOpen(true);
    setExplainLoading(true);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
    try {
      const data = await studioPost<ExplainResult>({
        action: "explain",
        destinationId,
        headlineId: activeHeadline.id,
        headlineTitle: activeHeadline.title,
        selection: text,
        surrounding: selection.surrounding,
      });
      setExplain({ markdown: data.markdown, sources: data.sources as RagSource[] });
    } catch (error) {
      setExplainError(error instanceof Error ? error.message : "Explain failed");
    } finally {
      setExplainLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/learning/auth", { method: "DELETE" });
    onLogout();
  }

  function openBookmark(bookmark: StudyBookmark) {
    setView("study");
    selectDestination(bookmark.destinationId);
    const dest = getDestination(bookmark.destinationId);
    const map = loadHeadlineMap();
    const list = map[bookmark.destinationId] ?? dest?.seedHeadlines ?? [];
    const headline = list.find((h) => h.id === bookmark.headlineId) ?? dest?.seedHeadlines.find((h) => h.id === bookmark.headlineId);
    if (headline) void openHeadline(headline);
  }

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background">
      <a
        href="#study-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to lesson
      </a>
      <header className="sticky top-0 z-20 min-w-0 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
          <div className="min-w-0 flex-1 basis-40">
            <h1 className="truncate text-lg font-semibold tracking-tight text-primary">Study Studio</h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              Destinations · headline · lesson · highlight · ink
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            <Badge variant={configured ? "default" : "secondary"} className="hidden gap-1 sm:inline-flex">
              {configured ? <Sparkles className="size-3" /> : <Database className="size-3" />}
              {configured ? "RAG + LLM" : configured === false ? "Offline outline" : "Checking"}
            </Badge>
            <span className="hidden text-xs tabular-nums text-muted-foreground md:inline">
              {reviewedCount}/{seedTotal} reviewed
            </span>
            <Tabs value={view} onValueChange={(v) => setView(v as View)}>
              <TabsList>
                <TabsTrigger value="study" className="cursor-pointer">
                  Study
                </TabsTrigger>
                <TabsTrigger value="saved" className="cursor-pointer gap-1">
                  <Bookmark className="size-3.5" />
                  Saved
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              type="button"
              size="sm"
              variant={inkOpen ? "default" : "outline"}
              className="cursor-pointer"
              disabled={!activeHeadline}
              onClick={() => setInkOpen((v) => !v)}
            >
              <PenLine className="size-4" />
              <span className="hidden sm:inline">Notes</span>
            </Button>
            <Button type="button" size="sm" variant="ghost" className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="size-4" />
              Lock
            </Button>
          </div>
        </div>
      </header>

      {view === "saved" ? (
        <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 overflow-x-hidden px-4 py-5">
          <BookmarkLibrary
            bookmarks={bookmarks}
            destinations={STUDY_DESTINATIONS}
            onOpen={openBookmark}
            onRemove={(id) => setBookmarks(removeBookmark(id))}
          />
        </main>
      ) : (
        <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-1 flex-col overflow-x-hidden lg:h-[calc(100vh-3.5rem)] lg:flex-row lg:overflow-hidden">
          <aside
            className={cn(
              "min-w-0 border-b p-2 lg:h-full lg:shrink-0 lg:overflow-hidden lg:border-b-0 lg:border-e lg:transition-[width] lg:duration-200",
              railExpanded ? "p-3 lg:w-80" : "lg:w-16 lg:p-2"
            )}
          >
            <DestinationRail
              destinations={STUDY_DESTINATIONS}
              activeId={destinationId}
              progress={progress}
              expanded={railExpanded}
              headlineMap={headlineMap}
              activeHeadlineId={activeHeadline?.id ?? null}
              readyIds={readyIds}
              headlinesLoading={headlinesLoading}
              generatingId={generatingId}
              onToggle={() => {
                setRailExpanded((current) => {
                  const next = !current;
                  saveRailExpanded(next);
                  return next;
                });
              }}
              onSelect={selectDestination}
              onSelectHeadline={(destId, headline) => void openHeadline(headline, false, destId)}
              onRefresh={() => void refreshHeadlines()}
            />
          </aside>
          {!railExpanded ? (
          <aside className="min-w-0 border-b p-3 lg:h-full lg:w-72 lg:shrink-0 lg:overflow-hidden lg:border-b-0 lg:border-e">
            <HeadlineList
              destination={destination}
              headlines={headlines}
              activeId={activeHeadline?.id ?? null}
              progress={progress}
              readyIds={readyIds}
              loading={headlinesLoading}
              generatingId={generatingId}
              onSelect={(h) => void openHeadline(h)}
              onRefresh={() => void refreshHeadlines()}
            />
          </aside>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
            <main id="study-main" className={cn("min-h-0 min-w-0 flex-1", inkOpen && isLg ? "lg:max-h-[58vh]" : "")}>
              <ScrollArea className="h-full min-w-0">
                <div className="min-w-0 max-w-full space-y-4 overflow-x-hidden p-4 lg:p-6">
                  {configured === false ? (
                    <Alert>
                      <AlertDescription>
                        Headlines below are the syllabus you still have to cover. Lesson generation needs{" "}
                        <code className="rounded bg-muted px-1">OPENAI_API_KEY</code>.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  <LessonReader
                    lesson={lesson}
                    loading={lessonLoading}
                    error={lessonError}
                    bookmarked={lessonBookmarked()}
                    onBookmarkLesson={saveWholeLesson}
                    onRegenerate={() => activeHeadline && void openHeadline(activeHeadline, true)}
                    onSelection={setSelection}
                  />
                  {lesson && activeHeadline ? (
                    <div className="flex flex-wrap gap-2 border-t pt-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => markStatus(activeHeadline.id, "reviewed")}
                      >
                        <CheckCircle2 className="size-4" />
                        Mark reviewed
                      </Button>
                      {!isLg ? (
                        <Button type="button" size="sm" variant="outline" className="cursor-pointer" onClick={() => setInkOpen(true)}>
                          <PenLine className="size-4" />
                          Take notes
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </ScrollArea>
            </main>
            {inkOpen && isLg && activeHeadline ? (
              <div className="h-[38vh] min-h-[240px] border-t">
                <PenPad
                  destinationId={destinationId}
                  headlineId={activeHeadline.id}
                  headlineTitle={activeHeadline.title}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {selection ? (
        <SelectionToolbar
          x={selection.x}
          y={selection.y}
          onExplain={() => void runExplain()}
          onBookmark={() => {
            savePassage(selection.text);
            setSelection(null);
            window.getSelection()?.removeAllRanges();
          }}
        />
      ) : null}

      <ExplainPanel
        open={explainOpen}
        onOpenChange={setExplainOpen}
        selection={explainSelection}
        markdown={explain?.markdown ?? null}
        sources={explain?.sources ?? []}
        loading={explainLoading}
        error={explainError}
        onBookmark={() => {
          savePassage(explainSelection, explain?.markdown);
          setExplainOpen(false);
        }}
      />

      <Sheet open={inkOpen && !isLg} onOpenChange={setInkOpen}>
        <SheetContent side="bottom" className="h-[85vh] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Notes</SheetTitle>
          </SheetHeader>
          {activeHeadline ? (
            <PenPad
              destinationId={destinationId}
              headlineId={activeHeadline.id}
              headlineTitle={activeHeadline.title}
              className="h-full pt-8"
            />
          ) : (
            <p className="p-6 text-sm text-muted-foreground">Open a headline first.</p>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

async function studioPost<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/learning/studio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { success?: boolean; error?: string };
  if (!res.ok || data.success === false) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

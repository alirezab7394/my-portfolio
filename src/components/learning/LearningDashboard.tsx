"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Database,
  Flame,
  HardDrive,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { getFocusWeek } from "@/lib/learning/curriculum";
import { computeStats } from "@/lib/learning/stats";
import {
  loadLocalProgress,
  loadLocalSessions,
  mergeProgress,
  mergeSessions,
  saveLocalProgress,
  saveLocalSessions,
  upsertLocalProgress,
} from "@/lib/learning/local-store";
import { PathBrowser } from "@/components/learning/PathBrowser";
import { DailyLogForm } from "@/components/learning/DailyLogForm";
import { StudyCoach } from "@/components/learning/StudyCoach";
import { TodayFocus } from "@/components/learning/TodayFocus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StudySessionRecord, TaskProgressRecord, TaskStatus } from "@/types/learning";

const TAB_IDS = ["today", "path", "coach", "log"] as const;
type TabId = (typeof TAB_IDS)[number];

function isTabId(value: string): value is TabId {
  return TAB_IDS.includes(value as TabId);
}

interface LearningDashboardProps {
  onLogout: () => void;
}

export function LearningDashboard({ onLogout }: LearningDashboardProps) {
  const [tab, setTab] = useState<TabId>("today");
  const [progress, setProgress] = useState<TaskProgressRecord[]>([]);
  const [sessions, setSessions] = useState<StudySessionRecord[]>([]);
  const [dbEnabled, setDbEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (isTabId(hash)) setTab(hash);
  }, []);

  function changeTab(next: string) {
    if (!isTabId(next)) return;
    setTab(next);
    window.history.replaceState(null, "", `#${next}`);
  }

  const loadRemote = useCallback(async () => {
    setLoading(true);
    try {
      const localProgress = loadLocalProgress();
      const localSessions = loadLocalSessions();

      const [progressRes, sessionsRes] = await Promise.all([
        fetch("/api/learning/progress"),
        fetch("/api/learning/sessions"),
      ]);

      let serverProgress: TaskProgressRecord[] = [];
      let serverSessions: StudySessionRecord[] = [];
      let db = false;

      if (progressRes.ok) {
        const data = await progressRes.json();
        serverProgress = data.progress ?? [];
        db = Boolean(data.db);
      }
      if (sessionsRes.ok) {
        const data = await sessionsRes.json();
        serverSessions = data.sessions ?? [];
        db = db || Boolean(data.db);
      }

      const mergedProgress = mergeProgress(serverProgress, localProgress);
      const mergedSessions = mergeSessions(serverSessions, localSessions);

      setProgress(mergedProgress);
      setSessions(mergedSessions);
      setDbEnabled(db);
      saveLocalProgress(mergedProgress);
      saveLocalSessions(mergedSessions);

      if (db) {
        for (const p of localProgress) {
          const server = serverProgress.find((s) => s.taskId === p.taskId);
          const localNewer =
            !server ||
            (p.updatedAt &&
              server.updatedAt &&
              Date.parse(p.updatedAt) > Date.parse(server.updatedAt));
          if (localNewer) {
            void fetch("/api/learning/progress", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                taskId: p.taskId,
                status: p.status,
                note: p.note,
              }),
            });
          }
        }
      }
    } catch {
      setProgress(loadLocalProgress());
      setSessions(loadLocalSessions());
      setDbEnabled(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRemote();
  }, [loadRemote]);

  const progressMap = useMemo(() => {
    const map = new Map<string, TaskProgressRecord>();
    for (const p of progress) map.set(p.taskId, p);
    return map;
  }, [progress]);

  const stats = useMemo(() => computeStats(progress, sessions), [progress, sessions]);
  const overallPct = stats.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;
  const totalHours = Math.round((stats.totalMinutes / 60) * 10) / 10;
  const doneIds = useMemo(
    () => new Set(progress.filter((p) => p.status === "DONE").map((p) => p.taskId)),
    [progress]
  );
  const focus = getFocusWeek(doneIds);
  const allComplete = stats.totalTasks > 0 && stats.completedTasks === stats.totalTasks;

  async function handleToggleTask(taskId: string, status: TaskStatus) {
    const local = upsertLocalProgress(taskId, status);
    setProgress((prev) => {
      const without = prev.filter((p) => p.taskId !== taskId);
      return [...without, local];
    });

    try {
      const res = await fetch("/api/learning/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.db && data.progress) {
          setDbEnabled(true);
          setProgress((prev) => {
            const without = prev.filter((p) => p.taskId !== taskId);
            const next = [...without, data.progress];
            saveLocalProgress(next);
            return next;
          });
        }
      }
    } catch {
      // local already saved
    }
  }

  function handleSessionLogged(session: StudySessionRecord) {
    setSessions((prev) => {
      const next = [session, ...prev.filter((s) => s.id !== session.id)];
      saveLocalSessions(next);
      return next;
    });
  }

  async function handleLogout() {
    await fetch("/api/learning/auth", { method: "DELETE" });
    onLogout();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-primary">Senior Path</h1>
            <p className="text-xs text-muted-foreground">12 weeks · 5h/day · frontend + backend + AI</p>
          </div>
          <div className="flex items-center gap-2">
            {dbEnabled ? (
              <Badge className="gap-1">
                <Database className="size-3" />
                Synced
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <HardDrive className="size-3" />
                Local
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="size-4" />
              Lock
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-5">
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <StatCard
            icon={<CheckCircle2 className="size-4 text-primary" />}
            label="Tasks"
            value={`${stats.completedTasks}/${stats.totalTasks}`}
            hint={`${overallPct}% of path`}
          />
          <StatCard
            icon={<Clock className="size-4 text-primary" />}
            label="Today"
            value={`${Math.round((stats.minutesToday / 60) * 10) / 10}h`}
            hint="of 5h target"
          />
          <StatCard
            icon={<Clock className="size-4 text-primary" />}
            label="Last 7 days"
            value={`${Math.round((stats.minutesThisWeek / 60) * 10) / 10}h`}
            hint={`of 30h · ${totalHours}h total`}
          />
          <StatCard
            icon={<Flame className="size-4 text-primary" />}
            label="Streak"
            value={`${stats.streakDays}d`}
            hint="study days in a row"
          />
        </section>

        <Tabs value={tab} onValueChange={changeTab} className="gap-4">
          <TabsList className="grid h-auto w-full grid-cols-4">
            <TabsTrigger value="today" className="cursor-pointer gap-1.5 py-2">
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Today</span>
            </TabsTrigger>
            <TabsTrigger value="path" className="cursor-pointer gap-1.5 py-2">
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Path</span>
            </TabsTrigger>
            <TabsTrigger value="coach" className="cursor-pointer gap-1.5 py-2">
              <Sparkles className="size-4" />
              <span className="hidden sm:inline">Coach</span>
            </TabsTrigger>
            <TabsTrigger value="log" className="cursor-pointer gap-1.5 py-2">
              <NotebookPen className="size-4" />
              <span className="hidden sm:inline">Log</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            {loading || !focus ? (
              <DashboardSkeleton />
            ) : (
              <TodayFocus
                phase={focus.phase}
                week={focus.week}
                progressMap={progressMap}
                onToggleTask={handleToggleTask}
                onOpenPath={() => changeTab("path")}
                onOpenCoach={() => changeTab("coach")}
                allComplete={allComplete}
                stats={stats}
              />
            )}
          </TabsContent>

          <TabsContent value="path">
            {loading ? (
              <DashboardSkeleton />
            ) : (
              <PathBrowser
                progressMap={progressMap}
                onToggleTask={handleToggleTask}
                focusWeekId={focus?.week.id}
                focusPhaseId={focus?.phase.id}
              />
            )}
          </TabsContent>

          <TabsContent value="coach">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Study coach</CardTitle>
                <CardDescription>
                  RAG over your path, resources, and project stories. Chat stays on this device.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudyCoach progress={progress} sessions={sessions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Log a session</CardTitle>
                <CardDescription>Track hours so the streak and coach stay accurate.</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyLogForm onLogged={handleSessionLogged} useLocalOnly={!dbEnabled} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No sessions yet. Log your first 5-hour block after today&apos;s study.
                  </p>
                ) : (
                  <ul className="divide-y text-sm">
                    {sessions.slice(0, 12).map((s) => (
                      <li
                        key={s.id ?? `${s.date}-${s.createdAt}`}
                        className="flex flex-wrap justify-between gap-2 py-2.5"
                      >
                        <span>
                          <span className="font-medium">{s.date}</span>
                          {s.topic ? <span className="text-muted-foreground"> · {s.topic}</span> : null}
                        </span>
                        <span className="tabular-nums text-muted-foreground">
                          {Math.round((s.minutes / 60) * 10) / 10}h
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />
        <p className="pb-8 text-center text-xs text-muted-foreground">
          Edit the path in <code className="rounded bg-muted px-1">src/lib/learning/curriculum.ts</code>.
          Task IDs stay stable when you reorder weeks.
        </p>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center gap-2.5 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
        <div className="hidden rounded-md bg-primary/10 p-2 sm:block">{icon}</div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground sm:text-xs">{label}</p>
          <p className="truncate text-base font-semibold tabular-nums sm:text-xl">{value}</p>
          <p className="text-[11px] text-muted-foreground sm:text-xs">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Flame, Clock, CheckCircle2, Database, HardDrive, LogOut } from "lucide-react";
import { LEARNING_CURRICULUM } from "@/lib/learning/curriculum";
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
import { PhaseAccordion } from "@/components/learning/PhaseAccordion";
import { DailyLogForm } from "@/components/learning/DailyLogForm";
import { StudyCoach } from "@/components/learning/StudyCoach";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { StudySessionRecord, TaskProgressRecord, TaskStatus } from "@/types/learning";

interface LearningDashboardProps {
  onLogout: () => void;
}

export function LearningDashboard({ onLogout }: LearningDashboardProps) {
  const [progress, setProgress] = useState<TaskProgressRecord[]>([]);
  const [sessions, setSessions] = useState<StudySessionRecord[]>([]);
  const [dbEnabled, setDbEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

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

      // Push local-only progress up if DB is live
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
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-primary">Senior Path Tracker</h1>
            <p className="text-xs text-muted-foreground">24 weeks · ~5h/day · interview-ready</p>
          </div>
          <div className="flex items-center gap-2">
            {dbEnabled ? (
              <Badge className="gap-1" variant="default">
                <Database className="size-3" /> Synced
              </Badge>
            ) : (
              <Badge className="gap-1" variant="secondary">
                <HardDrive className="size-3" /> Local only
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Lock
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <section className="grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={<CheckCircle2 className="size-4 text-primary" />}
            label="Tasks done"
            value={`${stats.completedTasks}/${stats.totalTasks}`}
            hint={`${overallPct}% complete`}
          />
          <StatCard
            icon={<Clock className="size-4 text-primary" />}
            label="Hours logged"
            value={`${totalHours}h`}
            hint={`${sessions.length} sessions`}
          />
          <StatCard
            icon={<Flame className="size-4 text-primary" />}
            label="Streak"
            value={`${stats.streakDays} day${stats.streakDays === 1 ? "" : "s"}`}
            hint="Study days in a row"
          />
        </section>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={overallPct} className="h-3" />
            <div className="grid gap-2 sm:grid-cols-2">
              {LEARNING_CURRICULUM.map((phase) => {
                const p = stats.phaseProgress[phase.id];
                const pct = p?.total ? Math.round((p.done / p.total) * 100) : 0;
                return (
                  <div key={phase.id} className="rounded-lg border p-3">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium">Phase {phase.number}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <StudyCoach progress={progress} sessions={sessions} />

        <DailyLogForm onLogged={handleSessionLogged} useLocalOnly={!dbEnabled} />

        {sessions.length > 0 ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y text-sm">
                {sessions.slice(0, 8).map((s) => (
                  <li key={s.id ?? `${s.date}-${s.createdAt}`} className="flex flex-wrap justify-between gap-2 py-2">
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
            </CardContent>
          </Card>
        ) : null}

        <section>
          <h2 className="mb-3 text-lg font-semibold">Curriculum</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading progress…</p>
          ) : (
            <PhaseAccordion
              phases={LEARNING_CURRICULUM}
              progressMap={progressMap}
              onToggleTask={handleToggleTask}
            />
          )}
        </section>

        <p className="pb-8 text-center text-xs text-muted-foreground">
          Path is editable in <code className="rounded bg-muted px-1">src/lib/learning/curriculum.ts</code>.
          Progress keys use stable task IDs — add or reorder weeks anytime.
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
    <Card>
      <CardContent className="flex items-start gap-3 pt-6">
        <div className="rounded-md bg-primary/10 p-2">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

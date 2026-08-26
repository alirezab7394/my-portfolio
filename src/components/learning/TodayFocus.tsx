"use client";

import { ArrowRight, BookOpen, MessageSquareQuote, Target } from "lucide-react";
import { HoursChart } from "@/components/learning/HoursChart";
import { ResourceLink, TaskItem } from "@/components/learning/TaskItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DAILY_MINUTE_TARGET, WEEKLY_MINUTE_TARGET } from "@/lib/learning/stats";
import { getDailyDrill, getDailyEnglishCue, getStarForWeek } from "@/lib/learning/interview-bank";
import type { LearningPhase, LearningWeek, LearningStats, TaskProgressRecord, TaskStatus } from "@/types/learning";

interface TodayFocusProps {
  phase: LearningPhase;
  week: LearningWeek;
  progressMap: Map<string, TaskProgressRecord>;
  onToggleTask: (taskId: string, status: TaskStatus) => void;
  onOpenPath: () => void;
  onOpenCoach: () => void;
  allComplete: boolean;
  stats: LearningStats;
}

export function TodayFocus({
  phase,
  week,
  progressMap,
  onToggleTask,
  onOpenPath,
  onOpenCoach,
  allComplete,
  stats,
}: TodayFocusProps) {
  const remaining = week.tasks.filter((task) => progressMap.get(task.id)?.status !== "DONE");
  const done = week.tasks.length - remaining.length;
  const pct = week.tasks.length ? Math.round((done / week.tasks.length) * 100) : 0;
  const nextTask = remaining[0];
  const drill = getDailyDrill(week.weekNumber);
  const english = getDailyEnglishCue();
  const star = getStarForWeek(week.weekNumber);
  const todayPct = Math.min(100, Math.round((stats.minutesToday / DAILY_MINUTE_TARGET) * 100));
  const weekPct = Math.min(100, Math.round((stats.minutesThisWeek / WEEKLY_MINUTE_TARGET) * 100));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Week {week.weekNumber} of 12</Badge>
            <Badge variant="secondary">Phase {phase.number}</Badge>
          </div>
          <CardTitle className="text-xl">{allComplete ? "Path complete" : week.title}</CardTitle>
          <CardDescription>
            {allComplete
              ? "Every task is checked. Keep a light review cadence and apply."
              : week.focus}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>This week&apos;s tasks</span>
              <span className="tabular-nums">
                {done}/{week.tasks.length} · {pct}%
              </span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Today vs 5h</span>
                <span className="tabular-nums">
                  {Math.round((stats.minutesToday / 60) * 10) / 10}h
                </span>
              </div>
              <Progress value={todayPct} className="h-2" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Last 7 days vs 30h</span>
                <span className="tabular-nums">
                  {Math.round((stats.minutesThisWeek / 60) * 10) / 10}h
                </span>
              </div>
              <Progress value={weekPct} className="h-2" />
            </div>
          </div>
          <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Daily split: </span>
            {week.dailySplit}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="cursor-pointer" onClick={onOpenCoach}>
              Ask coach for today
              <ArrowRight className="size-4" />
            </Button>
            <Button type="button" variant="outline" className="cursor-pointer" onClick={onOpenPath}>
              <BookOpen className="size-4" />
              Full path
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Hours this week</CardTitle>
          <CardDescription>Target is about 5h × 6 days. Empty days show as zero.</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.hoursLast7Days.every((d) => d.hours === 0) ? (
            <p className="text-sm text-muted-foreground">
              No hours logged yet. After you study, use the Log tab so this chart can coach your pace.
            </p>
          ) : (
            <HoursChart data={stats.hoursLast7Days} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="size-4 text-primary" />
            Today&apos;s interview drill
          </CardTitle>
          <CardDescription>{drill.area.toUpperCase()} · rotates daily</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium leading-relaxed">{drill.question}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {drill.talkingPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <a
            href={drill.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer text-sm text-primary underline-offset-4 hover:underline"
          >
            {drill.resourceTitle}
          </a>
          <p className="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
            <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <span className="font-medium text-foreground">English cue: </span>
              {english}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            STAR to keep warm: <span className="font-medium text-foreground">{star.title}</span> — {star.interviewCue}
          </p>
        </CardContent>
      </Card>

      {nextTask && !allComplete ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Do this next</CardTitle>
            <CardDescription>One task at a time. Check it off when it is done.</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskItem task={nextTask} progress={progressMap.get(nextTask.id)} onToggle={onToggleTask} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Week checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {week.tasks.map((task) => (
            <TaskItem key={task.id} task={task} progress={progressMap.get(task.id)} onToggle={onToggleTask} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Watch / read</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {week.resources.map((resource) => (
            <ResourceLink key={resource.url + resource.title} resource={resource} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
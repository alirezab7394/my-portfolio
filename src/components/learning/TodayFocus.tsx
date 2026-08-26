"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { ResourceLink, TaskItem } from "@/components/learning/TaskItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LearningPhase, LearningWeek, TaskProgressRecord, TaskStatus } from "@/types/learning";

interface TodayFocusProps {
  phase: LearningPhase;
  week: LearningWeek;
  progressMap: Map<string, TaskProgressRecord>;
  onToggleTask: (taskId: string, status: TaskStatus) => void;
  onOpenPath: () => void;
  onOpenCoach: () => void;
  allComplete: boolean;
}

export function TodayFocus({
  phase,
  week,
  progressMap,
  onToggleTask,
  onOpenPath,
  onOpenCoach,
  allComplete,
}: TodayFocusProps) {
  const remaining = week.tasks.filter((task) => progressMap.get(task.id)?.status !== "DONE");
  const done = week.tasks.length - remaining.length;
  const pct = week.tasks.length ? Math.round((done / week.tasks.length) * 100) : 0;
  const nextTask = remaining[0];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Phase {phase.number}</Badge>
            <Badge variant="secondary">Week {week.weekNumber}</Badge>
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
              <span>This week</span>
              <span className="tabular-nums">
                {done}/{week.tasks.length} · {pct}%
              </span>
            </div>
            <Progress value={pct} className="h-2" />
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
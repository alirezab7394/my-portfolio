"use client";

import { useMemo, useState } from "react";
import { LEARNING_CURRICULUM } from "@/lib/learning/curriculum";
import { TaskItem, ResourceLink } from "@/components/learning/TaskItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TaskProgressRecord, TaskStatus } from "@/types/learning";

interface PathBrowserProps {
  progressMap: Map<string, TaskProgressRecord>;
  onToggleTask: (taskId: string, status: TaskStatus) => void;
  focusWeekId?: string;
  focusPhaseId?: string;
}

export function PathBrowser({
  progressMap,
  onToggleTask,
  focusWeekId,
  focusPhaseId,
}: PathBrowserProps) {
  const defaultPhase = focusPhaseId || LEARNING_CURRICULUM[0]?.id;
  const [phaseId, setPhaseId] = useState(defaultPhase);
  const [weekId, setWeekId] = useState(focusWeekId || LEARNING_CURRICULUM[0]?.weeks[0]?.id);

  const phase = LEARNING_CURRICULUM.find((p) => p.id === phaseId) ?? LEARNING_CURRICULUM[0];
  const selectedWeek = phase.weeks.find((w) => w.id === weekId) ?? phase.weeks[0];

  const phaseStats = useMemo(() => {
    const tasks = phase.weeks.flatMap((w) => w.tasks);
    const done = tasks.filter((t) => progressMap.get(t.id)?.status === "DONE").length;
    return { done, total: tasks.length, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
  }, [phase, progressMap]);

  const weekDone = selectedWeek.tasks.filter((t) => progressMap.get(t.id)?.status === "DONE").length;

  return (
    <Tabs
      value={phaseId}
      onValueChange={(value) => {
        setPhaseId(value);
        const next = LEARNING_CURRICULUM.find((p) => p.id === value);
        const preferred = next?.weeks.find((w) => w.id === focusWeekId) ?? next?.weeks[0];
        if (preferred) setWeekId(preferred.id);
      }}
    >
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
        {LEARNING_CURRICULUM.map((item) => (
          <TabsTrigger key={item.id} value={item.id} className="cursor-pointer px-2 py-2 text-xs sm:text-sm">
            Phase {item.number}
          </TabsTrigger>
        ))}
      </TabsList>

      {LEARNING_CURRICULUM.map((item) => (
        <TabsContent key={item.id} value={item.id} className="mt-4 space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold">{item.title}</h2>
              <span className="text-xs tabular-nums text-muted-foreground">
                {item.id === phase.id ? `${phaseStats.done}/${phaseStats.total}` : null}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <Progress value={item.id === phase.id ? phaseStats.pct : 0} className="mt-3 h-2" />
          </div>

          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {item.weeks.map((week) => {
                const doneCount = week.tasks.filter((t) => progressMap.get(t.id)?.status === "DONE").length;
                const active = week.id === selectedWeek.id;
                return (
                  <Button
                    key={week.id}
                    type="button"
                    variant={active ? "default" : "outline"}
                    size="sm"
                    className="h-auto shrink-0 cursor-pointer flex-col items-start px-3 py-2 text-left"
                    onClick={() => setWeekId(week.id)}
                  >
                    <span className="text-xs font-medium">Week {week.weekNumber}</span>
                    <span className="max-w-[10rem] truncate text-[11px] font-normal opacity-80">
                      {week.title}
                    </span>
                    <span className="text-[10px] tabular-nums opacity-70">
                      {doneCount}/{week.tasks.length}
                    </span>
                  </Button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">
                  Week {selectedWeek.weekNumber}: {selectedWeek.title}
                </CardTitle>
                <Badge variant="secondary">
                  {weekDone}/{selectedWeek.tasks.length} done
                </Badge>
              </div>
              <CardDescription>
                <span className="font-medium text-foreground">Focus:</span> {selectedWeek.focus}
                <br />
                <span className="font-medium text-foreground">Daily split:</span> {selectedWeek.dailySplit}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Topics
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {selectedWeek.topics.map((topic) => (
                    <li key={topic}>
                      <Badge variant="outline" className="font-normal">
                        {topic}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Watch / read
                </p>
                <div className="flex flex-col gap-2">
                  {selectedWeek.resources.map((resource) => (
                    <ResourceLink key={resource.url + resource.title} resource={resource} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tasks
                </p>
                <div className="space-y-2">
                  {selectedWeek.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      progress={progressMap.get(task.id)}
                      onToggle={onToggleTask}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
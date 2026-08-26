"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TaskItem, ResourceLink } from "@/components/learning/TaskItem";
import type { LearningPhase, TaskProgressRecord, TaskStatus } from "@/types/learning";

interface PhaseAccordionProps {
  phases: LearningPhase[];
  progressMap: Map<string, TaskProgressRecord>;
  onToggleTask: (taskId: string, status: TaskStatus) => void;
}

export function PhaseAccordion({ phases, progressMap, onToggleTask }: PhaseAccordionProps) {
  return (
    <Accordion type="multiple" defaultValue={[phases[0]?.id].filter(Boolean)} className="space-y-3">
      {phases.map((phase) => {
        const allTasks = phase.weeks.flatMap((w) => w.tasks);
        const done = allTasks.filter((t) => progressMap.get(t.id)?.status === "DONE").length;
        const pct = allTasks.length ? Math.round((done / allTasks.length) * 100) : 0;

        return (
          <AccordionItem
            key={phase.id}
            value={phase.id}
            className="rounded-xl border bg-card px-4 last:border-b"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex w-full flex-col gap-2 pr-4 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Phase {phase.number}</Badge>
                  <span className="font-semibold">{phase.title}</span>
                  <span className="text-xs text-muted-foreground">
                    Weeks {phase.weekRange[0]}–{phase.weekRange[1]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={pct} className="h-2 flex-1" />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {done}/{allTasks.length} ({pct}%)
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              <p className="text-sm text-muted-foreground">{phase.description}</p>
              {phase.weeks.map((week) => {
                const weekDone = week.tasks.filter((t) => progressMap.get(t.id)?.status === "DONE").length;
                return (
                  <Card key={week.id} className="border-muted shadow-none">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-base">
                          Week {week.weekNumber}: {week.title}
                        </CardTitle>
                        <Badge variant="secondary">
                          {weekDone}/{week.tasks.length} done
                        </Badge>
                      </div>
                      <CardDescription>
                        <strong className="text-foreground">Focus:</strong> {week.focus}
                        <br />
                        <strong className="text-foreground">Daily split:</strong> {week.dailySplit}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Topics
                        </p>
                        <ul className="flex flex-wrap gap-1.5">
                          {week.topics.map((topic) => (
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
                          Resources
                        </p>
                        <div className="flex flex-col gap-2">
                          {week.resources.map((resource) => (
                            <ResourceLink key={resource.url + resource.title} resource={resource} />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Tasks
                        </p>
                        <div className="space-y-2">
                          {week.tasks.map((task) => (
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
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

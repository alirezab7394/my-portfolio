"use client";

import { ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { LearningResource, LearningTask, TaskProgressRecord, TaskStatus } from "@/types/learning";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: LearningTask;
  progress?: TaskProgressRecord;
  onToggle: (taskId: string, status: TaskStatus) => void;
}

export function TaskItem({ task, progress, onToggle }: TaskItemProps) {
  const done = progress?.status === "DONE";

  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
        done ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
      )}
    >
      <Checkbox
        checked={done}
        onCheckedChange={(checked) => onToggle(task.id, checked ? "DONE" : "TODO")}
        className="mt-0.5"
        aria-label={task.title}
      />
      <span className="flex-1 space-y-0.5">
        <span className={cn("block text-sm font-medium", done && "text-muted-foreground line-through")}>
          {task.title}
        </span>
        {task.estimatedMinutes ? (
          <span className="text-xs text-muted-foreground">~{task.estimatedMinutes} min</span>
        ) : null}
      </span>
    </label>
  );
}

const typeLabel: Record<LearningResource["type"], string> = {
  article: "Article",
  video: "Video",
  course: "Course",
  docs: "Docs",
  practice: "Practice",
};

export function ResourceLink({ resource }: { resource: LearningResource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm text-primary transition-colors hover:bg-primary/5"
    >
      <Badge variant="secondary" className="text-[10px] uppercase">
        {typeLabel[resource.type]}
      </Badge>
      <span className="line-clamp-1">{resource.title}</span>
      <ExternalLink className="size-3.5 shrink-0 opacity-60" />
    </a>
  );
}

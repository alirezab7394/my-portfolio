"use client";

import { useState } from "react";
import { Check, CircleHelp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { LessonQuestion } from "@/types/learning";

interface QuestionCardProps {
  question: LessonQuestion;
  index: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);

  const isChoice = question.kind === "choice" && (question.options?.length ?? 0) >= 2;
  const isCorrect = isChoice && selected !== null && normalize(selected) === normalize(question.answer);

  function reset() {
    setSelected(null);
    setDraft("");
    setRevealed(false);
  }

  return (
    <article className="rounded-lg border bg-card p-4">
      <p className="mb-3 flex items-start gap-2 text-sm font-medium">
        <CircleHelp className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <span>
          Check {index + 1}
          <span className="ms-2 font-normal text-muted-foreground">
            {isChoice ? "Choose one" : "Write, then reveal"}
          </span>
        </span>
      </p>
      <p className="mb-3 text-[15px] leading-6">{question.prompt}</p>

      {isChoice ? (
        <ul className="space-y-2">
          {question.options?.map((option) => {
            const active = selected === option;
            const showMark = revealed && (normalize(option) === normalize(question.answer) || active);
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    if (revealed) return;
                    setSelected(option);
                  }}
                  disabled={revealed}
                  className={cn(
                    "flex w-full cursor-pointer items-start rounded-md border px-3 py-2 text-start text-sm transition-colors duration-200",
                    active && !revealed && "border-primary bg-primary/5",
                    revealed && normalize(option) === normalize(question.answer) && "border-primary bg-primary/10",
                    revealed && active && normalize(option) !== normalize(question.answer) && "border-destructive/50 bg-destructive/5",
                    !active && !revealed && "hover:bg-muted/60"
                  )}
                >
                  {option}
                  {showMark && normalize(option) === normalize(question.answer) ? (
                    <Check className="ms-auto size-4 shrink-0 text-primary" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={revealed}
          rows={3}
          placeholder="Your answer in interview English…"
          aria-label="Short answer"
        />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="cursor-pointer"
          disabled={isChoice ? !selected : draft.trim().length < 2}
          onClick={() => setRevealed(true)}
        >
          {isChoice ? "Check" : "Reveal model answer"}
        </Button>
        {revealed ? (
          <Button type="button" size="sm" variant="ghost" className="cursor-pointer" onClick={reset}>
            <RotateCcw className="size-3.5" />
            Try again
          </Button>
        ) : null}
      </div>

      {revealed ? (
        <div className="mt-3 rounded-md bg-muted/60 px-3 py-2 text-sm" role="status">
          {isChoice ? (
            <p className={cn("mb-1 font-medium", isCorrect ? "text-primary" : "text-destructive")}>
              {isCorrect ? "Correct." : "Not quite."} Model answer: {question.answer}
            </p>
          ) : (
            <p className="mb-1">
              <span className="font-medium">Model answer: </span>
              {question.answer}
            </p>
          )}
          {question.explanation ? (
            <p className="text-muted-foreground">{question.explanation}</p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

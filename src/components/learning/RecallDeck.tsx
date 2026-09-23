"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecallLine, RecallPack } from "@/lib/learning/recall";

interface RecallDeckProps {
  pack: RecallPack;
  prominent?: boolean;
}

export function RecallDeck({ pack, prominent = false }: RecallDeckProps) {
  const cards: RecallLine[] = [
    { cue: pack.cue, sentence: pack.firstLine },
    ...pack.lines.filter((line) => line.sentence && line.sentence !== pack.firstLine),
  ].filter((line) => line.sentence);

  if (cards.length === 0) return null;

  return (
    <section className={prominent ? "space-y-3" : "space-y-3 rounded-lg border bg-primary/5 p-4"}>
      <div>
        <h3 className="text-sm font-semibold">If you blank, start here</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Say the cue in your head, then say the line out loud before you reveal it. That is the answer you will still have in an interview.
        </p>
      </div>
      <ul className="space-y-2">
        {cards.map((line, index) => (
          <li key={`${line.cue}-${index}`}>
            <RecallCard line={line} lead={index === 0} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecallCard({ line, lead }: { line: RecallLine; lead: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-md border bg-card px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {lead ? "First sentence" : "Line"}
      </p>
      <p className="mt-1 text-sm font-medium">{line.cue}</p>
      {open ? <p className="mt-2 text-sm leading-6 text-foreground/90">{line.sentence}</p> : null}
      <div className="mt-2 flex gap-2">
        <Button type="button" size="sm" variant={open ? "outline" : "default"} className="cursor-pointer" onClick={() => setOpen((v) => !v)}>
          {open ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {open ? "Hide and try again" : "I said it — show the line"}
        </Button>
      </div>
    </article>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CoachMode, StudySessionRecord, TaskProgressRecord } from "@/types/learning";

const MODES: { id: CoachMode; label: string; hint: string }[] = [
  { id: "daily", label: "Plan", hint: "5-hour schedule from your remaining tasks." },
  { id: "quiz", label: "Quiz", hint: "Short questions. Try before you peek at answers." },
  { id: "interview", label: "Interview", hint: "One hard question. Paste your answer for a score." },
  { id: "resources", label: "Watch", hint: "Articles and videos for this week." },
  { id: "explain", label: "Explain", hint: "First-principles refresh of a rusty concept." },
];

interface StudyCoachProps {
  progress: TaskProgressRecord[];
  sessions: StudySessionRecord[];
}

export function StudyCoach({ progress, sessions }: StudyCoachProps) {
  const [mode, setMode] = useState<CoachMode>("daily");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    void fetch("/api/learning/coach")
      .then((res) => res.json())
      .then((data) => setConfigured(Boolean(data.configured)))
      .catch(() => setConfigured(false));
  }, []);

  async function runCoach() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/learning/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          message: message.trim() || undefined,
          progress,
          sessions: sessions.slice(0, 14),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Coach request failed");
        return;
      }
      setReply(data.content);
    } catch {
      setError("Could not reach the coach.");
    } finally {
      setLoading(false);
    }
  }

  const active = MODES.find((item) => item.id === mode) ?? MODES[0];

  if (!configured) {
    return (
      <Alert>
        <Sparkles />
        <AlertDescription>
          Coach is off until OPENAI_API_KEY, OPENAI_URL, and OPENAI_MODEL are set. Restart the server after
          saving them.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs
        value={mode}
        onValueChange={(value) => {
          setMode(value as CoachMode);
          setReply(null);
          setError(null);
        }}
      >
        <TabsList className="grid h-auto w-full grid-cols-5">
          {MODES.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="cursor-pointer px-1 text-xs sm:text-sm">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p className="text-sm text-muted-foreground">{active.hint}</p>

      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          mode === "interview"
            ? "Optional: paste your answer to the last question…"
            : "Optional: a topic, e.g. event loop or NextTarget RBAC…"
        }
        rows={3}
      />

      <Button type="button" className="cursor-pointer" onClick={() => void runCoach()} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
            Thinking…
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Ask coach
          </>
        )}
      </Button>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {reply ? (
        <ScrollArea className="h-[min(28rem,60vh)] rounded-lg border bg-muted/30 p-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{reply}</div>
        </ScrollArea>
      ) : null}
    </div>
  );
}
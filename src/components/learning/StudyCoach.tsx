"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { CoachMode, StudySessionRecord, TaskProgressRecord } from "@/types/learning";

const MODES: { id: CoachMode; label: string }[] = [
  { id: "daily", label: "Today's plan" },
  { id: "quiz", label: "Quiz" },
  { id: "interview", label: "Interview" },
  { id: "resources", label: "Watch / read" },
  { id: "explain", label: "Explain" },
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

  async function runCoach(nextMode: CoachMode = mode) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/learning/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: nextMode,
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

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" />
          Study coach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!configured ? (
          <p className="text-sm text-muted-foreground">
            LLM is not configured. Add OPENAI_API_KEY, OPENAI_URL, and OPENAI_MODEL, then restart the
            server.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {MODES.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  size="sm"
                  variant={mode === item.id ? "default" : "outline"}
                  onClick={() => setMode(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional: a topic, an interview answer, or 'explain event loop'…"
              rows={3}
            />
            <Button type="button" onClick={() => void runCoach()} disabled={loading}>
              {loading ? "Thinking…" : "Ask coach"}
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {reply ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
                {reply}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Uses your current week, remaining tasks, and recent sessions. Good for rusty
                fundamentals and interview drills.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

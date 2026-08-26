"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RotateCcw, Send, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getCoachSuggestionChips } from "@/lib/learning/suggestions";
import type { CoachChatMessage, CoachMode, CoachSuggestion, RagSource } from "@/lib/learning/coach-types";
import type { StudySessionRecord, TaskProgressRecord } from "@/types/learning";
import { cn } from "@/lib/utils";

const MODES: { id: CoachMode; label: string }[] = [
  { id: "daily", label: "Plan" },
  { id: "quiz", label: "Quiz" },
  { id: "interview", label: "Interview" },
  { id: "resources", label: "Watch" },
  { id: "explain", label: "Explain" },
];

const CHAT_KEY = "learning-coach-chat-v2";

interface StudyCoachProps {
  progress: TaskProgressRecord[];
  sessions: StudySessionRecord[];
}

export function StudyCoach({ progress, sessions }: StudyCoachProps) {
  const [mode, setMode] = useState<CoachMode>("daily");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<CoachChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chips = useMemo(() => getCoachSuggestionChips(progress), [progress]);

  useEffect(() => {
    void fetch("/api/learning/coach")
      .then((res) => res.json())
      .then((data) => setConfigured(Boolean(data.configured)))
      .catch(() => setConfigured(false));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      if (raw) setMessages(JSON.parse(raw) as CoachChatMessage[]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-24)));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(prompt: string, nextMode: CoachMode = mode) {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    const userMsg: CoachChatMessage = { role: "user", content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setMessage("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/learning/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: nextMode,
          message: trimmed,
          progress,
          sessions: sessions.slice(0, 14),
          history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Coach request failed");
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          sources: data.sources as RagSource[] | undefined,
          followUps: data.followUps as CoachSuggestion[] | undefined,
        },
      ]);
    } catch {
      setError("Could not reach the coach.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(message);
  }

  function applySuggestion(item: CoachSuggestion) {
    setMode(item.mode);
    void send(item.prompt, item.mode);
  }

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

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="flex min-h-[32rem] flex-col gap-3">
      <Tabs value={mode} onValueChange={(value) => setMode(value as CoachMode)}>
        <TabsList className="grid h-auto w-full grid-cols-5">
          {MODES.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="cursor-pointer px-1 text-xs sm:text-sm">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[min(28rem,55vh)] rounded-xl border bg-muted/20">
        <div className="space-y-3 p-3 sm:p-4">
          {messages.length === 0 && !loading ? (
            <EmptyCoach chips={chips} onPick={applySuggestion} />
          ) : (
            messages.map((msg, index) => (
              <ChatBubble key={`${msg.role}-${index}`} message={msg} />
            ))
          )}
          {loading ? (
            <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
              Retrieving notes and thinking…
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {lastAssistant?.followUps?.length && !loading ? (
        <div className="flex flex-wrap gap-1.5">
          {lastAssistant.followUps.map((item) => (
            <Button
              key={item.label}
              type="button"
              size="sm"
              variant="secondary"
              className="h-auto cursor-pointer px-2.5 py-1 text-xs"
              onClick={() => applySuggestion(item)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(message);
            }
          }}
          placeholder="Ask anything, or paste an interview answer. Enter to send, Shift+Enter for a new line."
          rows={3}
        />
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              setMessages([]);
              localStorage.removeItem(CHAT_KEY);
            }}
            disabled={loading || messages.length === 0}
          >
            <RotateCcw className="size-4" />
            New chat
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={loading || !message.trim()}>
            {loading ? (
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <Send className="size-4" />
            )}
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

function EmptyCoach({
  chips,
  onPick,
}: {
  chips: CoachSuggestion[];
  onPick: (item: CoachSuggestion) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card px-3 py-3">
        <p className="text-sm font-medium">Coach with RAG</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Answers are grounded in your 12-week path, resources, and project stories. Pick a prompt to start.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {chips.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onPick(item)}
            className="cursor-pointer rounded-lg border bg-card px-3 py-2.5 text-left text-sm transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="block font-medium">{item.label}</span>
            <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: CoachChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[92%] rounded-xl border px-3 py-2 text-sm leading-relaxed sm:max-w-[80%]",
          isUser ? "bg-primary text-primary-foreground" : "bg-card"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        {!isUser && message.sources && message.sources.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.sources.map((source) =>
              source.url ? (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <Badge variant="secondary" className="font-normal">
                    {source.title}
                  </Badge>
                </a>
              ) : (
                <Badge key={source.id} variant="outline" className="font-normal">
                  {source.title}
                </Badge>
              )
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

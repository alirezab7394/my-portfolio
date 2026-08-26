"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDateKey } from "@/lib/learning/stats";
import type { StudySessionRecord } from "@/types/learning";

interface DailyLogFormProps {
  onLogged: (session: StudySessionRecord) => void;
  useLocalOnly: boolean;
}

export function DailyLogForm({ onLogged, useLocalOnly }: DailyLogFormProps) {
  const [date, setDate] = useState(formatDateKey(new Date()));
  const [hours, setHours] = useState("5");
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const minutes = Math.round(parseFloat(hours || "0") * 60);
    if (!minutes || minutes < 1) {
      toast.error("Enter a valid number of hours.");
      setLoading(false);
      return;
    }

    try {
      const payload = { date, minutes, topic: topic || null, note: note || null };

      if (useLocalOnly) {
        const { addLocalSession } = await import("@/lib/learning/local-store");
        const session = addLocalSession(payload);
        onLogged(session);
        toast.success("Logged on this device.");
        setNote("");
        return;
      }

      const res = await fetch("/api/learning/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const { addLocalSession } = await import("@/lib/learning/local-store");
        const session = addLocalSession(payload);
        onLogged(session);
        toast.message("Server unavailable — saved locally.");
        return;
      }

      if (!data.db) {
        const { addLocalSession } = await import("@/lib/learning/local-store");
        addLocalSession(payload);
      }
      onLogged(data.session);
      toast.success(data.db ? "Session saved." : "Saved locally (DB not configured).");
      setNote("");
    } catch {
      const { addLocalSession } = await import("@/lib/learning/local-store");
      const session = addLocalSession({ date, minutes, topic: topic || null, note: note || null });
      onLogged(session);
      toast.message("Offline — saved locally.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="study-date">Date</Label>
        <Input id="study-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="study-hours">Hours</Label>
        <Input
          id="study-hours"
          type="number"
          min={0.25}
          max={16}
          step={0.25}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="study-topic">Topic</Label>
        <Input
          id="study-topic"
          placeholder="e.g. Sliding window, NextTarget RBAC"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="study-note">Notes</Label>
        <Textarea
          id="study-note"
          placeholder="What clicked? What to revisit?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" className="cursor-pointer" disabled={loading}>
          {loading ? "Saving…" : "Log session"}
        </Button>
      </div>
    </form>
  );
}
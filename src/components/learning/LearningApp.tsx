"use client";

import { useCallback, useEffect, useState } from "react";
import { PinGate } from "@/components/learning/PinGate";
import { LearningDashboard } from "@/components/learning/LearningDashboard";

export function LearningApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/learning/auth");
      const data = await res.json();
      setAuthed(Boolean(data.authenticated));
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!authed) {
    return <PinGate onSuccess={() => setAuthed(true)} />;
  }

  return <LearningDashboard onLogout={() => setAuthed(false)} />;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { PinGate } from "@/components/learning/PinGate";
import { LearningDashboard } from "@/components/learning/LearningDashboard";
import { Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="mx-auto size-12 rounded-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <>
        <PinGate onSuccess={() => setAuthed(true)} />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  return (
    <>
      <LearningDashboard onLogout={() => setAuthed(false)} />
      <Toaster richColors position="top-center" />
    </>
  );
}

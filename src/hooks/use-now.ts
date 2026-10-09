"use client";

import { useEffect, useState } from "react";

/** Current time, updated every `interval` ms. null during SSR/hydration to avoid mismatches. */
export function useNow(interval = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, interval);
    return () => window.clearInterval(id);
  }, [interval]);
  return now;
}

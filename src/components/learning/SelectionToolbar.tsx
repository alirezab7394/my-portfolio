"use client";

import { Bookmark, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectionToolbarProps {
  x: number;
  y: number;
  onExplain: () => void;
  onBookmark: () => void;
}

export function SelectionToolbar({ x, y, onExplain, onBookmark }: SelectionToolbarProps) {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarse(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const viewportWidth = typeof window === "undefined" ? 800 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 600 : window.innerHeight;
  const left = Math.min(Math.max(x, 140), viewportWidth - 140);
  const placeBelow = y < 88;
  const top = placeBelow ? Math.min(y + 28, viewportHeight - 72) : Math.max(16, y - 12);

  return (
    <div
      role="toolbar"
      aria-label="Selected text"
      className={cn(
        "z-50 flex gap-1 rounded-md border bg-popover p-1 shadow-lg",
        coarse
          ? "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] justify-center"
          : "fixed -translate-x-1/2"
      )}
      style={coarse ? undefined : { left, top, transform: placeBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)" }}
      onPointerDown={(e) => e.preventDefault()}
    >
      <Button type="button" size="sm" variant="ghost" className="cursor-pointer" onClick={onExplain}>
        <Sparkles className="size-3.5" />
        Explain more
      </Button>
      <Button type="button" size="sm" variant="ghost" className="cursor-pointer" onClick={onBookmark}>
        <Bookmark className="size-3.5" />
        Bookmark
      </Button>
    </div>
  );
}

"use client";

import { Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionToolbarProps {
  x: number;
  y: number;
  onExplain: () => void;
  onBookmark: () => void;
}

export function SelectionToolbar({ x, y, onExplain, onBookmark }: SelectionToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Selected text"
      className="fixed z-40 flex -translate-x-1/2 -translate-y-full gap-1 rounded-md border bg-popover p-1 shadow-md"
      style={{ left: x, top: Math.max(12, y - 8) }}
      onMouseDown={(e) => e.preventDefault()}
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

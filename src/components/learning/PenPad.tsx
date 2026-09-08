"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Highlighter, PenLine, Redo2, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearInkNote, loadInkNote, saveInkNote } from "@/lib/learning/ink-db";
import { cn } from "@/lib/utils";
import type { InkStroke } from "@/types/learning";

const COLORS = ["#1a5f7a", "#2d2d2d", "#b45309", "#be123c"];
const PEN_GUARD_MS = 700;

type Tool = InkStroke["tool"];

interface PenPadProps {
  destinationId: string;
  headlineId: string;
  headlineTitle: string;
  className?: string;
}

export function PenPad({ destinationId, headlineId, headlineTitle, className }: PenPadProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<InkStroke[]>([]);
  const currentRef = useRef<InkStroke | null>(null);
  const penGuardRef = useRef(0);
  const saveTimer = useRef<number | null>(null);

  const [strokes, setStrokes] = useState<InkStroke[]>([]);
  const [undo, setUndo] = useState<InkStroke[][]>([]);
  const [redo, setRedo] = useState<InkStroke[][]>([]);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [ready, setReady] = useState(false);

  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  toolRef.current = tool;
  colorRef.current = color;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = wrap.getBoundingClientRect();
    if (width < 8 || height < 8) return;
    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const live = currentRef.current;
    const all = live ? [...strokesRef.current, live] : strokesRef.current;
    for (const stroke of all) paintStroke(ctx, stroke);
  }, []);

  useEffect(() => {
    strokesRef.current = strokes;
    redraw();
  }, [strokes, redraw]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    void loadInkNote(destinationId, headlineId).then((note) => {
      if (cancelled) return;
      const next = note?.strokes ?? [];
      setStrokes(next);
      strokesRef.current = next;
      setUndo([]);
      setRedo([]);
      setReady(true);
      requestAnimationFrame(redraw);
    });
    return () => {
      cancelled = true;
    };
  }, [destinationId, headlineId, redraw]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver(() => redraw());
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [redraw]);

  const persist = useCallback(
    (next: InkStroke[]) => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        void saveInkNote(destinationId, headlineId, next);
      }, 400);
    },
    [destinationId, headlineId]
  );
  const persistRef = useRef(persist);
  persistRef.current = persist;

  function commit(next: InkStroke[]) {
    setUndo((u) => [...u.slice(-29), strokesRef.current]);
    setRedo([]);
    setStrokes(next);
    strokesRef.current = next;
    persist(next);
  }

  function pointFromEvent(e: PointerEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      p: e.pressure > 0 ? e.pressure : 0.5,
    };
  }

  function allowPointer(e: PointerEvent) {
    if (e.pointerType === "pen") {
      penGuardRef.current = Date.now() + PEN_GUARD_MS;
      return true;
    }
    if (e.pointerType === "mouse") return e.buttons === 1 || e.type === "pointerdown";
    if (e.pointerType === "touch") {
      if (Date.now() < penGuardRef.current) return false;
      if (e.width > 28 || e.height > 28) return false;
      return true;
    }
    return false;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: PointerEvent) => {
      if (!allowPointer(e)) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      const pt = pointFromEvent(e);
      if (!pt) return;
      const t = toolRef.current;
      currentRef.current = {
        tool: t,
        color: colorRef.current,
        width: t === "highlighter" ? 16 : t === "eraser" ? 22 : 2.4,
        points: [pt],
      };
      redraw();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "pen") penGuardRef.current = Date.now() + PEN_GUARD_MS;
      const current = currentRef.current;
      if (!current) return;
      if (!allowPointer(e) && e.pointerType === "touch") return;
      e.preventDefault();
      const pt = pointFromEvent(e);
      if (!pt) return;
      current.points.push(pt);
      redraw();
    };

    const endStroke = (e: PointerEvent) => {
      if (!currentRef.current) return;
      e.preventDefault();
      const finished = currentRef.current;
      currentRef.current = null;
      if (finished.points.length === 0) return;
      const next = [...strokesRef.current, finished];
      setUndo((u) => [...u.slice(-29), strokesRef.current]);
      setRedo([]);
      setStrokes(next);
      strokesRef.current = next;
      persistRef.current(next);
      redraw();
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", endStroke, { passive: false });
    canvas.addEventListener("pointercancel", endStroke, { passive: false });
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", endStroke);
      canvas.removeEventListener("pointercancel", endStroke);
    };
  }, [redraw]);

  return (
    <div className={cn("flex h-full min-h-[280px] flex-col bg-background", className)}>
      <div className="flex flex-wrap items-center gap-1.5 border-b px-2 py-1.5">
        <p className="me-auto truncate text-xs text-muted-foreground">
          Ink · {headlineTitle}
          {!ready ? " · loading" : ""}
        </p>
        <ToolButton active={tool === "pen"} label="Pen" onClick={() => setTool("pen")}>
          <PenLine className="size-4" />
        </ToolButton>
        <ToolButton active={tool === "highlighter"} label="Highlighter" onClick={() => setTool("highlighter")}>
          <Highlighter className="size-4" />
        </ToolButton>
        <ToolButton active={tool === "eraser"} label="Eraser" onClick={() => setTool("eraser")}>
          <Eraser className="size-4" />
        </ToolButton>
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Ink color ${c}`}
            onClick={() => {
              setColor(c);
              setTool("pen");
            }}
            className={cn(
              "size-5 cursor-pointer rounded-full border transition-colors duration-200",
              color === c && tool !== "eraser" ? "ring-2 ring-primary ring-offset-2" : "border-border"
            )}
            style={{ backgroundColor: c }}
          />
        ))}
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        <ToolButton
          label="Undo"
          disabled={undo.length === 0}
          onClick={() => {
            const prev = undo[undo.length - 1];
            if (!prev) return;
            setUndo((u) => u.slice(0, -1));
            setRedo((r) => [...r, strokesRef.current]);
            setStrokes(prev);
            strokesRef.current = prev;
            persist(prev);
          }}
        >
          <Undo2 className="size-4" />
        </ToolButton>
        <ToolButton
          label="Redo"
          disabled={redo.length === 0}
          onClick={() => {
            const next = redo[redo.length - 1];
            if (!next) return;
            setRedo((r) => r.slice(0, -1));
            setUndo((u) => [...u, strokesRef.current]);
            setStrokes(next);
            strokesRef.current = next;
            persist(next);
          }}
        >
          <Redo2 className="size-4" />
        </ToolButton>
        <ToolButton
          label="Clear notes"
          onClick={() => {
            commit([]);
            void clearInkNote(destinationId, headlineId);
          }}
        >
          <Trash2 className="size-4" />
        </ToolButton>
      </div>
      <div
        ref={wrapRef}
        className="relative min-h-0 flex-1 touch-none overscroll-contain bg-[linear-gradient(to_right,rgba(26,95,122,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,95,122,0.06)_1px,transparent_1px)] bg-[size:28px_28px]"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full cursor-crosshair touch-none"
          aria-label="Handwriting notes"
        />
      </div>
      <p className="border-t px-3 py-1 text-[11px] text-muted-foreground">
        Stylus preferred. While the pen is in range, finger/palm input is ignored. Notes save on this device per headline.
      </p>
    </div>
  );
}

function ToolButton({
  children,
  label,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant={active ? "default" : "ghost"}
      className="size-8 cursor-pointer"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function paintStroke(ctx: CanvasRenderingContext2D, stroke: InkStroke) {
  const pts = stroke.points;
  if (pts.length === 0) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = stroke.width;
  } else if (stroke.tool === "highlighter") {
    ctx.globalCompositeOperation = "multiply";
    ctx.strokeStyle = stroke.color;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = stroke.width;
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width * (0.45 + pts[pts.length - 1].p * 1.1);
  }
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  if (pts.length === 1) {
    ctx.lineTo(pts[0].x + 0.01, pts[0].y);
  } else {
    for (let i = 1; i < pts.length - 1; i += 1) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
  }
  ctx.stroke();
  ctx.restore();
}

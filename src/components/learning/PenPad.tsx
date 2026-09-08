"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Highlighter, Keyboard, PenLine, Redo2, StickyNote, Trash2, Type, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { clearInkNote, loadInkNote, saveInkNote } from "@/lib/learning/ink-db";
import { cn } from "@/lib/utils";
import type { InkStroke, InkTextBox } from "@/types/learning";

const COLORS = ["#1a5f7a", "#2d2d2d", "#b45309", "#be123c"];
const PEN_GUARD_MS = 700;

type DrawTool = InkStroke["tool"];
type PadMode = DrawTool | "textbox" | "type";

interface Snapshot {
  strokes: InkStroke[];
  textBoxes: InkTextBox[];
  typedText: string;
}

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
  const boxesRef = useRef<InkTextBox[]>([]);
  const typedRef = useRef("");
  const currentRef = useRef<InkStroke | null>(null);
  const penGuardRef = useRef(0);
  const saveTimer = useRef<number | null>(null);

  const [strokes, setStrokes] = useState<InkStroke[]>([]);
  const [textBoxes, setTextBoxes] = useState<InkTextBox[]>([]);
  const [typedText, setTypedText] = useState("");
  const [undo, setUndo] = useState<Snapshot[]>([]);
  const [redo, setRedo] = useState<Snapshot[]>([]);
  const [mode, setMode] = useState<PadMode>("type");
  const [color, setColor] = useState(COLORS[0]);
  const [ready, setReady] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const typeAreaRef = useRef<HTMLTextAreaElement>(null);

  const modeRef = useRef(mode);
  const colorRef = useRef(color);
  modeRef.current = mode;
  colorRef.current = color;

  const snapshot = useCallback(
    (): Snapshot => ({
      strokes: strokesRef.current,
      textBoxes: boxesRef.current,
      typedText: typedRef.current,
    }),
    []
  );

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

  const persist = useCallback(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void saveInkNote(destinationId, headlineId, {
        strokes: strokesRef.current,
        textBoxes: boxesRef.current,
        typedText: typedRef.current,
      });
    }, 400);
  }, [destinationId, headlineId]);
  const persistRef = useRef(persist);
  persistRef.current = persist;

  function pushUndo() {
    setUndo((u) => [...u.slice(-29), snapshot()]);
    setRedo([]);
  }
  const pushUndoRef = useRef(pushUndo);
  pushUndoRef.current = pushUndo;

  function applySnapshot(next: Snapshot) {
    strokesRef.current = next.strokes;
    boxesRef.current = next.textBoxes;
    typedRef.current = next.typedText;
    setStrokes(next.strokes);
    setTextBoxes(next.textBoxes);
    setTypedText(next.typedText);
    persist();
    requestAnimationFrame(redraw);
  }

  useEffect(() => {
    strokesRef.current = strokes;
    redraw();
  }, [strokes, redraw]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    void loadInkNote(destinationId, headlineId).then((note) => {
      if (cancelled) return;
      const nextStrokes = note?.strokes ?? [];
      const nextBoxes = note?.textBoxes ?? [];
      const nextTyped = note?.typedText ?? "";
      setStrokes(nextStrokes);
      setTextBoxes(nextBoxes);
      setTypedText(nextTyped);
      strokesRef.current = nextStrokes;
      boxesRef.current = nextBoxes;
      typedRef.current = nextTyped;
      setUndo([]);
      setRedo([]);
      setSelectedBoxId(null);
      setReady(true);
      requestAnimationFrame(redraw);
    });
    return () => {
      cancelled = true;
    };
  }, [destinationId, headlineId, redraw]);

  useEffect(() => {
    boxesRef.current = textBoxes;
  }, [textBoxes]);

  useEffect(() => {
    typedRef.current = typedText;
  }, [typedText]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver(() => redraw());
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [redraw, mode]);

  useEffect(() => {
    if (mode === "type") {
      typeAreaRef.current?.focus();
      return;
    }
    requestAnimationFrame(redraw);
  }, [mode, redraw]);

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

  function isDrawMode(value: PadMode): value is DrawTool {
    return value === "pen" || value === "highlighter" || value === "eraser";
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: PointerEvent) => {
      const currentMode = modeRef.current;
      if (currentMode === "type") return;
      if (currentMode === "textbox") {
        if (!allowPointer(e) && e.pointerType !== "mouse") return;
        const pt = pointFromEvent(e);
        if (!pt) return;
        e.preventDefault();
        const box: InkTextBox = {
          id: `box-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          x: Math.max(8, pt.x - 16),
          y: Math.max(8, pt.y - 12),
          width: 220,
          height: 88,
          text: "",
          color: colorRef.current,
        };
        pushUndoRef.current();
        const next = [...boxesRef.current, box];
        boxesRef.current = next;
        setTextBoxes(next);
        setSelectedBoxId(box.id);
        persistRef.current();
        return;
      }
      if (!isDrawMode(currentMode) || !allowPointer(e)) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      const pt = pointFromEvent(e);
      if (!pt) return;
      currentRef.current = {
        tool: currentMode,
        color: colorRef.current,
        width: currentMode === "highlighter" ? 16 : currentMode === "eraser" ? 22 : 2.4,
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
      pushUndoRef.current();
      const next = [...strokesRef.current, finished];
      strokesRef.current = next;
      setStrokes(next);
      persistRef.current();
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
  }, [redraw, mode]);

  function updateBox(id: string, patch: Partial<InkTextBox>, recordUndo = false) {
    if (recordUndo) pushUndo();
    const next = boxesRef.current.map((box) => (box.id === id ? { ...box, ...patch } : box));
    boxesRef.current = next;
    setTextBoxes(next);
    persist();
  }

  function removeBox(id: string) {
    pushUndo();
    const next = boxesRef.current.filter((box) => box.id !== id);
    boxesRef.current = next;
    setTextBoxes(next);
    if (selectedBoxId === id) setSelectedBoxId(null);
    persist();
  }

  const drawing = isDrawMode(mode);

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-background", className)}>
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b px-2 py-1.5">
        <p className="me-auto truncate text-xs text-muted-foreground">
          Notes · {headlineTitle}
          {!ready ? " · loading" : ""}
        </p>
        <ToolButton active={mode === "type"} label="Type notes" onClick={() => setMode("type")}>
          <Keyboard className="size-4" />
        </ToolButton>
        <ToolButton active={mode === "textbox"} label="Add text box" onClick={() => setMode("textbox")}>
          <Type className="size-4" />
        </ToolButton>
        <ToolButton active={mode === "pen"} label="Pen" onClick={() => setMode("pen")}>
          <PenLine className="size-4" />
        </ToolButton>
        <ToolButton active={mode === "highlighter"} label="Highlighter" onClick={() => setMode("highlighter")}>
          <Highlighter className="size-4" />
        </ToolButton>
        <ToolButton active={mode === "eraser"} label="Eraser" onClick={() => setMode("eraser")}>
          <Eraser className="size-4" />
        </ToolButton>
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Note color ${c}`}
            onClick={() => setColor(c)}
            className={cn(
              "size-5 cursor-pointer rounded-full border transition-colors duration-200",
              color === c && mode !== "eraser" ? "ring-2 ring-primary ring-offset-2" : "border-border"
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
            setRedo((r) => [...r, snapshot()]);
            applySnapshot(prev);
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
            setUndo((u) => [...u, snapshot()]);
            applySnapshot(next);
          }}
        >
          <Redo2 className="size-4" />
        </ToolButton>
        <ToolButton
          label="Clear notes"
          onClick={() => {
            pushUndo();
            applySnapshot({ strokes: [], textBoxes: [], typedText: "" });
            void clearInkNote(destinationId, headlineId);
            setSelectedBoxId(null);
          }}
        >
          <Trash2 className="size-4" />
        </ToolButton>
      </div>

      <div className={cn("min-h-0 border-b", mode === "type" ? "flex-1" : "h-28 shrink-0")}>
        <Textarea
          ref={typeAreaRef}
          autoFocus={mode === "type"}
          value={typedText}
          onChange={(e) => {
            typedRef.current = e.target.value;
            setTypedText(e.target.value);
            persist();
          }}
          placeholder="Type here whenever you just want to write."
          aria-label="Typed notes"
          className="h-full min-h-0 resize-none rounded-none border-0 bg-transparent p-3 text-[15px] leading-7 shadow-none [field-sizing:fixed] focus-visible:ring-0"
        />
      </div>

      <div
        ref={wrapRef}
        className={cn(
          "relative min-h-0 overscroll-contain bg-[linear-gradient(to_right,rgba(26,95,122,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,95,122,0.06)_1px,transparent_1px)] bg-[size:28px_28px]",
          mode === "type" ? "h-28 shrink-0" : "flex-1",
          drawing ? "touch-none" : ""
        )}
      >
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 size-full",
            drawing ? "cursor-crosshair touch-none" : mode === "textbox" ? "cursor-cell" : "cursor-text"
          )}
          aria-label="Handwriting notes"
        />
        {textBoxes.map((box) => (
          <TextBox
            key={box.id}
            box={box}
            selected={selectedBoxId === box.id}
            onSelect={() => setSelectedBoxId(box.id)}
            onChange={(text) => updateBox(box.id, { text })}
            onMoveStart={() => pushUndo()}
            onMove={(x, y) => updateBox(box.id, { x, y })}
            onRemove={() => removeBox(box.id)}
          />
        ))}
      </div>

      <p className="shrink-0 border-t px-3 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] text-[11px] text-muted-foreground">
        {mode === "type"
          ? "Type freely above. Open a text box or the pen on the page below when you need them."
          : mode === "textbox"
            ? "Click the page to drop a text box, then type. Drag the handle to move it."
            : "Stylus preferred for ink. The box above is always there if you just want to type."}
      </p>
    </div>
  );
}

function TextBox({
  box,
  selected,
  onSelect,
  onChange,
  onMoveStart,
  onMove,
  onRemove,
}: {
  box: InkTextBox;
  selected: boolean;
  onSelect: () => void;
  onChange: (text: string) => void;
  onMoveStart: () => void;
  onMove: (x: number, y: number) => void;
  onRemove: () => void;
}) {
  const drag = useRef<{ dx: number; dy: number; started: boolean } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selected) inputRef.current?.focus();
  }, [selected]);

  return (
    <div
      className={cn(
        "absolute z-10 flex flex-col rounded-md border bg-background/95 shadow-sm",
        selected ? "border-primary ring-1 ring-primary/30" : "border-border"
      )}
      style={{ left: box.x, top: box.y, width: box.width, minHeight: box.height }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div
        className="flex cursor-grab items-center justify-between gap-1 rounded-t-md bg-muted/70 px-1.5 py-0.5 active:cursor-grabbing"
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { dx: e.clientX - box.x, dy: e.clientY - box.y, started: false };
          onSelect();
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          if (!drag.current.started) {
            drag.current.started = true;
            onMoveStart();
          }
          onMove(Math.max(0, e.clientX - drag.current.dx), Math.max(0, e.clientY - drag.current.dy));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <StickyNote className="size-3" aria-hidden />
          Text
        </span>
        <button
          type="button"
          className="flex size-5 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors duration-200 hover:bg-background hover:text-foreground"
          aria-label="Remove text box"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="size-3" />
        </button>
      </div>
      <Textarea
        ref={inputRef}
        value={box.text}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onSelect}
        placeholder="Type here…"
        aria-label="Text box"
        className="min-h-[72px] flex-1 resize-y rounded-none border-0 bg-transparent px-2 py-1.5 text-sm leading-6 shadow-none focus-visible:ring-0"
        style={{ color: box.color }}
      />
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
      title={label}
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

import * as THREE from "three";
import { khatamStar, rosette } from "@/lib/watch/girih";

export interface DialCopy {
  locale: string;
  brand: string;
  motto: string;
  city: string;
  since: string;
}

export interface EngravingCopy {
  lines: string[];
  ring: string;
  center?: string;
}

const BRASS = "#c8a15a";
const IVORY = "#f4efe6";
const TURQ = "#22d3c5";

export function cssFont(variable: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

function canvas(size: number) {
  const el = document.createElement("canvas");
  el.width = size;
  el.height = size;
  return [el, el.getContext("2d")!] as const;
}

function strokeSegments(ctx: CanvasRenderingContext2D, segments: [number, number, number, number][]) {
  ctx.beginPath();
  for (const [x1, y1, x2, y2] of segments) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

function strokePolygon(ctx: CanvasRenderingContext2D, points: [number, number][]) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.stroke();
}

function arcText(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, radius: number, start: number) {
  let angle = start;
  for (const char of text) {
    const w = ctx.measureText(char).width;
    angle += w / 2 / radius;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    angle += w / 2 / radius;
  }
  return angle;
}

const persianDigits = (value: string) => value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/**
 * Obsidian dial: guilloché rings, sunburst, a girih rosette with a turquoise khatam star,
 * minute track and sparse numerals. `worldRadius` maps the canvas onto the dial mesh.
 */
export function drawDial(copy: DialCopy, worldRadius: number, aperture: { x: number; y: number; r: number }) {
  const S = 1024;
  const [el, ctx] = canvas(S);
  const c = S / 2;
  const R = S / 2;
  const k = R / worldRadius;
  const serif = cssFont("--font-instrument-serif", "Georgia, serif");
  const naskh = cssFont("--font-naskh", "serif");
  const sans = cssFont("--font-inter-tight", "system-ui, sans-serif");
  const mono = cssFont("--font-jetbrains-mono", "monospace");
  const fa = copy.locale === "fa";

  const base = ctx.createRadialGradient(c, c * 0.8, 0, c, c, R);
  base.addColorStop(0, "#15181d");
  base.addColorStop(0.7, "#0b0d10");
  base.addColorStop(1, "#060708");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = "rgba(200,161,90,0.07)";
  ctx.lineWidth = 1;
  for (let r = 0.04; r < 0.64; r += 0.012) {
    ctx.beginPath();
    ctx.arc(c, c, r * R, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(244,239,230,0.045)";
  for (let i = 0; i < 360; i++) {
    const a = (i / 360) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * R * 0.66, c + Math.sin(a) * R * 0.66);
    ctx.lineTo(c + Math.cos(a) * R * 0.87, c + Math.sin(a) * R * 0.87);
    ctx.stroke();
  }

  ctx.lineWidth = 1.6;
  ctx.strokeStyle = "rgba(200,161,90,0.55)";
  strokeSegments(ctx, rosette(c, c, R * 0.27, 10));
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(34,211,197,0.75)";
  strokePolygon(ctx, khatamStar(c, c, R * 0.09, Math.PI / 8));
  ctx.beginPath();
  ctx.arc(c, c, R * 0.3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(200,161,90,0.55)";
  ctx.lineWidth = 1.5;
  for (const r of [0.885, 0.955]) {
    ctx.beginPath();
    ctx.arc(c, c, r * R, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const major = i % 5 === 0;
    ctx.strokeStyle = major ? BRASS : "rgba(244,239,230,0.45)";
    ctx.lineWidth = major ? 4 : 1.5;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * R * (major ? 0.885 : 0.9), c + Math.sin(a) * R * (major ? 0.885 : 0.9));
    ctx.lineTo(c + Math.cos(a) * R * 0.94, c + Math.sin(a) * R * 0.94);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(244,239,230,0.55)";
  ctx.font = `500 17px ${mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 5; i <= 60; i += 5) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const label = String(i).padStart(2, "0");
    ctx.fillText(fa ? persianDigits(label) : label, c + Math.cos(a) * R * 0.977, c + Math.sin(a) * R * 0.977);
  }

  ctx.fillStyle = IVORY;
  ctx.font = fa ? `500 82px ${naskh}` : `italic 92px ${serif}`;
  const numerals: [string, number][] = [
    ["12", -Math.PI / 2],
    ["3", 0],
    ["9", Math.PI],
  ];
  for (const [n, a] of numerals) ctx.fillText(fa ? persianDigits(n) : n, c + Math.cos(a) * R * 0.75, c + Math.sin(a) * R * 0.75 + 6);

  ctx.fillStyle = "rgba(244,239,230,0.9)";
  ctx.font = fa ? `600 30px ${naskh}` : `600 22px ${sans}`;
  if (!fa) (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "7px";
  ctx.fillText(copy.brand, c, c - R * 0.52);
  ctx.fillStyle = BRASS;
  ctx.font = fa ? `500 22px ${naskh}` : `500 14px ${mono}`;
  ctx.fillText(copy.motto, c, c - R * 0.44);
  ctx.fillStyle = "rgba(244,239,230,0.6)";
  ctx.font = fa ? `500 20px ${naskh}` : `500 13px ${mono}`;
  ctx.fillText(copy.city, c - R * 0.48, c);
  ctx.fillText(copy.since, c + R * 0.48, c);
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "0px";

  const ax = c + aperture.x * k;
  const ay = c - aperture.y * k;
  const ar = aperture.r * k;
  ctx.strokeStyle = BRASS;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(ax, ay, ar + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(34,211,197,0.6)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(ax, ay, ar + 14, 0, Math.PI * 2);
  ctx.stroke();

  return el;
}

/** Engraved brass disc (caseback lid). Dark grooves with a light lower lip read as cut metal. */
export function drawEngraving(copy: EngravingCopy, locale: string) {
  const S = 1024;
  const [el, ctx] = canvas(S);
  const c = S / 2;
  const R = S / 2;
  const serif = cssFont("--font-instrument-serif", "Georgia, serif");
  const naskh = cssFont("--font-naskh", "serif");
  const mono = cssFont("--font-jetbrains-mono", "monospace");

  const base = ctx.createRadialGradient(c * 0.7, c * 0.6, 0, c, c, R);
  base.addColorStop(0, "#e2c182");
  base.addColorStop(0.55, "#c8a15a");
  base.addColorStop(1, "#8f6f35");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  ctx.lineWidth = 1;
  for (let r = 6; r < R; r += 3) {
    ctx.strokeStyle = `rgba(${r % 2 ? "255,240,210" : "90,64,24"},0.06)`;
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const engrave = (draw: (offset: number) => void) => {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle = "rgba(255,236,196,0.55)";
    draw(1.5);
    ctx.fillStyle = ctx.strokeStyle = "rgba(52,36,12,0.9)";
    draw(0);
    ctx.restore();
  };

  ctx.lineWidth = 2;
  engrave((o) => {
    ctx.beginPath();
    ctx.arc(c, c + o, R * 0.93, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(c, c + o, R * 0.8, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.font = `500 30px ${mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  engrave((o) => {
    ctx.save();
    ctx.translate(0, o);
    const ring = `${copy.ring} · `.repeat(3);
    arcText(ctx, ring, c, c, R * 0.865, -Math.PI / 2 - 0.02);
    ctx.restore();
  });

  ctx.lineWidth = 1.4;
  engrave((o) => {
    ctx.save();
    ctx.translate(0, o);
    ctx.globalAlpha = 0.5;
    strokeSegments(ctx, rosette(c, c, R * 0.72, 12));
    ctx.restore();
  });

  const fa = locale === "fa";
  const lineHeight = fa ? 120 : 112;
  const top = c - ((copy.lines.length - 1) * lineHeight) / 2;
  ctx.font = fa ? `600 92px ${naskh}` : `italic 108px ${serif}`;
  ctx.direction = fa ? "rtl" : "ltr";
  copy.lines.forEach((line, i) => {
    engrave((o) => ctx.fillText(line, c, top + i * lineHeight + o));
  });

  if (copy.center) {
    ctx.font = `500 26px ${mono}`;
    engrave((o) => ctx.fillText(copy.center!, c, c + R * 0.62 + o));
  }

  return el;
}

/** Perlage (circular graining) used as a roughness map on the main plate. */
export function drawPerlage() {
  const S = 512;
  const [el, ctx] = canvas(S);
  ctx.fillStyle = "#909090";
  ctx.fillRect(0, 0, S, S);
  const step = 32;
  for (let y = -step; y < S + step; y += step * 0.8) {
    for (let x = -step; x < S + step; x += step * 0.8) {
      const ox = (Math.round(y / (step * 0.8)) % 2) * step * 0.4;
      const g = ctx.createRadialGradient(x + ox, y, 0, x + ox, y, step * 0.62);
      g.addColorStop(0, "#5a5a5a");
      g.addColorStop(0.6, "#c4c4c4");
      g.addColorStop(1, "#7a7a7a");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x + ox, y, step * 0.62, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return el;
}

/** Côtes de Genève stripes, used as a roughness map on bridges. */
export function drawGeneva() {
  const S = 256;
  const [el, ctx] = canvas(S);
  const bands = 4;
  const w = S / bands;
  for (let i = 0; i < bands; i++) {
    const g = ctx.createLinearGradient(i * w, 0, (i + 1) * w, 0);
    g.addColorStop(0, "#3a3a3a");
    g.addColorStop(0.5, "#a8a8a8");
    g.addColorStop(1, "#3a3a3a");
    ctx.fillStyle = g;
    ctx.fillRect(i * w, 0, w, S);
  }
  return el;
}

export function toTexture(source: HTMLCanvasElement, opts: { srgb?: boolean; repeat?: number } = {}) {
  const texture = new THREE.CanvasTexture(source);
  if (opts.srgb) texture.colorSpace = THREE.SRGBColorSpace;
  if (opts.repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(opts.repeat, opts.repeat);
  }
  texture.anisotropy = 8;
  return texture;
}

export { BRASS, IVORY, TURQ };

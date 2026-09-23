export interface RecallLine {
  cue: string;
  sentence: string;
}

export interface RecallPack {
  cue: string;
  firstLine: string;
  lines: RecallLine[];
}

const HEADING = /^##\s+(.+?)\s*$/gm;

function section(markdown: string, title: string): string {
  const wanted = title.trim().toLowerCase();
  HEADING.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = HEADING.exec(markdown))) {
    if (match[1].trim().toLowerCase() !== wanted) continue;
    const start = match.index + match[0].length;
    const rest = markdown.slice(start);
    const next = rest.search(/^##\s+/m);
    return (next === -1 ? rest : rest.slice(0, next)).trim();
  }
  return "";
}

function field(block: string, label: string): string {
  const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, "im");
  return re.exec(block)?.[1]?.trim() ?? "";
}

function parseLines(block: string): RecallLine[] {
  const lines: RecallLine[] = [];
  for (const raw of block.split("\n")) {
    const row = raw.trim().replace(/^\d+\.\s+/, "").replace(/^[-*]\s+/, "");
    if (!row) continue;
    const bold = /^\*\*(.+?)\*\*\s*[—–:-]\s*(.+)$/.exec(row);
    if (bold) {
      lines.push({ cue: bold[1].trim(), sentence: bold[2].trim() });
      continue;
    }
    const split = /^(.{2,48}?)\s*[—–]\s*(.+)$/.exec(row);
    if (split) {
      lines.push({ cue: split[1].replace(/\*\*/g, "").trim(), sentence: split[2].trim() });
    }
  }
  return lines.slice(0, 4);
}

export function extractRecall(markdown: string): RecallPack | null {
  const blank = section(markdown, "If you blank");
  const remembered = section(markdown, "Three lines to remember");
  const cue = field(blank, "Cue");
  const firstLine = field(blank, "First line");
  const lines = parseLines(remembered);
  if (!cue && !firstLine && lines.length === 0) return null;
  return {
    cue: cue || lines[0]?.cue || "Start here",
    firstLine: firstLine || lines[0]?.sentence || "",
    lines,
  };
}

function stripSection(markdown: string, title: string): string {
  const wanted = title.trim().toLowerCase();
  const re = /^##\s+(.+?)\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown))) {
    if (match[1].trim().toLowerCase() !== wanted) continue;
    const after = markdown.slice(match.index + match[0].length);
    const next = after.search(/^##\s+/m);
    const end = next === -1 ? markdown.length : match.index + match[0].length + next;
    return `${markdown.slice(0, match.index)}${markdown.slice(end)}`.replace(/\n{3,}/g, "\n\n").trim();
  }
  return markdown;
}

export function markdownWithoutRecall(markdown: string): string {
  return stripSection(stripSection(markdown, "If you blank"), "Three lines to remember");
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function extractJsonObject(text: string): Record<string, unknown> {
  const candidates = jsonObjectCandidates(text);
  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      return parseObject(candidate);
    } catch (error) {
      lastError = error;
    }
    try {
      return parseObject(repairJsonLike(candidate));
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Model did not return JSON");
}

export function extractJsonArray(text: string): unknown[] {
  const slice = sliceBalanced(text, "[", "]");
  if (!slice) throw new Error("Model did not return a JSON array");
  try {
    const parsed: unknown = JSON.parse(slice);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // try repaired
  }
  const parsed: unknown = JSON.parse(repairJsonLike(slice));
  if (!Array.isArray(parsed)) throw new Error("JSON was not an array");
  return parsed;
}

export function parseTaggedBlock(text: string, tag: string): string {
  const re = new RegExp(`<<<${tag}>>>\\s*([\\s\\S]*?)(?=<<<[A-Z]+>>>|$)`, "i");
  return re.exec(text)?.[1]?.trim() ?? "";
}

export function hasTaggedLesson(text: string): boolean {
  return /<<<MARKDOWN>>>/i.test(text) || /<<<TITLE>>>/i.test(text);
}

export function getChatMessageText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const root = data as Record<string, unknown>;
  const choices = root.choices;
  const choice = Array.isArray(choices) ? choices[0] : undefined;
  const record = choice && typeof choice === "object" ? (choice as Record<string, unknown>) : {};
  const message = record.message && typeof record.message === "object" ? (record.message as Record<string, unknown>) : {};
  return normalizeContent(message.content) || normalizeContent(record.text) || normalizeContent(root.output_text);
}

function normalizeContent(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (!part || typeof part !== "object") return "";
      const row = part as Record<string, unknown>;
      if (typeof row.text === "string") return row.text;
      if (typeof row.content === "string") return row.content;
      return "";
    })
    .join("")
    .trim();
}

function parseObject(raw: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON was not an object");
  }
  return parsed as Record<string, unknown>;
}

function jsonObjectCandidates(text: string): string[] {
  const trimmed = text.trim().replace(/^\uFEFF/, "");
  const fromFence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fromFence?.[1]?.trim() ?? trimmed;
  const matched = sliceBalanced(body, "{", "}");
  const naiveStart = body.indexOf("{");
  const naiveEnd = body.lastIndexOf("}");
  const naive =
    naiveStart >= 0 && naiveEnd > naiveStart ? body.slice(naiveStart, naiveEnd + 1) : null;
  return uniqueStrings([matched, naive, body].filter((item): item is string => Boolean(item)));
}

function sliceBalanced(text: string, open: "{" | "[", close: "}" | "]"): string | null {
  const start = text.indexOf(open);
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (char === "\\") {
        escape = true;
        continue;
      }
      if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === open) depth += 1;
    else if (char === close) {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function repairJsonLike(input: string): string {
  let value = input.trim().replace(/^\uFEFF/, "");
  value = value.replace(/,\s*([}\]])/g, "$1");
  value = value.replace(/([{\[,]\s*)'([^'\\]+)'(\s*:)/g, '$1"$2"$3');
  value = value.replace(/([{\[,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3');
  value = value.replace(/:(\s*)'((?:\\'|[^'])*)'/g, (_full, space: string, inner: string) => {
    const escaped = inner.replace(/"/g, '\\"').replace(/\\'/g, "'");
    return `:${space}"${escaped}"`;
  });
  return value;
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

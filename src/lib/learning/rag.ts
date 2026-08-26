import { getLlmBaseUrl } from "@/lib/learning/llm-config";
import { buildRagCorpus, type RagChunk } from "@/lib/learning/knowledge";
import type { RagSource } from "@/lib/learning/coach-types";

type ScoredChunk = RagChunk & { score: number };

const embeddingCache = new Map<string, number[]>();
let corpus: RagChunk[] | null = null;

function getCorpus(): RagChunk[] {
  if (!corpus) corpus = buildRagCorpus();
  return corpus;
}

export function lexicalRetrieve(query: string, k = 8): ScoredChunk[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return getCorpus().slice(0, k).map((c) => ({ ...c, score: 0 }));

  const scored = getCorpus().map((chunk) => {
    const hay = tokenize(`${chunk.title} ${chunk.text}`);
    const counts = new Map<string, number>();
    for (const t of hay) counts.set(t, (counts.get(t) ?? 0) + 1);
    let score = 0;
    for (const t of qTokens) {
      const tf = counts.get(t) ?? 0;
      if (tf > 0) score += 1 + Math.log(1 + tf);
    }
    if (qTokens.some((t) => chunk.title.toLowerCase().includes(t))) score += 2;
    return { ...chunk, score };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

export async function retrieveForCoach(query: string, k = 6): Promise<RagSource[]> {
  const lexical = lexicalRetrieve(query, 12);
  const embedded = await embedRetrieve(query, 12).catch(() => [] as ScoredChunk[]);

  const merged = new Map<string, ScoredChunk>();
  for (const chunk of lexical) {
    merged.set(chunk.id, { ...chunk, score: chunk.score });
  }
  for (const chunk of embedded) {
    const existing = merged.get(chunk.id);
    const hybrid = existing ? existing.score * 0.4 + chunk.score * 0.6 : chunk.score;
    merged.set(chunk.id, { ...chunk, score: hybrid });
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ id, title, url, kind }) => ({ id, title, url, kind }));
}

export function formatRagContext(sources: RagSource[]): string {
  const corpusMap = new Map(getCorpus().map((c) => [c.id, c]));
  return sources
    .map((s, i) => {
      const full = corpusMap.get(s.id);
      const body = full?.text ?? s.title;
      const link = s.url ? ` ${s.url}` : "";
      return `[${i + 1}] ${s.title}${link}\n${body}`;
    })
    .join("\n\n");
}

async function embedRetrieve(query: string, k: number): Promise<ScoredChunk[]> {
  const queryVec = await embedOne(query);
  if (!queryVec) return [];

  await ensureCorpusEmbeddings();
  const scored: ScoredChunk[] = [];
  for (const chunk of getCorpus()) {
    const vec = embeddingCache.get(chunk.id);
    if (!vec) continue;
    scored.push({ ...chunk, score: cosine(queryVec, vec) });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, k);
}

async function ensureCorpusEmbeddings() {
  const missing = getCorpus().filter((c) => !embeddingCache.has(c.id));
  if (missing.length === 0) return;
  const vecs = await embedMany(missing.map((c) => `${c.title}\n${c.text}`));
  if (!vecs || vecs.length !== missing.length) return;
  missing.forEach((chunk, i) => embeddingCache.set(chunk.id, vecs[i]));
}

async function embedOne(text: string): Promise<number[] | null> {
  const batch = await embedMany([text]);
  return batch?.[0] ?? null;
}

async function embedMany(inputs: string[]): Promise<number[][] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

  try {
    const res = await fetch(`${getLlmBaseUrl()}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, input: inputs }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: Array<{ embedding?: number[]; index?: number }> };
    if (!data.data?.length) return null;
    return [...data.data]
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((d) => d.embedding)
      .filter((e): e is number[] => Array.isArray(e));
  } catch {
    return null;
  }
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
}

function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

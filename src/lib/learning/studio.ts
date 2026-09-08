import { LEARNER_PROFILE, getDestination, mergeHeadlines, slugifyHeadline } from "@/lib/learning/destinations";
import { asString, asStringArray, extractJsonObject } from "@/lib/learning/json";
import { ingestRagChunks, type RagChunk } from "@/lib/learning/knowledge";
import { getLlmBaseUrl, getLlmModel, isLlmConfigured } from "@/lib/learning/llm-config";
import { formatRagContext, invalidateRagCorpus, retrieveForQuery } from "@/lib/learning/rag";
import type {
  ExplainResult,
  GeneratedLesson,
  HeadlineDepth,
  LessonQuestion,
  RagSource,
  StudyHeadline,
} from "@/types/learning";

export { isLlmConfigured };

const SYSTEM_BASE = [
  "You are Alireza's private senior-engineer study studio.",
  "Be precise. No filler. Default to English. If he writes in Persian, reply in Persian.",
  "Ground every claim in the retrieved RAG context. Cite source titles in-line when used.",
  "Never invent URLs. If a fact is missing from RAG, say so.",
  "Return JSON only — no markdown fence unless you must.",
  `Learner: ${LEARNER_PROFILE}`,
].join("\n");

export async function generateHeadlines(destinationId: string): Promise<{
  headlines: StudyHeadline[];
  sources: RagSource[];
}> {
  const dest = getDestination(destinationId);
  if (!dest) throw new Error("Unknown destination");

  const query = `${dest.title} ${dest.goal} ${dest.ragKeywords.join(" ")} ${dest.seedHeadlines.map((h) => h.title).join(" ")}`;
  const sources = await retrieveForQuery(query, 8);
  const ragContext = formatRagContext(sources);

  const content = await chatJson({
    temperature: 0.4,
    user: [
      `Destination: ${dest.title}`,
      dest.subtitle,
      `Goal: ${dest.goal}`,
      `Interview signal: ${dest.interviewSignal}`,
      "Seed headlines (keep these, refine why-text if needed, you may add 2–4 extra interview headlines):",
      JSON.stringify(dest.seedHeadlines),
      "RAG:",
      ragContext || "(none)",
      'Return {"headlines":[{"id":"stable-slug","title":"...","why":"one sentence","depth":"core|interview|lab"}]}',
      "12 headlines max. Order foundations → interview → lab. ids must be unique kebab-case prefixed with destination if new.",
    ].join("\n\n"),
  });

  const raw = content.headlines;
  const generated = Array.isArray(raw)
    ? raw
        .map((item, index): StudyHeadline | null => {
          if (!item || typeof item !== "object") return null;
          const row = item as Record<string, unknown>;
          const title = asString(row.title).trim();
          if (!title) return null;
          const depth = normalizeDepth(asString(row.depth));
          const id = asString(row.id).trim() || slugifyHeadline(dest.id, title) || `${dest.id}-extra-${index}`;
          return {
            id,
            title,
            why: asString(row.why).trim() || dest.goal,
            depth,
          };
        })
        .filter((h): h is StudyHeadline => Boolean(h))
    : [];

  return {
    headlines: mergeHeadlines(dest.seedHeadlines, generated),
    sources,
  };
}

export async function generateLesson(params: {
  destinationId: string;
  headlineId: string;
  headlineTitle?: string;
  headlineWhy?: string;
  extraNotes?: string;
}): Promise<GeneratedLesson> {
  const dest = getDestination(params.destinationId);
  if (!dest) throw new Error("Unknown destination");

  const seed = dest.seedHeadlines.find((h) => h.id === params.headlineId);
  const title = params.headlineTitle?.trim() || seed?.title || params.headlineId;
  const why = params.headlineWhy?.trim() || seed?.why || dest.goal;

  const query = `${dest.title} ${title} ${why} ${dest.ragKeywords.join(" ")} ${params.extraNotes ?? ""}`;
  const sources = await retrieveForQuery(query, 8);
  const ragContext = formatRagContext(sources);

  const content = await chatJson({
    temperature: 0.5,
    user: [
      `Write a study lesson for headline: ${title}`,
      `Why it matters: ${why}`,
      `Destination: ${dest.title} — ${dest.goal}`,
      `Interview signal for this destination: ${dest.interviewSignal}`,
      params.extraNotes ? `Learner notes / bookmarks to respect:\n${params.extraNotes}` : "",
      "RAG:",
      ragContext || "(none)",
      "Requirements:",
      "- markdown field: 700–1200 words, GitHub-flavored markdown",
      "- Start with a 2-sentence interview framing",
      "- Use ## headings, one TypeScript fenced example, one failure-mode section",
      "- Tie to Skedpal / NextTarget / Javi / AzarTime when it is honest",
      "- End markdown with a short 'Say this in the interview' script (90 seconds)",
      "- questions: exactly 3. Mix 2 choice + 1 short. For choice, answer must equal one option string exactly.",
      'Return {"title":"...","markdown":"...","questions":[{"id":"q1","kind":"choice|short","prompt":"...","options":["..."],"answer":"...","explanation":"..."}]}',
    ]
      .filter(Boolean)
      .join("\n\n"),
  });

  const questions = parseQuestions(content.questions);
  const markdown = asString(content.markdown).trim();
  if (!markdown) throw new Error("Lesson had no markdown");

  const lesson: GeneratedLesson = {
    destinationId: dest.id,
    headlineId: params.headlineId,
    title: asString(content.title).trim() || title,
    markdown,
    questions,
    sources,
    generatedAt: new Date().toISOString(),
  };

  ingestRagChunks([
    {
      id: `lesson-${dest.id}-${params.headlineId}`,
      kind: "lesson",
      title: `${dest.title}: ${lesson.title}`,
      text: `${lesson.title}. ${stripMarkdown(markdown).slice(0, 2500)}`,
    },
  ]);
  invalidateRagCorpus();

  return lesson;
}

export async function explainSelection(params: {
  destinationId: string;
  headlineId: string;
  headlineTitle?: string;
  selection: string;
  surrounding?: string;
}): Promise<ExplainResult> {
  const dest = getDestination(params.destinationId);
  if (!dest) throw new Error("Unknown destination");

  const selection = params.selection.trim();
  if (selection.length < 4) throw new Error("Select a longer passage");

  const query = `${selection} ${params.headlineTitle ?? ""} ${dest.title} ${dest.ragKeywords.join(" ")}`;
  const sources = await retrieveForQuery(query, 6);
  const ragContext = formatRagContext(sources);

  const content = await chatJson({
    temperature: 0.4,
    user: [
      `Headline: ${params.headlineTitle ?? params.headlineId} (${dest.title})`,
      `Highlighted passage:\n"""${selection.slice(0, 2000)}"""`,
      params.surrounding ? `Nearby context:\n${params.surrounding.slice(0, 1500)}` : "",
      "RAG:",
      ragContext || "(none)",
      "Explain this passage more deeply for a rusty senior engineer.",
      "Go one level down: mechanism, a tiny example, the interview trap, and one follow-up question.",
      'Return {"markdown":"..."}  (400–700 words, GFM markdown)',
    ]
      .filter(Boolean)
      .join("\n\n"),
  });

  const markdown = asString(content.markdown).trim();
  if (!markdown) throw new Error("Empty explanation");
  return { markdown, sources };
}

export function ingestStudioChunks(chunks: RagChunk[]) {
  ingestRagChunks(chunks);
  invalidateRagCorpus();
}

async function chatJson(params: { user: string; temperature: number }): Promise<Record<string, unknown>> {
  try {
    return await completeJson(params, true);
  } catch {
    return completeJson(params, false);
  }
}

async function completeJson(
  params: { user: string; temperature: number },
  strictJson: boolean
): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const response = await fetch(`${getLlmBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getLlmModel(),
      temperature: params.temperature,
      ...(strictJson ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: SYSTEM_BASE },
        { role: "user", content: params.user },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`LLM request failed (${response.status}): ${text.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = data.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("LLM returned an empty response");
  return extractJsonObject(raw);
}

function normalizeDepth(value: string): HeadlineDepth {
  if (value === "interview" || value === "lab" || value === "core") return value;
  return "core";
}

function parseQuestions(value: unknown): LessonQuestion[] {
  if (!Array.isArray(value)) return [];
  const questions: LessonQuestion[] = [];
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const prompt = asString(row.prompt).trim();
    const answer = asString(row.answer).trim();
    if (!prompt || !answer) continue;
    const kind = asString(row.kind) === "short" ? "short" : "choice";
    const options = asStringArray(row.options).map((o) => o.trim()).filter(Boolean);
    questions.push({
      id: asString(row.id).trim() || `q${index + 1}`,
      kind: kind === "choice" && options.length < 2 ? "short" : kind,
      prompt,
      options: kind === "choice" ? options : undefined,
      answer,
      explanation: asString(row.explanation).trim(),
    });
  }
  return questions.slice(0, 4);
}

function stripMarkdown(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`[\]]/g, " ").replace(/\s+/g, " ").trim();
}

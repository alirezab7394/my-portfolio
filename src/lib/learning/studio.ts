import { LEARNER_PROFILE, getDestination, mergeHeadlines, slugifyHeadline } from "@/lib/learning/destinations";
import {
  asString,
  asStringArray,
  extractJsonArray,
  extractJsonObject,
  getChatMessageText,
  hasTaggedLesson,
  parseTaggedBlock,
} from "@/lib/learning/json";
import { ingestRagChunks, type RagChunk } from "@/lib/learning/knowledge";
import { getLlmApiKey, getLlmBaseUrl, getLlmModel, isLlmConfigured } from "@/lib/learning/llm-config";
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
  "You are Alireza's private study studio for software engineering and AI engineering interviews.",
  "Write so a strong engineer who forgets under pressure can rebuild the answer from a few cues.",
  "Plain English first. Define any jargon in the same sentence. Short paragraphs, one idea each.",
  "Concrete before abstract: a tiny example, then the mechanism, then the interview line.",
  "Do not pile on synonyms or filler. Every section must teach something he can say out loud.",
  "Default to English. If he writes in Persian, reply in Persian but keep code and API names in English.",
  "Ground claims in the retrieved RAG context. Cite source titles in-line when you use them.",
  "Never invent URLs, metrics, or project facts. If RAG does not support a detail, say what is missing.",
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

  const raw = await completeModel({
    temperature: 0.4,
    preferJson: true,
    user: [
      `Destination: ${dest.title}`,
      dest.subtitle,
      `Goal: ${dest.goal}`,
      `Interview signal: ${dest.interviewSignal}`,
      "Seed headlines (keep these, refine why-text if needed, you may add 2–4 extra interview headlines):",
      JSON.stringify(dest.seedHeadlines),
      "RAG:",
      ragContext || "(none)",
      'Return ONLY JSON: {"headlines":[{"id":"stable-slug","title":"...","why":"the one sentence he should say if he blanks","depth":"core|interview|lab"}]}',
      "why must be a speakable answer, not a slogan. 14 headlines max. Cover both software-engineer and AI-engineer angles when the destination allows it.",
      "Double-quote every key and string. No trailing commas. No markdown.",
    ].join("\n\n"),
  });

  const content = extractJsonObject(raw);
  const generated = Array.isArray(content.headlines)
    ? content.headlines
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

  const raw = await completeModel({
    temperature: 0.35,
    preferJson: false,
    user: [
      `Write a study lesson for headline: ${title}`,
      `Why it matters: ${why}`,
      `Destination: ${dest.title} — ${dest.goal}`,
      `Interview signal for this destination: ${dest.interviewSignal}`,
      params.extraNotes ? `Learner notes / bookmarks to respect:\n${params.extraNotes}` : "",
      "RAG:",
      ragContext || "(none)",
      "He forgets answers in interviews. Teach the idea clearly, then give cues he can rebuild the answer from.",
      "Make him ready to do the job, not only to recite a definition: software engineer depth (how it fails in production) and AI engineer depth (data, eval, cost, or model failure) when that link is honest.",
      "Markdown rules:",
      "- 900–1400 words of GitHub-flavored markdown. Paragraphs of 1–3 sentences.",
      "- Use these headings, in this order, spelled exactly:",
      "## The point",
      "## Plain version",
      "## How it actually works",
      "## Worked example",
      "## What breaks",
      "## On the job",
      "## If you blank",
      "## Three lines to remember",
      "## Say this in the interview",
      "- The point: why an interviewer asks, in 2 sentences.",
      "- Plain version: teach it with no unexplained jargon.",
      "- How it actually works: numbered steps. This is the detail that makes him job-ready.",
      "- Worked example: one fenced TypeScript, SQL, or prompt example. Say what you expect and why. Comment the non-obvious line.",
      "- What breaks: 3 failure modes. For each, symptom then what you check.",
      "- On the job: a short 'Software engineer' subsection and a short 'AI engineer' subsection. Use Skedpal, NextTarget, Javi, or AzarTime only when it is honest. If one track barely applies, say so in two sentences and give the real bridge. Do not invent a fake AI use.",
      "- If you blank: exactly two lines, 'Cue: <2–5 words>' then 'First line: <one sentence he can say while his brain catches up>'.",
      "- Three lines to remember: exactly 3 items shaped as '1. **short cue** — one sentence'. These three sentences plus the first line must be enough to rebuild the interview answer.",
      "- Say this in the interview: 45–70 seconds of spoken English, built from those three lines. Not a new essay.",
      "- questions: exactly 3.",
      "  q1 kind choice, a trap from What breaks. answer must equal one option string exactly.",
      "  q2 kind short. Prompt: the interviewer asks him to explain it. answer is 3–5 spoken sentences.",
      "  q3 kind short. Prompt: he went blank — what is the first sentence? answer must match the First line.",
      "  Each explanation names the cue to use if he freezes.",
      "CRITICAL output format — do not wrap the lesson in JSON. Markdown stays raw:",
      "<<<TITLE>>>",
      "short title",
      "<<<MARKDOWN>>>",
      "raw markdown here, including code fences",
      "<<<QUESTIONS>>>",
      '[{"id":"q1","kind":"choice","prompt":"...","options":["..."],"answer":"...","explanation":"..."}]',
    ]
      .filter(Boolean)
      .join("\n\n"),
  });

  const parsed = parseLessonPayload(raw, title);
  if (!parsed.markdown) throw new Error("Lesson had no markdown");

  const lesson: GeneratedLesson = {
    destinationId: dest.id,
    headlineId: params.headlineId,
    title: parsed.title || title,
    markdown: parsed.markdown,
    questions: parsed.questions,
    sources,
    generatedAt: new Date().toISOString(),
  };

  ingestRagChunks([
    {
      id: `lesson-${dest.id}-${params.headlineId}`,
      kind: "lesson",
      title: `${dest.title}: ${lesson.title}`,
      text: `${lesson.title}. ${stripMarkdown(lesson.markdown).slice(0, 2500)}`,
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
  ease?: number;
  previous?: string;
}): Promise<ExplainResult> {
  const dest = getDestination(params.destinationId);
  if (!dest) throw new Error("Unknown destination");

  const selection = params.selection.trim();
  if (selection.length < 4) throw new Error("Select a longer passage");

  const query = `${selection} ${params.headlineTitle ?? ""} ${dest.title} ${dest.ragKeywords.join(" ")}`;
  const sources = await retrieveForQuery(query, 6);
  const ragContext = formatRagContext(sources);

  const ease = clampEase(params.ease);
  const raw = await completeModel({
    temperature: ease === 1 ? 0.35 : 0.2,
    preferJson: false,
    user: [
      `Headline: ${params.headlineTitle ?? params.headlineId} (${dest.title})`,
      `Highlighted passage:\n"""${selection.slice(0, 2000)}"""`,
      params.surrounding ? `Nearby context:\n${params.surrounding.slice(0, 1500)}` : "",
      params.previous && ease > 1 ? `Previous explanation to simplify. Keep the facts, drop the hard wording:\n"""${params.previous.slice(0, 4000)}"""` : "",
      "RAG:",
      ragContext || "(none)",
      explainBrief(ease),
      "He asked to explain more because the passage was hard or he will forget it.",
      "Make it easier to understand and easier to say. Add the missing detail in plain words. Do not answer with denser jargon.",
      "Cover what a software engineer must know, and the AI-engineer angle only when it is a real part of this passage.",
      "Use these headings, spelled exactly:",
      "## In one breath",
      "## Picture it",
      "## Step by step",
      "## The detail you were missing",
      "## Tiny example",
      "## If you blank",
      "- In one breath: one sentence a tired person understands.",
      "- Picture it: one concrete picture from real software (a queue, a lock, a form, a cache). No abstract metaphor pile.",
      "- Step by step: numbered, one idea per step.",
      "- The detail you were missing: the extra mechanism, the trap, and what you would check in production. Still plain.",
      "- Tiny example: a few lines of code or a before/after. Say the result.",
      "- If you blank: 'Cue: <2–5 words>' then 'First line: <one sentence>' then two more short sentences that finish the answer.",
      "Output format — do not wrap in JSON:",
      "<<<MARKDOWN>>>",
      "GFM markdown only",
    ]
      .filter(Boolean)
      .join("\n\n"),
  });

  const markdown = parseExplainPayload(raw);
  if (!markdown) throw new Error("Empty explanation");
  return { markdown, sources };
}

export function ingestStudioChunks(chunks: RagChunk[]) {
  ingestRagChunks(chunks);
  invalidateRagCorpus();
}

function parseLessonPayload(
  raw: string,
  fallbackTitle: string
): { title: string; markdown: string; questions: LessonQuestion[] } {
  if (hasTaggedLesson(raw)) {
    return {
      title: parseTaggedBlock(raw, "TITLE") || fallbackTitle,
      markdown: parseTaggedBlock(raw, "MARKDOWN"),
      questions: parseQuestions(parseQuestionsField(parseTaggedBlock(raw, "QUESTIONS"))),
    };
  }

  try {
    const json = extractJsonObject(raw);
    return {
      title: asString(json.title).trim() || fallbackTitle,
      markdown: asString(json.markdown).trim(),
      questions: parseQuestions(json.questions),
    };
  } catch {
    const stripped = raw.replace(/^```(?:markdown|md)?\s*/i, "").replace(/```$/, "").trim();
    if (stripped.length > 40) {
      return { title: fallbackTitle, markdown: stripped, questions: [] };
    }
    throw new Error("Could not parse the generated lesson. Try regenerate.");
  }
}

function parseExplainPayload(raw: string): string {
  const tagged = parseTaggedBlock(raw, "MARKDOWN");
  if (tagged) return tagged;
  try {
    return asString(extractJsonObject(raw).markdown).trim();
  } catch {
    return raw.replace(/^```(?:markdown|md)?\s*/i, "").replace(/```$/, "").trim();
  }
}

function parseQuestionsField(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  try {
    return extractJsonArray(trimmed);
  } catch {
    try {
      const obj = extractJsonObject(trimmed);
      return obj.questions ?? [];
    } catch {
      return [];
    }
  }
}

async function completeModel(params: {
  user: string;
  temperature: number;
  preferJson: boolean;
}): Promise<string> {
  if (params.preferJson) {
    try {
      return await completeOnce(params, true);
    } catch {
      return completeOnce(params, false);
    }
  }
  return completeOnce(params, false);
}

async function completeOnce(
  params: { user: string; temperature: number },
  strictJson: boolean
): Promise<string> {
  const apiKey = getLlmApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

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

  const httpText = await response.text();
  if (!response.ok) {
    throw new Error(`LLM request failed (${response.status}): ${httpText.slice(0, 300)}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(httpText);
  } catch {
    throw new Error(`LLM HTTP body was not JSON: ${httpText.slice(0, 180)}`);
  }

  const raw = getChatMessageText(data);
  if (!raw) throw new Error("LLM returned an empty response");
  return raw;
}

function clampEase(value: number | undefined): 1 | 2 | 3 {
  if (value === 2 || value === 3) return value;
  return 1;
}

function explainBrief(ease: 1 | 2 | 3): string {
  if (ease === 3) {
    return "Ease 3 of 3. Shortest version. Sentences under 15 words. Everyday words. Still include every heading and the real mechanism. About 250–400 words.";
  }
  if (ease === 2) {
    return "Ease 2 of 3. Simpler than a normal explanation. Short sentences. Define every term. About 400–600 words.";
  }
  return "Ease 1 of 3. Clear expansion with the missing detail. About 500–750 words. Still easier than the original passage.";
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
    const options = asStringArray(row.options)
      .map((o) => o.trim())
      .filter(Boolean);
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

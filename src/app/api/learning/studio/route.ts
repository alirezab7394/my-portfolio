import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticatedFromRequest, unauthorizedResponse } from "@/lib/learning/auth";
import { getDestination, slugifyHeadline } from "@/lib/learning/destinations";
import { isLlmConfigured } from "@/lib/learning/llm-config";
import {
  loadHeadlineMapFromDb,
  loadLessonsFromDb,
  replaceHeadlinesInDb,
  saveLessonToDb,
} from "@/lib/learning/studio-db";
import { explainSelection, generateHeadlines, generateLesson, ingestStudioChunks } from "@/lib/learning/studio";
import type { HeadlineDepth, StudyHeadline } from "@/types/learning";

const ingestChunkSchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().min(1).max(240),
  text: z.string().min(1).max(8000),
  kind: z.enum(["destination", "resource", "knowledge", "project", "drill", "lesson", "bookmark"]),
  url: z.string().url().optional(),
});

const headlineSchema = z.object({
  id: z.string().min(1).max(120).optional(),
  title: z.string().min(1).max(240),
  why: z.string().max(500).optional(),
  depth: z.enum(["core", "interview", "lab"]).optional(),
});

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("headlines"),
    destinationId: z.string().min(1).max(64),
  }),
  z.object({
    action: z.literal("lesson"),
    destinationId: z.string().min(1).max(64),
    headlineId: z.string().min(1).max(120),
    headlineTitle: z.string().max(240).optional(),
    headlineWhy: z.string().max(500).optional(),
    extraNotes: z.string().max(4000).optional(),
  }),
  z.object({
    action: z.literal("explain"),
    destinationId: z.string().min(1).max(64),
    headlineId: z.string().min(1).max(120),
    headlineTitle: z.string().max(240).optional(),
    selection: z.string().min(4).max(2000),
    surrounding: z.string().max(1500).optional(),
  }),
  z.object({
    action: z.literal("ingest"),
    chunks: z.array(ingestChunkSchema).max(20),
  }),
  z.object({
    action: z.literal("addHeadline"),
    destinationId: z.string().min(1).max(64),
    headline: headlineSchema,
    headlines: z
      .array(
        z.object({
          id: z.string().min(1).max(120),
          title: z.string().min(1).max(240),
          why: z.string().max(500),
          depth: z.enum(["core", "interview", "lab"]),
        })
      )
      .max(40)
      .optional(),
    existingIds: z.array(z.string().min(1).max(120)).max(40).optional(),
  }),
]);

function uniqueHeadlineId(destinationId: string, title: string, existingIds: string[]): string {
  const base = slugifyHeadline(destinationId, title);
  if (!existingIds.includes(base)) return base;
  let n = 2;
  while (existingIds.includes(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();
  const [lessons, headlines] = await Promise.all([loadLessonsFromDb(), loadHeadlineMapFromDb()]);
  return NextResponse.json({
    success: true,
    configured: isLlmConfigured(),
    lessons,
    headlines,
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();

  try {
    const payload = bodySchema.parse(await request.json());

    if (payload.action === "ingest") {
      ingestStudioChunks(payload.chunks);
      return NextResponse.json({ success: true, ingested: payload.chunks.length });
    }

    if (payload.action === "addHeadline") {
      const dest = getDestination(payload.destinationId);
      if (!dest) {
        return NextResponse.json({ success: false, error: "Unknown destination" }, { status: 400 });
      }
      const headline: StudyHeadline = {
        id: uniqueHeadlineId(payload.destinationId, payload.headline.title, payload.existingIds ?? []),
        title: payload.headline.title.trim(),
        why: payload.headline.why?.trim() || "Custom topic added to this destination.",
        depth: (payload.headline.depth as HeadlineDepth | undefined) ?? "interview",
      };
      const list = payload.headlines?.length
        ? [...payload.headlines.filter((item) => item.id !== headline.id), headline]
        : [...dest.seedHeadlines.filter((item) => item.id !== headline.id), headline];
      try {
        await replaceHeadlinesInDb(payload.destinationId, list);
      } catch (error) {
        console.error("Could not persist headline:", error instanceof Error ? error.message : error);
      }
      return NextResponse.json({ success: true, headline, headlines: list });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json(
        { success: false, error: "LLM is not configured. Set GEMINI_API_KEY (or OPENAI_API_KEY)." },
        { status: 503 }
      );
    }

    if (!getDestination(payload.destinationId)) {
      return NextResponse.json({ success: false, error: "Unknown destination" }, { status: 400 });
    }

    if (payload.action === "headlines") {
      const result = await generateHeadlines(payload.destinationId);
      try {
        await replaceHeadlinesInDb(payload.destinationId, result.headlines);
      } catch (error) {
        console.error("Could not persist headlines:", error instanceof Error ? error.message : error);
      }
      return NextResponse.json({ success: true, ...result });
    }

    if (payload.action === "lesson") {
      const result = await generateLesson({
        destinationId: payload.destinationId,
        headlineId: payload.headlineId,
        headlineTitle: payload.headlineTitle,
        headlineWhy: payload.headlineWhy,
        extraNotes: payload.extraNotes,
      });
      try {
        await saveLessonToDb(result);
      } catch (error) {
        console.error("Could not persist lesson:", error instanceof Error ? error.message : error);
      }
      return NextResponse.json({ success: true, lesson: result });
    }

    const result = await explainSelection({
      destinationId: payload.destinationId,
      headlineId: payload.headlineId,
      headlineTitle: payload.headlineTitle,
      selection: payload.selection,
      surrounding: payload.surrounding,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    console.error("Study studio error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Studio request failed" },
      { status: 502 }
    );
  }
}

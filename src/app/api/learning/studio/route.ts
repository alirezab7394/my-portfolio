import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticatedFromRequest, unauthorizedResponse } from "@/lib/learning/auth";
import { getDestination } from "@/lib/learning/destinations";
import { isLlmConfigured } from "@/lib/learning/llm-config";
import { explainSelection, generateHeadlines, generateLesson, ingestStudioChunks } from "@/lib/learning/studio";

const ingestChunkSchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().min(1).max(240),
  text: z.string().min(1).max(8000),
  kind: z.enum(["destination", "resource", "knowledge", "project", "drill", "lesson", "bookmark"]),
  url: z.string().url().optional(),
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
]);

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();
  return NextResponse.json({ success: true, configured: isLlmConfigured() });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();

  try {
    const payload = bodySchema.parse(await request.json());

    if (payload.action === "ingest") {
      ingestStudioChunks(payload.chunks);
      return NextResponse.json({ success: true, ingested: payload.chunks.length });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json(
        { success: false, error: "LLM is not configured. Set OPENAI_API_KEY, OPENAI_URL, and OPENAI_MODEL." },
        { status: 503 }
      );
    }

    if (!getDestination(payload.destinationId)) {
      return NextResponse.json({ success: false, error: "Unknown destination" }, { status: 400 });
    }

    if (payload.action === "headlines") {
      const result = await generateHeadlines(payload.destinationId);
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

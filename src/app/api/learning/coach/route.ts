import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticatedFromRequest, unauthorizedResponse } from "@/lib/learning/auth";
import { askLearningCoach, isLlmConfigured, type CoachMode } from "@/lib/learning/llm";

const bodySchema = z.object({
  mode: z.enum(["daily", "quiz", "interview", "resources", "explain"]),
  message: z.string().max(4000).optional(),
  progress: z
    .array(
      z.object({
        taskId: z.string(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE", "SKIPPED"]),
        note: z.string().nullable().optional(),
        completedAt: z.string().nullable().optional(),
        updatedAt: z.string().optional(),
      })
    )
    .max(400)
    .optional(),
  sessions: z
    .array(
      z.object({
        id: z.string().optional(),
        date: z.string(),
        minutes: z.number().int().min(0),
        topic: z.string().nullable().optional(),
        note: z.string().nullable().optional(),
        createdAt: z.string().optional(),
      })
    )
    .max(60)
    .optional(),
});

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();
  return NextResponse.json({ success: true, configured: isLlmConfigured() });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();

  if (!isLlmConfigured()) {
    return NextResponse.json(
      { success: false, error: "LLM is not configured. Set OPENAI_API_KEY, OPENAI_URL, and OPENAI_MODEL." },
      { status: 503 }
    );
  }

  try {
    const payload = bodySchema.parse(await request.json());
    const content = await askLearningCoach({
      mode: payload.mode as CoachMode,
      message: payload.message,
      progress: payload.progress ?? [],
      sessions: payload.sessions ?? [],
    });
    return NextResponse.json({ success: true, content });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    console.error("Learning coach error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Coach request failed" },
      { status: 502 }
    );
  }
}

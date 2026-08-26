import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticatedFromRequest, unauthorizedResponse } from "@/lib/learning/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { normalizeStatus } from "@/lib/learning/stats";

const upsertSchema = z.object({
  taskId: z.string().min(1).max(64),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "SKIPPED"]),
  note: z.string().max(2000).optional().nullable(),
});

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();

  if (!isDatabaseConfigured() || !prisma) {
    return NextResponse.json({
      success: true,
      db: false,
      progress: [] as unknown[],
    });
  }

  try {
    const rows = await prisma.taskProgress.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({
      success: true,
      db: true,
      progress: rows.map((r) => ({
        taskId: r.taskId,
        status: r.status,
        note: r.note,
        completedAt: r.completedAt?.toISOString() ?? null,
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Learning progress GET error:", error);
    return NextResponse.json(
      { success: false, db: false, progress: [], error: "Database unavailable" },
      { status: 503 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const data = upsertSchema.parse(body);
    const status = normalizeStatus(data.status);

    if (!isDatabaseConfigured() || !prisma) {
      return NextResponse.json({
        success: true,
        db: false,
        progress: {
          taskId: data.taskId,
          status,
          note: data.note ?? null,
          completedAt: status === "DONE" ? new Date().toISOString() : null,
        },
      });
    }

    const row = await prisma.taskProgress.upsert({
      where: { taskId: data.taskId },
      create: {
        taskId: data.taskId,
        status,
        note: data.note ?? null,
        completedAt: status === "DONE" ? new Date() : null,
      },
      update: {
        status,
        note: data.note ?? null,
        completedAt: status === "DONE" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      db: true,
      progress: {
        taskId: row.taskId,
        status: row.status,
        note: row.note,
        completedAt: row.completedAt?.toISOString() ?? null,
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }
    console.error("Learning progress PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to save progress" }, { status: 500 });
  }
}

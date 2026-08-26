import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticatedFromRequest, unauthorizedResponse } from "@/lib/learning/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const sessionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  minutes: z.number().int().min(1).max(24 * 60),
  topic: z.string().max(200).optional().nullable(),
  note: z.string().max(2000).optional().nullable(),
});

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();

  if (!isDatabaseConfigured() || !prisma) {
    return NextResponse.json({ success: true, db: false, sessions: [] as unknown[] });
  }

  try {
    const rows = await prisma.studySession.findMany({
      orderBy: { date: "desc" },
      take: 365,
    });
    return NextResponse.json({
      success: true,
      db: true,
      sessions: rows.map((r) => ({
        id: r.id,
        date: r.date.toISOString().slice(0, 10),
        minutes: r.minutes,
        topic: r.topic,
        note: r.note,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Learning sessions GET error:", error);
    return NextResponse.json(
      { success: false, db: false, sessions: [], error: "Database unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const data = sessionSchema.parse(body);

    if (!isDatabaseConfigured() || !prisma) {
      return NextResponse.json({
        success: true,
        db: false,
        session: {
          id: `local-${Date.now()}`,
          date: data.date,
          minutes: data.minutes,
          topic: data.topic ?? null,
          note: data.note ?? null,
          createdAt: new Date().toISOString(),
        },
      });
    }

    const row = await prisma.studySession.create({
      data: {
        date: new Date(`${data.date}T00:00:00.000Z`),
        minutes: data.minutes,
        topic: data.topic ?? null,
        note: data.note ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      db: true,
      session: {
        id: row.id,
        date: row.date.toISOString().slice(0, 10),
        minutes: row.minutes,
        topic: row.topic,
        note: row.note,
        createdAt: row.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }
    console.error("Learning sessions POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save session" }, { status: 500 });
  }
}

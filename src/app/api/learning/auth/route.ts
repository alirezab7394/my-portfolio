import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  clearAccessCookie,
  createAccessToken,
  isAuthenticatedFromRequest,
  isPinConfigured,
  setAccessCookie,
  verifyPin,
} from "@/lib/learning/auth";

const pinSchema = z.object({
  pin: z.string().min(1).max(64),
});

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAuthenticatedFromRequest(request),
    pinConfigured: isPinConfigured(),
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!isPinConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "LEARNING_ACCESS_PIN is not set on the server.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { pin } = pinSchema.parse(body);

    if (!verifyPin(pin)) {
      return NextResponse.json({ success: false, error: "Invalid PIN" }, { status: 401 });
    }

    const token = createAccessToken();
    const response = NextResponse.json({ success: true });
    setAccessCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    console.error("Learning auth error:", error);
    return NextResponse.json({ success: false, error: "Auth failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAccessCookie(response);
  return response;
}

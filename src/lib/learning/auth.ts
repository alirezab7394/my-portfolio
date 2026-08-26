import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const LEARNING_COOKIE_NAME = "learning_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

function getPin(): string | undefined {
  return process.env.LEARNING_ACCESS_PIN;
}

function getCookieSecret(): string {
  return process.env.LEARNING_COOKIE_SECRET || process.env.LEARNING_ACCESS_PIN || "dev-learning-secret";
}

export function isPinConfigured(): boolean {
  return Boolean(getPin());
}

export function verifyPin(pin: string): boolean {
  const expected = getPin();
  if (!expected) return false;
  try {
    const a = Buffer.from(pin);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function createAccessToken(): string {
  const secret = getCookieSecret();
  const payload = `learning:${Date.now()}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifyAccessToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;
  try {
    const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
    if (!payload.startsWith("learning:")) return false;
    const expected = createHmac("sha256", getCookieSecret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function setAccessCookie(response: NextResponse, token: string) {
  response.cookies.set(LEARNING_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearAccessCookie(response: NextResponse) {
  response.cookies.set(LEARNING_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isAuthenticatedFromCookies(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(LEARNING_COOKIE_NAME)?.value;
  return verifyAccessToken(token);
}

export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(LEARNING_COOKIE_NAME)?.value;
  return verifyAccessToken(token);
}

export function unauthorizedResponse() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

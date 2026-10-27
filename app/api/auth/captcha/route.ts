import { randomBytes } from "node:crypto";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { captchaError, jsonBody, verifyCaptcha } from "@/lib/captcha";
import { storageReady } from "@/lib/store";
import { authReady } from "@/lib/auth-config";
// This preflight issues a short-lived, single-use permit consumed by NextAuth's
// Google sign-in or sign-out POST. Calling NextAuth directly cannot bypass it.
export async function POST(request: Request) {
  const body = await jsonBody(request);
  const action = body?.action;
  if (action !== "google_signin" && action !== "signout")
    return NextResponse.json(
      { error: "Invalid security check." },
      { status: 400 },
    );
  const result = await verifyCaptcha(body, action);
  if (!result.ok) return captchaError(result);
  if (!storageReady() || !authReady())
    return NextResponse.json(
      { error: "Sign-in security is not configured." },
      { status: 503 },
    );
  try {
    const nonce = randomBytes(32).toString("base64url");
    await kv.set(`auth:captcha:${action}:${nonce}`, "1", { ex: 120 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(`sc-${action}`, nonce, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/auth",
      maxAge: 120,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Sign-in security is unavailable." },
      { status: 503 },
    );
  }
}

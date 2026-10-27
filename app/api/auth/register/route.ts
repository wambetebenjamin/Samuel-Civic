import { NextResponse } from "next/server";
import { captchaError, jsonBody, verifyCaptcha } from "@/lib/captcha";
import { registerSchema } from "@/lib/validation";
import { authReady } from "@/lib/auth-config";
import {
  rateLimit,
  registerResident,
  requestIp,
  storageReady,
} from "@/lib/store";
export async function POST(request: Request) {
  const body = await jsonBody(request);
  const captcha = await verifyCaptcha(body, "register");
  if (!captcha.ok) return captchaError(captcha);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please check the information you entered." },
      { status: 400 },
    );
  if (!storageReady() || !authReady())
    return NextResponse.json(
      { error: "Registration is not configured yet." },
      { status: 503 },
    );
  try {
    if (!(await rateLimit(`register:${requestIp(request)}`, 8, 3600)))
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    const created = await registerResident(parsed.data);
    if (!created)
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 },
      );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "We could not create your account. Please try again." },
      { status: 503 },
    );
  }
}

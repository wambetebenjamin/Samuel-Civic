import { NextResponse } from "next/server";
import { captchaError, jsonBody, verifyCaptcha } from "@/lib/captcha";
import { suggestionSchema } from "@/lib/validation";
import { mailReady, sendMail } from "@/lib/mail";
import { rateLimit, requestIp, storageReady } from "@/lib/store";
export async function POST(request: Request) {
  const body = await jsonBody(request);
  const captcha = await verifyCaptcha(body, "office_suggest");
  if (!captcha.ok) return captchaError(captcha);
  const parsed = suggestionSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please complete all fields with a little more detail." },
      { status: 400 },
    );
  if (!storageReady() || !mailReady() || !process.env.ADMIN_EMAIL)
    return NextResponse.json(
      { error: "Suggestions are not configured yet. Please use WhatsApp." },
      { status: 503 },
    );
  try {
    if (!(await rateLimit(`suggestion:${requestIp(request)}`, 10, 3600)))
      return NextResponse.json(
        { error: "Too many suggestions. Please try again later." },
        { status: 429 },
      );
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      replyTo: parsed.data.email,
      subject: "Samuel Civic office correction",
      text: `From: ${parsed.data.name}\nEmail: ${parsed.data.email}\nOffice: ${parsed.data.office}\n\n${parsed.data.correction}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We could not send your suggestion. Please use WhatsApp." },
      { status: 503 },
    );
  }
}

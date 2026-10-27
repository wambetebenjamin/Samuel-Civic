import { NextResponse } from "next/server";
import { captchaError, jsonBody, verifyCaptcha } from "@/lib/captcha";
import { enquirySchema } from "@/lib/validation";
import { mailReady, sendMail } from "@/lib/mail";
import { rateLimit, requestIp, storageReady } from "@/lib/store";
export async function POST(request: Request) {
  const body = await jsonBody(request);
  const captcha = await verifyCaptcha(body, "enquiry");
  if (!captcha.ok) return captchaError(captcha);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please check your name, email and message." },
      { status: 400 },
    );
  if (!storageReady() || !mailReady() || !process.env.ADMIN_EMAIL)
    return NextResponse.json(
      { error: "The contact form is not configured yet. Please use WhatsApp." },
      { status: 503 },
    );
  try {
    if (!(await rateLimit(`enquiry:${requestIp(request)}`, 10, 3600)))
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 },
      );
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      replyTo: parsed.data.email,
      subject: "Samuel Civic enquiry",
      text: `From: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We could not send your enquiry. Please use WhatsApp." },
      { status: 503 },
    );
  }
}

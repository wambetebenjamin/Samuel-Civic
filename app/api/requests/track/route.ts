import { NextResponse } from "next/server";
import { captchaError, verifyCaptcha } from "@/lib/captcha";
import { trackSchema } from "@/lib/validation";
import {
  getRequestByReference,
  rateLimit,
  requestIp,
  storageReady,
} from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const captcha = await verifyCaptcha(
    {
      captchaToken: request.headers.get("x-recaptcha-token"),
      captchaVersion: request.headers.get("x-recaptcha-version") || "v3",
    },
    "track",
  );
  if (!captcha.ok) return captchaError(captcha);
  const parsed = trackSchema.safeParse({
    ref: new URL(request.url).searchParams.get("ref"),
  });
  if (!parsed.success)
    return NextResponse.json(
      { error: "Enter a valid reference number." },
      { status: 400 },
    );
  if (!storageReady())
    return NextResponse.json(
      { error: "Tracking is not configured yet." },
      { status: 503 },
    );
  try {
    if (!(await rateLimit(`track:${requestIp(request)}`, 10, 60)))
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a minute." },
        { status: 429 },
      );
    const record = await getRequestByReference(parsed.data.ref);
    if (!record)
      return NextResponse.json(
        { error: "No request was found for that reference." },
        { status: 404 },
      );
    return NextResponse.json(
      {
        reference: record.reference,
        status: record.status,
        updatedAt: record.updatedAt,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Tracking is temporarily unavailable." },
      { status: 503 },
    );
  }
}

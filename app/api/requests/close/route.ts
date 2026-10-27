import { NextResponse } from "next/server";
import { getSession } from "@/auth";
import { captchaError, jsonBody, verifyCaptcha } from "@/lib/captcha";
import { requestIdSchema } from "@/lib/validation";
import {
  closeRequest,
  getRequest,
  RequestBusyError,
  storageReady,
  withRequestLock,
} from "@/lib/store";
export async function POST(request: Request) {
  const body = await jsonBody(request);
  const captcha = await verifyCaptcha(body, "request_close");
  if (!captcha.ok) return captchaError(captcha);
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const parsed = requestIdSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (!storageReady())
    return NextResponse.json(
      { error: "Request storage is not configured." },
      { status: 503 },
    );
  try {
    return await withRequestLock(parsed.data.requestId, async () => {
      const record = await getRequest(parsed.data.requestId);
      if (!record || record.ownerId !== session.user.id)
        return NextResponse.json(
          { error: "Request not found." },
          { status: 404 },
        );
      if (record.status !== "Closed") await closeRequest(record);
      return NextResponse.json({ ok: true });
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof RequestBusyError
            ? "This request is being updated. Please try again."
            : "We could not close this request.",
      },
      { status: error instanceof RequestBusyError ? 409 : 503 },
    );
  }
}

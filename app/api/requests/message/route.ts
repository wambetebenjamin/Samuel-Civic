import { NextResponse } from "next/server";
import { getSession } from "@/auth";
import { captchaError, jsonBody, verifyCaptcha } from "@/lib/captcha";
import { messageSchema } from "@/lib/validation";
import {
  addMessage,
  getRequest,
  rateLimit,
  RequestBusyError,
  storageReady,
  withRequestLock,
} from "@/lib/store";
export async function POST(request: Request) {
  const body = await jsonBody(request);
  const captcha = await verifyCaptcha(body, "request_message");
  if (!captcha.ok) return captchaError(captcha);
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please enter a valid message." },
      { status: 400 },
    );
  if (!storageReady())
    return NextResponse.json(
      { error: "Request storage is not configured." },
      { status: 503 },
    );
  try {
    if (!(await rateLimit(`message:${session.user.id}`, 30, 3600)))
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 },
      );
    return await withRequestLock(parsed.data.requestId, async () => {
      const record = await getRequest(parsed.data.requestId);
      if (!record || record.ownerId !== session.user.id)
        return NextResponse.json(
          { error: "Request not found." },
          { status: 404 },
        );
      if (record.status === "Closed")
        return NextResponse.json(
          { error: "This request is closed." },
          { status: 400 },
        );
      const message = await addMessage(record, parsed.data.message);
      return NextResponse.json({ message }, { status: 201 });
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof RequestBusyError
            ? "This request is being updated. Please try again."
            : "We could not save your note.",
      },
      { status: error instanceof RequestBusyError ? 409 : 503 },
    );
  }
}

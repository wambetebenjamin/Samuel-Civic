import { limitedFormData, PayloadTooLargeError } from "@/lib/body";
import { NextResponse } from "next/server";
import { getSession } from "@/auth";
import { captchaError, verifyCaptcha } from "@/lib/captcha";
import { requestIdSchema } from "@/lib/validation";
import {
  getRequest,
  rateLimit,
  RequestBusyError,
  saveRequest,
  storageReady,
  withRequestLock,
} from "@/lib/store";
import {
  checkFiles,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  removeFiles,
  uploadFiles,
  uploadsReady,
} from "@/lib/files";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 3_500_000)
    return NextResponse.json(
      { error: "The upload is too large." },
      { status: 413 },
    );
  let form: FormData;
  try {
    form = await limitedFormData(request);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof PayloadTooLargeError
            ? "The upload is too large."
            : "Invalid form.",
      },
      { status: error instanceof PayloadTooLargeError ? 413 : 400 },
    );
  }
  const captcha = await verifyCaptcha(
    {
      captchaToken: form.get("captchaToken"),
      captchaVersion: form.get("captchaVersion"),
    },
    "request_upload",
  );
  if (!captcha.ok) return captchaError(captcha);
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const parsed = requestIdSchema.safeParse({
    requestId: form.get("requestId"),
  });
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (!storageReady() || !uploadsReady())
    return NextResponse.json(
      { error: "Secure document storage is not configured." },
      { status: 503 },
    );
  const files = form
    .getAll("files")
    .filter((v): v is File => v instanceof File && v.size > 0);
  if (!files.length)
    return NextResponse.json(
      { error: "Choose a PDF or JPG file." },
      { status: 400 },
    );
  try {
    await checkFiles(files);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid file." },
      { status: 400 },
    );
  }
  try {
    if (!(await rateLimit(`upload:${session.user.id}`, 30, 3600)))
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
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
      if (
        record.documents.length + files.length > MAX_FILES ||
        record.documents.reduce((n, f) => n + f.size, 0) +
          files.reduce((n, f) => n + f.size, 0) >
          MAX_TOTAL_BYTES
      )
        return NextResponse.json(
          {
            error: "Each request can contain up to three files and 3 MB total.",
          },
          { status: 400 },
        );
      const saved = await uploadFiles(files);
      try {
        await saveRequest({
          ...record,
          documents: [...record.documents, ...saved],
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        await removeFiles(saved);
        throw error;
      }
      return NextResponse.json({ ok: true }, { status: 201 });
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof RequestBusyError
            ? "This request is being updated. Please try again."
            : "We could not upload the document.",
      },
      { status: error instanceof RequestBusyError ? 409 : 503 },
    );
  }
}

import { limitedFormData, PayloadTooLargeError } from "@/lib/body";
import { NextResponse } from "next/server";
import { getSession } from "@/auth";
import { captchaError, verifyCaptcha } from "@/lib/captcha";
import { requestSchema } from "@/lib/validation";
import { createRequest, rateLimit, requestIp, storageReady } from "@/lib/store";
import {
  checkFiles,
  encryptPrivateText,
  privateTextReady,
  removeFiles,
  uploadFiles,
} from "@/lib/files";
import { mailReady, sendMail } from "@/lib/mail";
import { getService } from "@/lib/directory";
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
    "request_create",
  );
  if (!captcha.ok) return captchaError(captcha);
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const input = Object.fromEntries(
    [...form.entries()].filter(([key]) => key !== "files"),
  );
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please check the request details and try again." },
      { status: 400 },
    );
  const files = form
    .getAll("files")
    .filter((v): v is File => v instanceof File && v.size > 0);
  if (!storageReady() || !mailReady())
    return NextResponse.json(
      { error: "Request storage or confirmation email is not configured yet." },
      { status: 503 },
    );
  try {
    if (
      !(await rateLimit(
        `create:${session.user.id}:${requestIp(request)}`,
        12,
        3600,
      ))
    )
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
  } catch {
    return NextResponse.json(
      { error: "Request storage is unavailable." },
      { status: 503 },
    );
  }
  try {
    await checkFiles(files);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The files could not be checked.",
      },
      { status: 400 },
    );
  }
  if (parsed.data.nationalId && !privateTextReady())
    return NextResponse.json(
      {
        error:
          "Secure storage for ID information is not configured. Leave it blank or try later.",
      },
      { status: 503 },
    );
  let documents: Awaited<ReturnType<typeof uploadFiles>> = [];
  try {
    const nationalId = parsed.data.nationalId
      ? encryptPrivateText(parsed.data.nationalId)
      : "";
    documents = await uploadFiles(files);
    const record = await createRequest({
      ...parsed.data,
      nationalId,
      ownerId: session.user.id,
      documents,
    });
    let emailSent = true;
    try {
      await sendMail({
        to: record.email,
        subject: `Your Samuel Civic reference ${record.reference}`,
        text: `Hello ${record.name},\n\nYour request about ${getService(record.service)?.name || "a county service"} has been saved in Samuel Civic. Your reference is ${record.reference}.\n\nSamuel Civic is an independent tool. This request has not been automatically sent to a county office. Contact the relevant office directly and keep your reference for your records.\n\nThank you,\nSamuel Civic`,
      });
    } catch {
      emailSent = false;
    }
    return NextResponse.json(
      { id: record.id, reference: record.reference, emailSent },
      { status: 201 },
    );
  } catch {
    if (documents.length) await removeFiles(documents);
    return NextResponse.json(
      { error: "We could not save the request. Please try again." },
      { status: 503 },
    );
  }
}

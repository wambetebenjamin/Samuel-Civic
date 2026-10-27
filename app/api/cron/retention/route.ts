import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { deleteFilesStrict } from "@/lib/files";
import {
  dueForRetention,
  forgetRetentionIndex,
  getRequest,
  removeRequestRecords,
  storageReady,
  withRequestLock,
} from "@/lib/store";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Vercel Cron supplies Authorization: Bearer <CRON_SECRET>. Fail closed if unset.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret || ""}`;
  if (
    !secret ||
    Buffer.byteLength(actual) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  )
    return new NextResponse("Unauthorized", { status: 401 });
  if (!storageReady())
    return NextResponse.json(
      { error: "Storage unavailable." },
      { status: 503 },
    );
  try {
    const ids = await dueForRetention();
    let deleted = 0,
      failed = 0;
    for (const id of ids) {
      try {
        await withRequestLock(id, async () => {
          const record = await getRequest(id);
          if (!record) {
            await forgetRetentionIndex(id);
            return;
          }
          if (record.status !== "Closed") {
            await forgetRetentionIndex(id);
            return;
          }
          await deleteFilesStrict(record.documents);
          await removeRequestRecords(record);
          deleted++;
        });
      } catch {
        failed++;
      }
    }
    return NextResponse.json(
      { deleted, failed },
      { status: failed ? 503 : 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Retention job unavailable." },
      { status: 503 },
    );
  }
}

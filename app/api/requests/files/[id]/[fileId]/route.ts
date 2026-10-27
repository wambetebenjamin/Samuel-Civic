import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/auth";
import { getRequest } from "@/lib/store";
import { downloadFile } from "@/lib/files";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id)
    return new NextResponse("Please sign in.", { status: 401 });
  const parsed = z
    .object({ id: z.string().uuid(), fileId: z.string().uuid() })
    .safeParse(await params);
  if (!parsed.success) return new NextResponse("Not found.", { status: 404 });
  try {
    const record = await getRequest(parsed.data.id);
    if (!record || record.ownerId !== session.user.id)
      return new NextResponse("Not found.", { status: 404 });
    const file = record.documents.find((d) => d.id === parsed.data.fileId);
    if (!file) return new NextResponse("Not found.", { status: 404 });
    const bytes = await downloadFile(file);
    if (!bytes) return new NextResponse("Not found.", { status: 404 });
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `attachment; filename="${file.name.replace(/["\\]/g, "_")}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Document unavailable.", { status: 503 });
  }
}

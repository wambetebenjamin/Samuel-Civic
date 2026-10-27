import { NextResponse } from "next/server";
import { getSession } from "@/auth";
export const dynamic = "force-dynamic";
export async function GET() {
  const session = await getSession();
  return NextResponse.json(
    { signedIn: Boolean(session?.user?.id) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/auth";
import { storageReady } from "@/lib/store";
import { readLimited } from "@/lib/body";
export const GET = handlers.GET;
export async function POST(request: NextRequest) {
  try {
    await readLimited(request.clone(), 16_384);
  } catch {
    return NextResponse.json(
      { url: new URL("/login?error=InvalidRequest", request.url).toString() },
      { status: 413 },
    );
  }
  const path = request.nextUrl.pathname.replace(/\/$/, "");
  // Credentials are verified inside authorize(), which also checks reCAPTCHA.
  if (path.endsWith("/callback/credentials")) return handlers.POST(request);
  const action = path.endsWith("/signin/google")
    ? "google_signin"
    : path.endsWith("/signout")
      ? "signout"
      : null;
  if (!action || !storageReady())
    return NextResponse.json(
      {
        url: new URL(
          "/login?error=SecurityCheckRequired",
          request.url,
        ).toString(),
      },
      { status: 403 },
    );
  const nonce = request.cookies.get(`sc-${action}`)?.value;
  if (!nonce || !/^[A-Za-z0-9_-]{43}$/.test(nonce))
    return NextResponse.json(
      {
        url: new URL(
          "/login?error=SecurityCheckRequired",
          request.url,
        ).toString(),
      },
      { status: 403 },
    );
  try {
    const permit = await kv.getdel(`auth:captcha:${action}:${nonce}`);
    if (!permit)
      return NextResponse.json(
        {
          url: new URL(
            "/login?error=SecurityCheckRequired",
            request.url,
          ).toString(),
        },
        { status: 403 },
      );
    const response = await handlers.POST(request);
    const headers = new Headers(response.headers);
    headers.append(
      "Set-Cookie",
      `sc-${action}=; Path=/api/auth; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    );
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch {
    return NextResponse.json(
      {
        url: new URL(
          "/login?error=SecurityCheckUnavailable",
          request.url,
        ).toString(),
      },
      { status: 503 },
    );
  }
}

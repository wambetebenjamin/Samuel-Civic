import "server-only";
import { NextResponse } from "next/server";
import { captchaSchema } from "@/lib/validation";
import { readLimited } from "@/lib/body";

type Result =
  | { ok: true }
  | { ok: false; status: number; error?: string; requireV2?: boolean };
export async function verifyCaptcha(
  input: unknown,
  expectedAction: string,
): Promise<Result> {
  const parsed = captchaSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      status: 400,
      error: "Please complete the security check.",
    };
  const { captchaToken, captchaVersion } = parsed.data;
  const secret =
    captchaVersion === "v2"
      ? process.env.RECAPTCHA_V2_SECRET_KEY
      : process.env.RECAPTCHA_SECRET_KEY;
  if (!secret)
    return {
      ok: false,
      status: 503,
      error:
        "Security verification is not configured yet. Please try again later or contact us.",
    };
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: captchaToken }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok)
      return {
        ok: false,
        status: 503,
        error: "Security verification is temporarily unavailable.",
      };
    const result = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      hostname?: string;
    };
    if (!result.success)
      return {
        ok: false,
        status: 400,
        error: "Security verification failed. Please try again.",
      };
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    if (!site && process.env.NODE_ENV === "production")
      return {
        ok: false,
        status: 503,
        error: "The site security configuration is incomplete.",
      };
    if (site) {
      let host: string;
      try {
        host = new URL(site).hostname;
      } catch {
        return {
          ok: false,
          status: 503,
          error: "The site security configuration is invalid.",
        };
      }
      if (result.hostname !== host)
        return {
          ok: false,
          status: 400,
          error: "Security verification could not confirm this site.",
        };
    }
    if (captchaVersion === "v3") {
      if (result.action !== expectedAction || typeof result.score !== "number")
        return {
          ok: false,
          status: 400,
          error: "Security verification failed. Please try again.",
        };
      if (result.score < 0.5)
        return { ok: false, status: 403, requireV2: true };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 503,
      error: "Security verification is temporarily unavailable.",
    };
  }
}
export function captchaError(result: Exclude<Result, { ok: true }>) {
  return NextResponse.json(
    result.requireV2 ? { requireV2: true } : { error: result.error },
    { status: result.status },
  );
}
export async function jsonBody(
  request: Request,
  max = 16_384,
): Promise<Record<string, unknown> | null> {
  try {
    const text = new TextDecoder().decode(await readLimited(request, max));
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

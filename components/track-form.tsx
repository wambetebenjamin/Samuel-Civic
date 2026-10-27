"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import {
  CaptchaChallenge,
  CaptchaNotice,
  useCaptcha,
} from "@/components/recaptcha";
export function TrackForm() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<{
    reference: string;
    status: string;
    updatedAt: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const captcha = useCaptcha("track");
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const token = await captcha.getToken();
      const response = await fetch(
        `/api/requests/track?ref=${encodeURIComponent(ref.trim())}`,
        {
          headers: {
            "x-recaptcha-token": token.captchaToken,
            "x-recaptcha-version": token.captchaVersion,
          },
          cache: "no-store",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(captcha.handle(data));
        return;
      }
      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "We could not check that reference.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form onSubmit={submit}>
        <label className="form-label" htmlFor="reference">
          Request reference number
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="reference"
            className="field"
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            placeholder="e.g. SC-2026-123456ABCDEF"
            required
            maxLength={20}
          />
          <button
            className="btn-civic btn-primary-civic shrink-0"
            disabled={busy}
          >
            <Search size={17} />
            {busy ? "Checking..." : "Check status"}
          </button>
        </div>
        <CaptchaChallenge
          key={captcha.challengeKey}
          required={captcha.requireV2}
          onToken={captcha.setV2Token}
        />
        {error && (
          <p className="mt-3 text-sm text-[#a23020]" role="alert">
            {error}
          </p>
        )}
        <CaptchaNotice />
      </form>
      {result && (
        <div
          className="mt-7 rounded-lg border border-[#dfe4fd] bg-[#f7f8fe] p-5"
          aria-live="polite"
        >
          <p className="mb-1 text-xs">Reference: {result.reference}</p>
          <h2 className="mb-2 text-2xl">{result.status}</h2>
          <p className="mb-0 text-sm">
            Last updated{" "}
            {new Date(result.updatedAt).toLocaleDateString("en-KE", {
              dateStyle: "long",
            })}
            . Sign in to see your full request and documents.
          </p>
          <Link className="text-link mt-2" href="/requests">
            My requests <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </>
  );
}

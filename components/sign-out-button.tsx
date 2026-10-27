"use client";
import { useState } from "react";
import { CaptchaChallenge, useCaptcha } from "@/components/recaptcha";
export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const captcha = useCaptcha("signout");
  async function leave() {
    setError("");
    setBusy(true);
    try {
      const token = await captcha.getToken();
      const response = await fetch("/api/auth/captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...token, action: "signout" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(captcha.handle(data));
        return;
      }
      const csrf = await fetch("/api/auth/csrf", { cache: "no-store" });
      const csrfData = await csrf.json();
      if (!csrf.ok || !csrfData.csrfToken)
        throw new Error("Sign-out security is unavailable.");
      const result = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Auth-Return-Redirect": "1",
        },
        body: new URLSearchParams({
          csrfToken: csrfData.csrfToken,
          callbackUrl: "/",
        }),
      });
      if (!result.ok) throw new Error("Could not sign out. Please try again.");
      window.location.assign("/");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not sign out. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="relative">
      <button
        type="button"
        onClick={leave}
        disabled={busy}
        className="btn-civic btn-outline-civic !min-h-11 !px-4 !py-2 !text-xs"
      >
        {busy ? "Signing out..." : "Sign out"}
      </button>
      {(error || captcha.requireV2) && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(320px,85vw)] rounded-lg border border-[#dfe4fd] bg-white p-4 shadow-lg">
          <p className="mb-2 text-sm" role="alert">
            {error}
          </p>
          <CaptchaChallenge
            key={captcha.challengeKey}
            required={captcha.requireV2}
            onToken={captcha.setV2Token}
          />
          {captcha.requireV2 && (
            <button
              className="btn-civic btn-primary-civic"
              disabled={busy}
              onClick={leave}
            >
              Complete sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}

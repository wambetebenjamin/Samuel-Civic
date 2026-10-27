"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type CaptchaVersion = "v3" | "v2";
type CaptchaData = { captchaToken: string; captchaVersion: CaptchaVersion };
type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (key: string, options: { action: string }) => Promise<string>;
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => number;
  reset: (id: number) => void;
};
declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    __samuelCaptchaPromise?: Promise<Grecaptcha>;
  }
}
const v3Key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
const v2Key = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || "";
function loadCaptcha(): Promise<Grecaptcha> {
  if (!v3Key)
    return Promise.reject(
      new Error(
        "Security verification is not configured yet. Please contact us on WhatsApp.",
      ),
    );
  if (window.__samuelCaptchaPromise) return window.__samuelCaptchaPromise;
  window.__samuelCaptchaPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      window.__samuelCaptchaPromise = undefined;
      reject(
        new Error("Security verification did not load. Please try again."),
      );
    }, 10000);
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(v3Key)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.grecaptcha) {
        window.clearTimeout(timeout);
        window.__samuelCaptchaPromise = undefined;
        reject(new Error("Security verification did not load."));
        return;
      }
      window.grecaptcha.ready(() => {
        window.clearTimeout(timeout);
        resolve(window.grecaptcha!);
      });
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      window.__samuelCaptchaPromise = undefined;
      reject(
        new Error("Security verification is unavailable. Please try again."),
      );
    };
    document.head.appendChild(script);
  });
  return window.__samuelCaptchaPromise;
}
export function useCaptcha(action: string) {
  const [requireV2, setRequireV2] = useState(false);
  const [v2Token, setV2Token] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const getToken = useCallback(async (): Promise<CaptchaData> => {
    if (requireV2) {
      if (!v2Key)
        throw new Error(
          "Additional verification is unavailable. Please contact us on WhatsApp.",
        );
      if (!v2Token)
        throw new Error("Please complete the visible security check.");
      return { captchaToken: v2Token, captchaVersion: "v2" };
    }
    const captcha = await loadCaptcha();
    return {
      captchaToken: await captcha.execute(v3Key, { action }),
      captchaVersion: "v3",
    };
  }, [action, requireV2, v2Token]);
  const reset = useCallback(() => {
    setV2Token("");
    setChallengeKey((n) => n + 1);
  }, []);
  const handle = useCallback(
    (data: { requireV2?: boolean; error?: string }) => {
      if (data.requireV2) {
        setRequireV2(true);
        reset();
        return "Please complete the additional security check below.";
      }
      if (requireV2) reset();
      return data.error || "Something went wrong. Please try again.";
    },
    [requireV2, reset],
  );
  return { getToken, handle, reset, requireV2, setV2Token, challengeKey };
}
export function CaptchaChallenge({
  required,
  onToken,
}: {
  required: boolean;
  onToken: (token: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<number | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!required || !ref.current || widget.current !== null) return;
    if (!v2Key) {
      setError(
        "Additional verification is not configured. Please contact us on WhatsApp.",
      );
      return;
    }
    let cancelled = false;
    void loadCaptcha()
      .then((captcha) => {
        if (cancelled || !ref.current || widget.current !== null) return;
        widget.current = captcha.render(ref.current, {
          sitekey: v2Key,
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
      })
      .catch(() =>
        setError("The security check could not load. Please try again."),
      );
    return () => {
      cancelled = true;
    };
  }, [required, onToken]);
  if (!required) return null;
  return (
    <div className="my-4">
      <p className="mb-2 text-sm">
        Please complete this additional security check.
      </p>
      <div ref={ref} />
      {error && (
        <p className="mt-2 text-sm text-[#a23020]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export function CaptchaNotice() {
  return (
    <p className="mt-4 text-xs leading-relaxed">
      This form is protected by reCAPTCHA and the Google{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noreferrer"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}

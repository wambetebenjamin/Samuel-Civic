"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { counties } from "@/lib/directory";
import {
  CaptchaChallenge,
  CaptchaNotice,
  useCaptcha,
} from "@/components/recaptcha";

export function LoginForm({
  callbackUrl,
  googleEnabled,
}: {
  callbackUrl: string;
  googleEnabled: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const captcha = useCaptcha("login");
  const googleCaptcha = useCaptcha("google_signin");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const verification = await captcha.getToken();
      const result = await signIn("credentials", {
        email,
        password,
        ...verification,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        if (result.code === "captcha_required") {
          setError(captcha.handle({ requireV2: true }));
          return;
        }
        captcha.reset();
        setError(
          result.code === "captcha_unavailable"
            ? "Security verification is unavailable or failed. Please try again."
            : "We could not sign you in. Check your email and password.",
        );
        return;
      }
      window.location.assign(callbackUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not sign you in.");
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    setError("");
    setBusy(true);
    try {
      const token = await googleCaptcha.getToken();
      const response = await fetch("/api/auth/captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...token, action: "google_signin" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(googleCaptcha.handle(data));
        return;
      }
      const result = await signIn("google", { callbackUrl, redirect: false });
      if (!result.ok || result.error || !result.url)
        throw new Error("Google sign-in is unavailable. Please try again.");
      const destination = new URL(result.url, window.location.origin);
      if (
        destination.protocol !== "https:" ||
        destination.hostname !== "accounts.google.com"
      )
        throw new Error(
          "Google sign-in returned an unexpected destination. Check the site URL configuration.",
        );
      window.location.assign(destination.href);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Google sign-in is unavailable.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      {googleEnabled && (
        <>
          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="btn-civic btn-outline-civic w-full"
          >
            <span className="font-heading text-lg font-bold text-primary">
              G
            </span>{" "}
            Continue with Google
          </button>
          <CaptchaChallenge
            key={googleCaptcha.challengeKey}
            required={googleCaptcha.requireV2}
            onToken={googleCaptcha.setV2Token}
          />
          <div className="my-5 flex items-center gap-3 text-xs text-[#6c757d]">
            <span className="h-px flex-1 bg-[#dfe4fd]" />
            or sign in with email
            <span className="h-px flex-1 bg-[#dfe4fd]" />
          </div>
        </>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="form-label" htmlFor="login-email">
            Email address
          </label>
          <input
            className="field"
            id="login-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="login-password">
            Password
          </label>
          <div className="relative">
            <input
              className="field !pr-14"
              id="login-password"
              type={visible ? "text" : "password"}
              autoComplete="current-password"
              required
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#6c757d]"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible(!visible)}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <CaptchaChallenge
          key={captcha.challengeKey}
          required={captcha.requireV2}
          onToken={captcha.setV2Token}
        />
        {error && (
          <p className="text-sm text-[#a23020]" role="alert">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="btn-civic btn-primary-civic w-full"
          type="submit"
        >
          {busy ? "Signing in..." : "Sign in"} <ArrowRight size={16} />
        </button>
      </form>
      <CaptchaNotice />
      <p className="mt-5 text-sm">
        New here?{" "}
        <Link
          href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-bold"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
export function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const captcha = useCaptcha("register");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const form = new FormData(event.currentTarget);
      const verification = await captcha.getToken();
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form.entries()),
          ...verification,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(captcha.handle(data));
        return;
      }
      setSuccess(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "We could not create your account.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="rounded-lg border border-[#dfe4fd] bg-[#f7f8fe] p-6">
        <h2 className="text-2xl">Your account is ready</h2>
        <p className="text-sm">
          You can now sign in to save and track requests.
        </p>
        <Link
          className="btn-civic btn-primary-civic"
          href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        >
          Sign in <ArrowRight size={16} />
        </Link>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="form-label" htmlFor="reg-name">
          Full name
        </label>
        <input
          className="field"
          id="reg-name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="reg-email">
          Email address
        </label>
        <input
          className="field"
          id="reg-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="reg-phone">
          Phone number
        </label>
        <input
          className="field"
          id="reg-phone"
          name="phone"
          type="tel"
          required
          minLength={7}
          maxLength={30}
          autoComplete="tel"
          placeholder="e.g. 0712 345 678"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="reg-county">
          County of residence
        </label>
        <select
          className="field"
          id="reg-county"
          name="county"
          required
          defaultValue=""
        >
          <option value="" disabled>
            Select your county
          </option>
          {counties.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="reg-password">
          Password
        </label>
        <input
          className="field"
          id="reg-password"
          name="password"
          type="password"
          required
          minLength={10}
          maxLength={128}
          autoComplete="new-password"
        />
        <p className="mt-1 text-xs">Use at least 10 characters.</p>
      </div>
      <p className="text-xs leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/legal/terms">terms</Link> and acknowledge our{" "}
        <Link href="/legal/privacy-policy">privacy policy</Link>.
      </p>
      <CaptchaChallenge
        key={captcha.challengeKey}
        required={captcha.requireV2}
        onToken={captcha.setV2Token}
      />
      {error && (
        <p className="text-sm text-[#a23020]" role="alert">
          {error}
        </p>
      )}
      <button
        disabled={busy}
        type="submit"
        className="btn-civic btn-primary-civic w-full"
      >
        {busy ? "Creating account..." : "Create account"}{" "}
        <ArrowRight size={16} />
      </button>
      <CaptchaNotice />
      <p className="text-sm">
        Already have an account?{" "}
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-bold"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

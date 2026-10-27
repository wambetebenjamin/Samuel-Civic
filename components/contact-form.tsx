"use client";
import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import {
  CaptchaChallenge,
  CaptchaNotice,
  useCaptcha,
} from "@/components/recaptcha";
export function ContactForm({
  variant,
  initialOffice = "",
}: {
  variant: "enquiry" | "suggest";
  initialOffice?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const captcha = useCaptcha(
    variant === "enquiry" ? "enquiry" : "office_suggest",
  );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData(e.currentTarget);
      const token = await captcha.getToken();
      const response = await fetch(
        variant === "enquiry" ? "/api/send-enquiry" : "/api/offices/suggest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...Object.fromEntries(form.entries()),
            ...token,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(captcha.handle(data));
        return;
      }
      setSuccess(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "We could not send your message.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="rounded-lg bg-[#f7f8fe] p-5 text-sm" role="status">
        <strong className="text-ink">Thank you for getting in touch.</strong>
        <p className="mb-0 mt-1">
          Your {variant === "enquiry" ? "enquiry" : "suggestion"} has been sent
          to our team.
        </p>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="form-label" htmlFor={`${variant}-name`}>
            Your name
          </label>
          <input
            className="field"
            name="name"
            id={`${variant}-name`}
            required
            minLength={2}
            maxLength={100}
          />
        </div>
        <div>
          <label className="form-label" htmlFor={`${variant}-email`}>
            Email address
          </label>
          <input
            className="field"
            name="email"
            id={`${variant}-email`}
            type="email"
            required
            maxLength={254}
          />
        </div>
      </div>
      {variant === "suggest" && (
        <div>
          <label className="form-label" htmlFor="suggest-office">
            Office name
          </label>
          <input
            className="field"
            name="office"
            id="suggest-office"
            defaultValue={initialOffice}
            required
            maxLength={150}
          />
        </div>
      )}
      <div>
        <label className="form-label" htmlFor={`${variant}-message`}>
          {variant === "enquiry"
            ? "How can we help?"
            : "What should be corrected?"}
        </label>
        <textarea
          className="field"
          name={variant === "enquiry" ? "message" : "correction"}
          id={`${variant}-message`}
          required
          minLength={10}
          maxLength={2000}
        />
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
      <button className="btn-civic btn-primary-civic" disabled={busy}>
        <Send size={16} />
        {busy
          ? "Sending..."
          : variant === "enquiry"
            ? "Send enquiry"
            : "Send suggestion"}
      </button>
      <CaptchaNotice />
    </form>
  );
}

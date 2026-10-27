"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  Info,
} from "lucide-react";
import { counties, offices, services } from "@/lib/directory";
import {
  CaptchaChallenge,
  CaptchaNotice,
  useCaptcha,
} from "@/components/recaptcha";

type FormState = {
  county: string;
  service: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  description: string;
  office: string;
};
export function RequestForm({
  initial,
}: {
  initial: {
    county: string;
    service: string;
    office: string;
    name: string;
    email: string;
  };
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    ...initial,
    phone: "",
    nationalId: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<{
    id: string;
    reference: string;
    emailSent: boolean;
  } | null>(null);
  const captcha = useCaptcha("request_create");
  const set = (key: keyof FormState, value: string) =>
    setForm((f) => ({
      ...f,
      [key]: value,
      ...(key === "county" ? { office: "" } : {}),
    }));
  const names = [
    "County and service",
    "Your details",
    "Request details",
    "Review and confirm",
  ];
  function next() {
    setError("");
    if (step === 1 && (!form.county || !form.service)) {
      setError("Choose a county and service to continue.");
      return;
    }
    if (
      step === 2 &&
      (!form.name.trim() ||
        !/^\+?[\d\s()\-]{7,30}$/.test(form.phone) ||
        !/^\S+@\S+\.\S+$/.test(form.email))
    ) {
      setError("Please enter your name, a valid phone number and email.");
      return;
    }
    if (step === 3 && form.description.trim().length < 15) {
      setError("Please describe your request in at least 15 characters.");
      return;
    }
    setStep(Math.min(4, step + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function submit() {
    setError("");
    if (!agree) {
      setError("Please confirm that you understand how requests work.");
      return;
    }
    setBusy(true);
    try {
      const verification = await captcha.getToken();
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.set(key, value));
      files.forEach((f) => data.append("files", f));
      data.set("captchaToken", verification.captchaToken);
      data.set("captchaVersion", verification.captchaVersion);
      const response = await fetch("/api/requests/create", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok) {
        setError(captcha.handle(result));
        return;
      }
      setSuccess(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "We could not save your request.",
      );
    } finally {
      setBusy(false);
    }
  }
  function chooseFiles(list: FileList | null) {
    const chosen = list ? Array.from(list) : [];
    if (
      chosen.length > 3 ||
      chosen.reduce((n, f) => n + f.size, 0) > 3 * 1024 * 1024 ||
      chosen.some((f) => !["application/pdf", "image/jpeg"].includes(f.type))
    ) {
      setFiles([]);
      setError("Choose up to three PDF or JPG files, 3 MB combined.");
      return;
    }
    setError("");
    setFiles(chosen);
  }
  if (success)
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-[#dfe4fd] bg-white p-6 sm:p-9">
        <CheckCircle2 size={38} className="mb-4 text-primary" />
        <span className="section-kicker">Request saved</span>
        <h2 className="text-3xl">Keep this reference number</h2>
        <div className="my-5 rounded-lg bg-[#f7f8fe] p-5">
          <span className="block text-xs">Your Samuel Civic reference</span>
          <strong className="mt-2 block break-all font-heading text-2xl text-ink">
            {success.reference}
          </strong>
        </div>
        <p className="text-sm leading-relaxed">
          Your request is saved in Samuel Civic. It has not been automatically
          sent to a county office. Contact the office directly and keep your
          reference for your own records.
        </p>
        <p className="text-sm">
          {success.emailSent
            ? "We have sent a confirmation to the email address you provided."
            : "We could not send a confirmation email, so please save this reference now."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/requests/${success.id}`}
            className="btn-civic btn-primary-civic"
          >
            View my request <ArrowRight size={16} />
          </Link>
          <Link href="/services" className="btn-civic btn-outline-civic">
            Browse services
          </Link>
        </div>
      </div>
    );
  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-[#dfe4fd] bg-white p-6 sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="section-kicker !mb-0">Step {step} of 4</span>
        <span className="text-xs">{names[step - 1]}</span>
      </div>
      <div
        className="progress-track mt-3"
        role="progressbar"
        aria-label="Request form progress"
        aria-valuemin={1}
        aria-valuemax={4}
        aria-valuenow={step}
      >
        <div className="progress-fill" style={{ width: `${step * 25}%` }} />
      </div>
      <div className="mb-7 mt-7">
        <h2 className="mb-2 text-2xl sm:text-3xl">
          {
            [
              "Where can we help?",
              "Tell us about yourself",
              "Describe your request",
              "Check the details",
            ][step - 1]
          }
        </h2>
        <p className="mb-0 text-sm">
          {
            [
              "Choose the county and the service that best fits your enquiry.",
              "We use these details to keep your request and contact you if needed.",
              "Share enough to remember the issue. Please avoid unnecessary sensitive details.",
              "Make sure everything is correct before saving your request.",
            ][step - 1]
          }
        </p>
      </div>
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="form-label" htmlFor="request-county">
              County
            </label>
            <select
              id="request-county"
              className="field"
              value={form.county}
              onChange={(e) => set("county", e.target.value)}
            >
              <option value="">Select a county</option>
              {counties.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="request-service">
              Service
            </label>
            <select
              id="request-service"
              className="field"
              value={form.service}
              onChange={(e) => set("service", e.target.value)}
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option value={s.slug} key={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="request-name">
              Full name
            </label>
            <input
              id="request-name"
              className="field"
              autoComplete="name"
              maxLength={100}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="request-phone">
              Phone number
            </label>
            <input
              id="request-phone"
              type="tel"
              className="field"
              autoComplete="tel"
              maxLength={30}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="request-email">
              Email address
            </label>
            <input
              id="request-email"
              type="email"
              className="field"
              autoComplete="email"
              maxLength={254}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="request-id">
              National ID number <span className="font-normal">(optional)</span>
            </label>
            <input
              id="request-id"
              className="field"
              maxLength={30}
              value={form.nationalId}
              onChange={(e) => set("nationalId", e.target.value)}
            />
            <p className="mt-1 text-xs">
              Only provide it if necessary. This is sensitive information.
            </p>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className="form-label" htmlFor="description">
              What do you need help with?
            </label>
            <textarea
              id="description"
              className="field"
              maxLength={3000}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the issue, location, and what you have tried so far."
            />
            <p className="mt-1 text-xs">At least 15 characters, up to 3,000.</p>
          </div>
          <div>
            <label className="form-label" htmlFor="preferred-office">
              Preferred office <span className="font-normal">(optional)</span>
            </label>
            <select
              id="preferred-office"
              className="field"
              value={form.office}
              onChange={(e) => set("office", e.target.value)}
            >
              <option value="">Not sure yet</option>
              {offices
                .filter((o) => o.county === form.county)
                .map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
            </select>
            <p className="mt-1 text-xs">
              Our office directory is still growing. You can leave this blank.
            </p>
          </div>
          <div>
            <label className="form-label" htmlFor="documents">
              Supporting documents{" "}
              <span className="font-normal">(optional)</span>
            </label>
            <div className="rounded-lg border border-dashed border-[#bac8fa] bg-[#f7f8fe] p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <FileUp size={18} className="text-primary" /> Upload PDF or JPG
              </div>
              <input
                id="documents"
                type="file"
                className="mt-3 min-h-11 w-full text-base"
                multiple
                accept="application/pdf,image/jpeg"
                onChange={(e) => chooseFiles(e.target.files)}
              />
              <p className="mb-0 mt-2 text-xs">
                Up to three files, 3 MB combined. Only attach documents that are
                necessary.
              </p>
              {files.map((f) => (
                <p className="mb-0 mt-2 text-xs" key={f.name}>
                  {f.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-5">
          <div className="rounded-lg border border-[#dfe4fd] p-5">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              {[
                ["County", form.county],
                [
                  "Service",
                  services.find((s) => s.slug === form.service)?.name || "",
                ],
                ["Name", form.name],
                ["Phone", form.phone],
                ["Email", form.email],
                ["National ID", form.nationalId ? "Provided" : "Not provided"],
                [
                  "Preferred office",
                  offices.find((o) => o.slug === form.office)?.name ||
                    "Not specified",
                ],
                [
                  "Documents",
                  files.length ? files.map((f) => f.name).join(", ") : "None",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-[#6c757d]">{label}</dt>
                  <dd className="mb-0 mt-1 break-words font-semibold text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 border-t border-[#dfe4fd] pt-4">
              <span className="text-xs text-[#6c757d]">Request details</span>
              <p className="mb-0 mt-1 whitespace-pre-wrap text-sm">
                {form.description}
              </p>
            </div>
          </div>
          <div className="disclaimer-box">
            <Info size={20} />
            <p>
              This is an independent record, not an official application. It
              will not be automatically sent to a county office. Contact the
              office directly.
            </p>
          </div>
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-[#355EFC]"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I understand how this request is stored and that it is not sent
            automatically to an office.
          </label>
          <CaptchaChallenge
            key={captcha.challengeKey}
            required={captcha.requireV2}
            onToken={captcha.setV2Token}
          />
          <CaptchaNotice />
        </div>
      )}
      {error && (
        <p className="mt-5 text-sm text-[#a23020]" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#dfe4fd] pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          className="btn-civic btn-outline-civic"
          onClick={() => {
            setError("");
            if (step > 1) setStep(step - 1);
            else window.location.assign("/services");
          }}
        >
          <ArrowLeft size={16} />
          {step === 1 ? "Back to services" : "Back"}
        </button>
        {step < 4 ? (
          <button
            type="button"
            className="btn-civic btn-primary-civic"
            onClick={next}
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className="btn-civic btn-primary-civic"
            disabled={busy}
            onClick={submit}
          >
            {busy ? "Saving request..." : "Confirm and save"}{" "}
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

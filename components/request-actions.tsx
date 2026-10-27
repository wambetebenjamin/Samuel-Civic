"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, MessageSquareText, X } from "lucide-react";
import { useFocusTrap } from "@/components/use-focus-trap";
import {
  CaptchaChallenge,
  CaptchaNotice,
  useCaptcha,
} from "@/components/recaptcha";
import type { RequestMessage } from "@/lib/store";

export function RequestActions({
  id,
  messages,
  closed,
}: {
  id: string;
  messages: RequestMessage[];
  closed: boolean;
}) {
  const closeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  useFocusTrap(confirm, closeRef);
  const notesCaptcha = useCaptcha("request_message");
  const uploadCaptcha = useCaptcha("request_upload");
  const closeCaptcha = useCaptcha("request_close");
  useEffect(() => {
    if (!confirm) return;
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirm(false);
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [confirm]);
  async function post(kind: "message" | "upload" | "close", event?: FormEvent) {
    event?.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    const cap =
      kind === "message"
        ? notesCaptcha
        : kind === "upload"
          ? uploadCaptcha
          : closeCaptcha;
    try {
      const token = await cap.getToken();
      let response: Response;
      if (kind === "upload") {
        if (!file) throw new Error("Choose a PDF or JPG file.");
        const data = new FormData();
        data.set("requestId", id);
        data.set("captchaToken", token.captchaToken);
        data.set("captchaVersion", token.captchaVersion);
        data.append("files", file);
        response = await fetch("/api/requests/upload", {
          method: "POST",
          body: data,
        });
      } else {
        response = await fetch(`/api/requests/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: id,
            ...(kind === "message" ? { message } : {}),
            ...token,
          }),
        });
      }
      const data = await response.json();
      if (!response.ok) {
        setError(cap.handle(data));
        return;
      }
      setMessage("");
      setFile(null);
      setConfirm(false);
      setNotice(
        kind === "message"
          ? "Your note was saved."
          : kind === "upload"
            ? "Your document was added."
            : "Your request was closed.",
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="mt-8 rounded-lg border border-[#dfe4fd] p-5 sm:p-6">
        <h2 className="text-2xl">Request notes</h2>
        <p className="text-sm">
          Use this private thread to keep your own follow-up notes. Messages are
          not delivered to a county office.
        </p>
        <div className="space-y-3">
          <div className="rounded-lg bg-[#f7f8fe] p-4">
            <strong className="text-sm text-ink">Samuel Civic</strong>
            <p className="mb-0 mt-1 text-sm">
              Your request is saved. Contact the office directly for an official
              response or update.
            </p>
          </div>
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg border border-[#dfe4fd] p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <strong className="text-sm text-ink">{m.author}</strong>
                <span className="text-xs">
                  {new Date(m.createdAt).toLocaleDateString("en-KE", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
              <p className="mb-0 mt-1 whitespace-pre-wrap break-words text-sm">
                {m.text}
              </p>
            </div>
          ))}
        </div>
        {!closed && (
          <form className="mt-5" onSubmit={(e) => post("message", e)}>
            <label htmlFor="request-note" className="form-label">
              Add a note
            </label>
            <textarea
              id="request-note"
              className="field"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={2000}
              placeholder="Add a follow-up note for your records."
            />
            <CaptchaChallenge
              key={notesCaptcha.challengeKey}
              required={notesCaptcha.requireV2}
              onToken={notesCaptcha.setV2Token}
            />
            <button
              className="btn-civic btn-primary-civic mt-3"
              disabled={busy}
            >
              <MessageSquareText size={16} /> Save note
            </button>
            <CaptchaNotice />
          </form>
        )}
      </div>
      {!closed && (
        <div className="mt-6 rounded-lg border border-[#dfe4fd] p-5 sm:p-6">
          <h2 className="text-2xl">Add a document</h2>
          <p className="text-sm">
            PDF or JPG only. Each request may hold up to three files, 3 MB
            combined. Upload only what is necessary.
          </p>
          <form onSubmit={(e) => post("upload", e)}>
            <label className="form-label" htmlFor="extra-file">
              Choose a document
            </label>
            <input
              type="file"
              id="extra-file"
              className="field"
              accept="application/pdf,image/jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
            <CaptchaChallenge
              key={uploadCaptcha.challengeKey}
              required={uploadCaptcha.requireV2}
              onToken={uploadCaptcha.setV2Token}
            />
            <button
              className="btn-civic btn-outline-civic mt-3"
              disabled={busy}
            >
              <FileUp size={16} /> Upload document
            </button>
          </form>
        </div>
      )}
      {error && !confirm && (
        <p className="mt-4 text-sm text-[#a23020]" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 text-sm font-semibold text-primary" role="status">
          {notice}
        </p>
      )}
      {!closed && (
        <button
          onClick={() => {
            setError("");
            setConfirm(true);
          }}
          className="text-link mt-5"
        >
          Close request if resolved offline
        </button>
      )}
      {confirm && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirm(false);
          }}
        >
          <div
            ref={closeRef}
            className="modal-panel pb-safe"
            role="dialog"
            aria-modal="true"
            aria-labelledby="close-title"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="close-title" className="text-2xl">
                Close this request?
              </h2>
              <button
                className="icon-button"
                aria-label="Cancel"
                onClick={() => setConfirm(false)}
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm">
              Choose this if you have resolved the matter offline. You will
              still be able to view the request, but you cannot add new notes or
              documents. Closed records are scheduled for deletion after 90
              days.
            </p>
            <CaptchaChallenge
              key={closeCaptcha.challengeKey}
              required={closeCaptcha.requireV2}
              onToken={closeCaptcha.setV2Token}
            />
            {error && (
              <p className="text-sm text-[#a23020]" role="alert">
                {error}
              </p>
            )}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                className="btn-civic btn-outline-civic"
                onClick={() => setConfirm(false)}
              >
                Keep open
              </button>
              <button
                className="btn-civic btn-primary-civic"
                disabled={busy}
                onClick={() => post("close")}
              >
                {busy ? "Closing..." : "Close request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Check, MessageCircle, Volume2, VolumeX, X } from "lucide-react";
import { whatsappUrl } from "@/lib/directory";
import { useFocusTrap } from "@/components/use-focus-trap";

const consentKey = "samuel-civic-cookie-consent";
type Consent = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};
const tour =
  "Welcome to Samuel Civic. This is an independent guide to county services in Kenya. Search by what you need or by county, read plain-language checklists, find office contacts, and save a request record you can track with a reference number. Samuel Civic is not a government website. Always confirm fees and documents with the office itself. Scroll down to find a service near you.";

export function SiteUtilities() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [choices, setChoices] = useState({
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const preferencesRef = useRef<HTMLElement>(null);
  useFocusTrap(preferencesOpen, preferencesRef);

  useEffect(() => {
    try {
      const value = localStorage.getItem(consentKey);
      if (value) {
        const parsed = JSON.parse(value) as Consent;
        if (parsed.necessary === true) {
          setConsent(parsed);
          setChoices({
            functional: !!parsed.functional,
            analytics: !!parsed.analytics,
            marketing: !!parsed.marketing,
          });
        }
      }
    } catch {
      /* Treat unavailable storage as no consent. */
    }
    try {
      if (sessionStorage.getItem("samuel-civic-tour-played")) {
        started.current = true;
        setDone(true);
      }
    } catch {
      /* Tour remains available. */
    }
    setReady(true);
    const open = () => setPreferencesOpen(true);
    window.addEventListener("open-cookie-preferences", open);
    return () => window.removeEventListener("open-cookie-preferences", open);
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { destroy: () => void } | undefined;
    let cancelled = false;
    void import("lenis").then(({ default: Lenis }) => {
      if (!cancelled)
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 2,
          infinite: false,
          autoRaf: true,
        });
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);
  useEffect(() => {
    if (!preferencesOpen) return;
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") setPreferencesOpen(false);
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [preferencesOpen]);

  const speak = useCallback(() => {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setDone(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(tour);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.lang = "en-KE";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setDone(true);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setDone(true);
    };
    setMuted(false);
    setDone(false);
    window.speechSynthesis.speak(utterance);
  }, []);
  useEffect(() => {
    const trigger = (event: Event) => {
      if (
        event.type === "click" &&
        (event.target as HTMLElement)?.closest("[data-voice-control]")
      )
        return;
      if (started.current) return;
      started.current = true;
      try {
        sessionStorage.setItem("samuel-civic-tour-played", "1");
      } catch {
        /* Nonessential storage may be blocked. */
      }
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("click", trigger);
      speak();
    };
    window.addEventListener("scroll", trigger, { passive: true });
    window.addEventListener("click", trigger);
    return () => {
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("click", trigger);
      window.speechSynthesis?.cancel();
    };
  }, [speak]);
  function toggleTour(event: React.MouseEvent) {
    event.stopPropagation();
    started.current = true;
    try {
      sessionStorage.setItem("samuel-civic-tour-played", "1");
    } catch {
      /* Ignore disabled storage. */
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setMuted(true);
      setDone(true);
    } else {
      speak();
    }
  }
  function save(next: {
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }) {
    const value: Consent = {
      necessary: true,
      ...next,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(consentKey, JSON.stringify(value));
    } catch {
      /* The banner will reappear if storage is disabled. */
    }
    setConsent(value);
    setChoices(next);
    setPreferencesOpen(false);
  }
  return (
    <>
      {consent?.analytics && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      <button
        type="button"
        data-voice-control
        className={`floating-control voice bottom-safe ${speaking ? "speaking" : ""}`}
        onClick={toggleTour}
        aria-label={done ? "Replay tour" : "Site voice tour, click to mute"}
      >
        {muted ? <VolumeX size={23} /> : <Volume2 size={23} />}
        <span className="float-tooltip">
          {done ? "Replay tour" : "Hear what this site is about"}
        </span>
      </button>
      <a
        className="floating-control whatsapp bottom-safe"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle size={25} />
        <span className="float-tooltip">Chat with us on WhatsApp</span>
      </a>
      {ready && !consent && !preferencesOpen && (
        <aside className="cookie-banner pb-safe" aria-label="Cookie consent">
          <div className="shell flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <strong className="font-heading text-base text-ink">
                Your privacy matters
              </strong>
              <p className="mb-0 mt-1 text-xs leading-relaxed">
                We use necessary storage to run the site. With your permission,
                we may use optional cookies to improve your experience. Service
                request contents are never used for advertising.{" "}
                <a
                  href="/legal/cookie-policy"
                  className="font-semibold text-primary underline"
                >
                  Cookie policy
                </a>
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                className="btn-civic btn-primary-civic"
                onClick={() =>
                  save({ functional: true, analytics: true, marketing: true })
                }
              >
                Accept All
              </button>
              <button
                className="btn-civic btn-outline-civic"
                onClick={() => setPreferencesOpen(true)}
              >
                Manage Preferences
              </button>
            </div>
          </div>
        </aside>
      )}
      {preferencesOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPreferencesOpen(false);
          }}
        >
          <section
            ref={preferencesRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            className="modal-panel pb-safe"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="section-kicker">Your choice</span>
                <h2 id="cookie-title" className="text-2xl">
                  Cookie preferences
                </h2>
              </div>
              <button
                className="icon-button"
                aria-label="Close preferences"
                onClick={() => setPreferencesOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm leading-relaxed">
              Choose what you are comfortable with. Necessary storage keeps the
              site working. We never use service request contents for
              advertising. You can change these choices at any time.
            </p>
            <div className="my-5 divide-y divide-[#e8ebf8] border-y border-[#e8ebf8]">
              {(
                [
                  [
                    "necessary",
                    "Necessary",
                    "Required for security and remembering your consent.",
                  ],
                  [
                    "functional",
                    "Functional",
                    "Remember optional experience preferences.",
                  ],
                  [
                    "analytics",
                    "Analytics",
                    "Help us understand how the site is used.",
                  ],
                  [
                    "marketing",
                    "Marketing",
                    "Allow optional marketing technologies, if introduced.",
                  ],
                ] as const
              ).map(([key, title, description]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <strong className="text-sm text-ink">{title}</strong>
                    <p className="mb-0 mt-1 text-xs">{description}</p>
                  </div>
                  {key === "necessary" ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-primary">
                      <Check size={14} /> Always on
                    </span>
                  ) : (
                    <label className="flex min-h-11 min-w-11 items-center justify-center">
                      <span className="sr-only">
                        Allow {title.toLowerCase()} cookies
                      </span>
                      <input
                        className="h-5 w-5 accent-[#355EFC]"
                        type="checkbox"
                        checked={choices[key]}
                        onChange={(event) =>
                          setChoices({
                            ...choices,
                            [key]: event.target.checked,
                          })
                        }
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                className="btn-civic btn-outline-civic"
                onClick={() =>
                  save({
                    functional: false,
                    analytics: false,
                    marketing: false,
                  })
                }
              >
                Necessary only
              </button>
              <button
                className="btn-civic btn-primary-civic"
                onClick={() => save(choices)}
              >
                Save preferences
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="text-primary underline"
      onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
    >
      Manage cookie preferences
    </button>
  );
}

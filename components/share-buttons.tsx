"use client";
import { Facebook, Linkedin, Share2 } from "lucide-react";
export function ShareButtons() {
  function share(network: "facebook" | "linkedin" | "share") {
    const url = window.location.origin;
    if (network === "share" && navigator.share) {
      void navigator
        .share({ title: "Samuel Civic", url })
        .catch(() => undefined);
      return;
    }
    const dest =
      network === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        : network === "linkedin"
          ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
          : `https://wa.me/?text=${encodeURIComponent("Samuel Civic: " + url)}`;
    window.open(dest, "_blank", "noopener,noreferrer");
  }
  return (
    <div className="mt-3 flex gap-2">
      <button
        className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white"
        aria-label="Share on Facebook"
        onClick={() => share("facebook")}
      >
        <Facebook size={16} />
      </button>
      <button
        className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white"
        aria-label="Share on LinkedIn"
        onClick={() => share("linkedin")}
      >
        <Linkedin size={16} />
      </button>
      <button
        className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white"
        aria-label="Share Samuel Civic"
        onClick={() => share("share")}
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}

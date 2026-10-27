"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  MapPin,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { whatsappUrl } from "@/lib/directory";
import { SignOutButton } from "@/components/sign-out-button";

const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Offices", "/offices"],
  ["Guides", "/guides"],
  ["About", "/about"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let active = true;
    void fetch("/api/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (active) setSignedIn(data.signedIn === true);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);
  const path = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function resize() {
      if (window.innerWidth >= 1024) setOpen(false);
    }
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <>
      <div className="site-topbar">
        <div className="shell site-topbar-inner">
          <span className="topbar-item">
            <MapPin size={14} aria-hidden="true" /> An independent guide to
            county services in Kenya
          </span>
          <a
            className="topbar-item hidden sm:inline-flex"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={14} aria-hidden="true" /> Need a hand? Chat
            with us
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="shell">
          <div className="nav-row">
            <Link href="/" className="brand" aria-label="Samuel Civic home">
              <span className="brand-mark">
                <Building2 size={23} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <span>
                <span className="brand-name">Samuel Civic</span>
                <span className="brand-tagline">
                  County services, clearly listed.
                </span>
              </span>
            </Link>
            <nav
              aria-label="Main navigation"
              className="nav-links hidden md:flex"
            >
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={path === href ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="nav-actions hidden lg:flex">
              {signedIn ? (
                <>
                  <Link className="nav-signin" href="/requests">
                    My requests
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <Link className="nav-signin" href="/login">
                  Sign in
                </Link>
              )}
              <Link href="/track" className="btn-civic btn-primary-civic">
                Track a request <ArrowUpRight size={15} />
              </Link>
            </div>
            <button
              className="icon-button md:hidden"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mobile-menu md:hidden"
          >
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/track" onClick={() => setOpen(false)}>
              Track a request
            </Link>
            {signedIn ? (
              <>
                <Link href="/requests" onClick={() => setOpen(false)}>
                  My requests
                </Link>
                <div className="py-3">
                  <SignOutButton />
                </div>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            )}
          </nav>
        )}
      </header>
    </>
  );
}

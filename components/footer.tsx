import Link from "next/link";
import { ArrowRight, Building2, MessageCircle } from "lucide-react";
import { disclaimer, whatsappUrl } from "@/lib/directory";
import { ShareButtons } from "@/components/share-buttons";

const columns = [
  {
    title: "Explore",
    links: [
      ["Find a service", "/services"],
      ["Find an office", "/offices"],
      ["Read the guides", "/guides"],
      ["Browse by county", "/services"],
    ],
  },
  {
    title: "Your requests",
    links: [
      ["Start a request", "/requests/new"],
      ["Track a request", "/track"],
      ["My requests", "/requests"],
      ["Sign in", "/login"],
    ],
  },
  {
    title: "Information",
    links: [
      ["About Samuel Civic", "/about"],
      ["Privacy policy", "/legal/privacy-policy"],
      ["Terms of use", "/legal/terms"],
      ["Cookie policy", "/legal/cookie-policy"],
    ],
  },
];
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-14 lg:py-16">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white"
            >
              <Building2 size={25} />
              <span className="font-heading text-2xl font-bold">
                Samuel Civic
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#c8d2e9]">
              A clearer starting point for the county services and information
              you need.
            </p>
            <a
              className="footer-link mt-2"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> Chat with us on WhatsApp
            </a>
            <ShareButtons />
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map(([label, href]) => (
                <Link className="footer-link" key={href + label} href={href}>
                  <ArrowRight size={13} />
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/15 py-6">
          <p className="max-w-4xl text-xs leading-relaxed text-[#c8d2e9]">
            {disclaimer}
          </p>
          <p className="mt-2 text-xs text-[#c8d2e9]">
            For a true emergency, call{" "}
            <a href="tel:999" className="font-bold text-white">
              999
            </a>
            .
          </p>
        </div>
        <div className="footer-bottom flex flex-col gap-2 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} Samuel Civic. Independent and free to
            browse.
          </span>
          <span>
            Template by{" "}
            <a href="https://htmlcodex.com" target="_blank" rel="noreferrer">
              HTML Codex
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}

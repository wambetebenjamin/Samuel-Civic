import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { whatsappDisplay, whatsappUrl } from "@/lib/directory";
export function ErrorContent({ server = false }: { server?: boolean }) {
  return (
    <section className="section-space soft-section">
      <div className="shell">
        <div className="mx-auto max-w-2xl rounded-lg border border-[#dfe4fd] bg-white p-8 text-center sm:p-12">
          <span className="section-kicker">{server ? "500" : "404"}</span>
          <h1 className="text-3xl sm:text-4xl">
            {server ? "Something went wrong" : "We could not find that page"}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed">
            {server
              ? "We are sorry, this page is having trouble. Please try again, or reach us on WhatsApp for help."
              : "The page may have moved, or the address may not be quite right. Let us help you find another way."}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-civic btn-primary-civic">
              <ArrowLeft size={16} /> Go home
            </Link>
            {server ? (
              <a
                className="btn-civic btn-outline-civic"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} /> WhatsApp {whatsappDisplay}
              </a>
            ) : (
              <Link href="/services" className="btn-civic btn-outline-civic">
                Find a service <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

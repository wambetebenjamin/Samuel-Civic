import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SiteUtilities } from "@/components/site-utilities";

export const metadata: Metadata = {
  title: {
    default: "Samuel Civic | County services, clearly listed",
    template: "%s | Samuel Civic",
  },
  description:
    "An independent guide to county services in Kenya. Find the right office, prepare your documents, and keep track of your requests.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE" data-scroll-behavior="smooth">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[10002] focus:bg-white focus:p-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <SiteUtilities />
      </body>
    </html>
  );
}

"use client";
import "./globals.css";
import { ErrorContent } from "@/components/error-content";
export default function GlobalError() {
  return (
    <html lang="en-KE">
      <body>
        <main>
          <ErrorContent server />
        </main>
      </body>
    </html>
  );
}

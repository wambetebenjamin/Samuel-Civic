# Verification notes

## Template preservation

Compared every file in `finanza-v1.0.0 (1).zip` against the extracted file at its original relative path using SHA-256: 133 files checked, none missing or modified. `TEMPLATE-AUDIT.md` records the full archive tree and the original variables, fonts and feature locations.

## Browser and interaction checks

Used Chromium/Playwright against the local development site at widths 375, 390, 430, 768, 1024, 1280 and 1536 pixels. Checked public pages for horizontal overflow and rendered em dashes, and visually inspected desktop, tablet and mobile screenshots. Tested cookie preferences and persistence, mobile navigation and Escape, directory search, county/category filters, URL persistence, incomplete-directory empty states, sign-in return paths, and clear failure when CAPTCHA is unconfigured. `npm run test:smoke` additionally checks public pages, branded 404, unauthenticated session access, and fail-closed POST and cron endpoints.

## Integration checks and limits

Exercised registration, credential login, v3 low-score to v2 UI fallback, Google OAuth initiation and PKCE, single-use CAPTCHA permits, the four-step request form, encrypted ID and PDF/JPG uploads, email confirmation, private notes, concurrent updates, spoofed file rejection, owner-only downloads, cross-account access denial, limited public tracking, sign-out, closed-request retention and session revocation after assisted erasure.

These were isolated tests with **local test doubles**, not live external services: CAPTCHA verification and the browser widget were stubbed, KV and SMTP were local in-memory fixtures, and Blob upload/delete were simulated with Blob read substituted by a local fixture. Google initiation was tested up to the provider redirect, not through a real Google account. Real Google, Vercel/Upstash, Blob, SMTP, production networking and scheduled Vercel Cron behavior still need to be verified with deployment credentials before launch. No claim of live service delivery or legal certification is implied.

## Requested clean checks

On Node 24.22.1, the requested commands completed in order:

1. `npm ci`: passed; npm reported the upstream deprecation notices documented in the README.
2. `npx tsc --noEmit`: passed.
3. `npx next build`: passed; 54 static pages generated and dynamic routes compiled.
4. `npm audit --audit-level=high`: passed with 0 vulnerabilities.

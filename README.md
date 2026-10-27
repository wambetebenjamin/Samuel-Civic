# Samuel Civic

An independent Kenyan county-service directory and personal request tracker, built from the preserved Finanza template. It is **not** an official government service. Saving a request does not deliver it to any county office. Directory contacts are a small, sourced set of general-enquiry contacts and should be verified before use. See `TEMPLATE-AUDIT.md` for the original archive tree, feature audit and preserved template assets, and `image-credits.md` for the Pexels photographs.

## Local setup

Use Node 24 (`.nvmrc`) and run:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

The public directory works without external services. Sign-in, registration, enquiries, tracking and request actions fail explicitly until the relevant services are configured. Never put real secrets in Git. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to the same actual HTTPS origin in deployment (for local development, use `http://localhost:3000` for both and open that origin); the reCAPTCHA response hostname is checked against `NEXT_PUBLIC_SITE_URL`. Google reCAPTCHA keys must allow that hostname.

- **Auth**: configure a long random `NEXTAUTH_SECRET` and the KV REST URL/token. Email/password accounts use scrypt hashes; Google is enabled only when both Google OAuth values are present. Register the HTTPS callback `<origin>/api/auth/callback/google` with Google. Google accounts and password accounts are separate identities, even if they share an email address.
- **CAPTCHA**: provide the site/secret keys for reCAPTCHA v3 and a separate v2 checkbox pair. v3 is checked on the server for action, score and configured hostname; a low score prompts v2. Every application POST is checked. Credential login verifies CAPTCHA in NextAuth; Google sign-in and sign-out require short-lived, single-use, KV-backed CAPTCHA permits. The public tracking GET is also protected. Security verification fails closed if unconfigured or unavailable.
- **Storage**: configure a compatible Vercel KV/Upstash REST store. Requests, owner indexes and notes are private to the authenticated owner. Concurrent updates to a request use a short-lived token-owned lock. The public tracker returns only reference, status and update time. Statuses reflect this tool, not a county case-management system.
- **Private uploads**: configure a **private** Vercel Blob store and `BLOB_READ_WRITE_TOKEN`, plus a random 32-byte base64 `DOCUMENT_ENCRYPTION_KEY` (for example, generate it with `openssl rand -base64 32`). PDF/JPG content is validated and encrypted with AES-256-GCM before upload. Optional national ID values are also encrypted before KV storage. Keep the key securely backed up: rotating or losing it without a migration makes existing documents unreadable. Uploads are limited to three files and 3 MB total per request, and file downloads verify ownership.
- **Email**: configure SMTP host, port, user, password, sender and administrator email. Confirmation mail contains the reference but no uploaded documents. The form tells users if the request was saved but a confirmation could not be sent. Enquiries and office corrections are emailed to the administrator, not government offices.
- **Retention**: closing a request schedules it for deletion after 90 days. Configure `CRON_SECRET` on Vercel; the daily scheduled `/api/cron/retention` job checks that secret, deletes encrypted documents first, then removes KV records, notes and indexes. Monitor cron failures and provider backups. Without the configured job, deletion is not automatic. Open requests remain until closed or erased. Account deletion is an assisted process: verify the requester's identity, run `node --env-file=.env.local scripts/erase-resident.mjs --email user@example.com` for a dry run, and add `--confirm-delete` only after verification. For a Google identity, use a verified `--reference SC-YYYY-XXXXXXXXXXXX` instead; that erases all records owned by the reference's account. A password account and Google identity require separate erasures. Assisted erasure revokes existing sessions; a hashed revocation marker is retained for 31 days to enforce this security measure. Review and implement backup deletion and data-access procedures with counsel.

The privacy notice describes intended handling, not a substitute for operational and legal review. Before launch identify the controller, review Kenyan Data Protection Act compliance and cross-border provider safeguards, verify contact channels, establish a data-subject request workflow, and monitor retention and security.

## Verification

For public-page and fail-closed API smoke tests, start the app and run `npm run test:smoke`. The integration flows should also be exercised against dedicated test instances of CAPTCHA, KV, Blob and SMTP before launch.

```sh
npm ci
npx tsc --noEmit
npx next build
npm audit --audit-level=high
```

## Dependency notes

The requested `next-auth@5.0.0-beta.28` does not declare support for Next 16; beta.32 does. The requested `@vercel/blob@0.29.4` is unpublished, so 2.4.0 is used for private Blob support. `nodemailer@10.2.1`, `jspdf@4.2.1` and `zod@4.6.7` replace requested older versions with high or critical published advisories. NextAuth's optional Nodemailer peer range does not include Nodemailer 10; `.npmrc` enables legacy peer resolution. Email uses Nodemailer directly, not NextAuth's email provider. Framer Motion is pinned with compatible `motion-dom` and `motion-utils` overrides to prevent incompatible transitive resolution. PostCSS, sharp and sprintf-js are overridden to patched releases. `@vercel/kv` and Recharts 2 report upstream deprecation notices. Re-run the security audit and compatibility tests whenever dependencies change.

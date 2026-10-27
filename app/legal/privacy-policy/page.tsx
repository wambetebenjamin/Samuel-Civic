import Link from "next/link";
import { PageHero } from "@/components/common";
import { whatsappUrl } from "@/lib/directory";
export const metadata = { title: "Privacy policy" };
export default function Privacy() {
  return (
    <>
      <PageHero
        title="Privacy policy"
        label="Privacy policy"
        description="How Samuel Civic handles information when you browse or use the request tracker."
      />
      <section className="section-space-sm">
        <div className="shell content-prose">
          <p>
            <strong>Last updated: 27 October 2026.</strong>
          </p>
          <h2>Who we are</h2>
          <p>
            Samuel Civic is an independent information and request-tracking
            tool, not a county or national government website. Questions about
            this notice or your personal data can be sent to our team on{" "}
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            . This notice is intended to support the principles of Kenya’s Data
            Protection Act, 2019. The operator should complete a legal and
            operational review before launch.
          </p>
          <h2>Information we collect</h2>
          <p>
            When you register, we collect your name, email, phone number, county
            and a securely hashed password. If you use Google sign-in, Google
            provides account identity information. When you save a request, we
            collect the service, county, contact details, description, optional
            national ID number and any documents or notes you choose to provide.
            A national ID number and request documents can be sensitive, so
            provide them only if necessary.
          </p>
          <h2>Why we use it</h2>
          <p>
            We use information to create and secure your account, save and
            display your requests, send a reference confirmation, answer
            enquiries, prevent abuse and maintain the service. We rely on your
            request for the service, legitimate security needs, consent where
            required for optional technologies, or a legal obligation where
            applicable. We do not sell personal data or use request contents for
            advertising.
          </p>
          <h2>Storage, sharing and transfers</h2>
          <p>
            Account and request records are stored using Vercel KV or its
            configured Redis provider. Documents are encrypted and stored in a
            private Vercel Blob store. The service also uses Google reCAPTCHA
            for security, Google for sign-in if chosen, and an email provider
            for messages. These providers process data on our behalf or under
            their own policies. Hosting or provider processing may occur outside
            Kenya. The operator must assess and implement safeguards for any
            cross-border transfer before launch. We do not send saved requests
            to county offices automatically.
          </p>
          <h2>Retention and security</h2>
          <p>
            Open request records are kept while needed for the service or until
            a verified erasure request is handled. Closed request records and
            their documents are scheduled for deletion after 90 days, subject to
            legal obligations and the operator enabling the retention job.
            Account data is kept until you request deletion or it is no longer
            needed. Provider backups may persist for a limited period. When an
            account is erased, a hashed session-revocation marker is kept for 31
            days for security. We use access controls, password hashing,
            encrypted document storage and security checks, but no system can
            guarantee absolute security.
          </p>
          <h2>Your rights</h2>
          <p>
            Subject to applicable law, you may request access, correction,
            restriction, portability or erasure of your personal data, object to
            certain processing, and withdraw consent for optional processing.
            Contact us through{" "}
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            ; we may need to verify your identity. You may also complain to
            Kenya’s Office of the Data Protection Commissioner. A request to
            erase data may be subject to lawful retention requirements.
          </p>
          <h2>Cookies and changes</h2>
          <p>
            See our <Link href="/legal/cookie-policy">cookie policy</Link> for
            choices. We may update this notice when our practices change and
            will update the date above.
          </p>
        </div>
      </section>
    </>
  );
}

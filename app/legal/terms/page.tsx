import Link from "next/link";
import { PageHero } from "@/components/common";
export const metadata = { title: "Terms of use" };
export default function Terms() {
  return (
    <>
      <PageHero
        title="Terms of use"
        label="Terms"
        description="The essentials to know when using Samuel Civic."
      />
      <section className="section-space-sm">
        <div className="shell content-prose">
          <p>
            <strong>Last updated: 27 October 2026.</strong>
          </p>
          <h2>An independent information tool</h2>
          <p>
            Samuel Civic is not a government entity or an official county or
            national government website. Our directory and guides are general
            information, not legal, medical, financial or other professional
            advice. Always verify fees, documents, contacts and procedures with
            the relevant office.
          </p>
          <h2>Your requests</h2>
          <p>
            Saving a request creates a record in Samuel Civic. It does not
            automatically submit an application, report or message to a county
            office. You are responsible for contacting the relevant office and
            following its official procedures. We do not guarantee that an
            office will respond or that any response will arrive within a
            particular time.
          </p>
          <h2>Information you provide</h2>
          <p>
            Provide accurate information, use the service lawfully, and do not
            upload information about another person without a lawful reason.
            User-generated notes and office corrections may be incomplete or
            inaccurate. Do not submit unnecessary sensitive information. You are
            responsible for safeguarding your account credentials.
          </p>
          <h2>Availability and limitations</h2>
          <p>
            Information can change and may not cover every county or service. We
            work to keep the site useful but cannot guarantee accuracy,
            availability or a particular outcome. To the extent permitted by
            law, use is at your own discretion. Nothing in these terms removes
            rights that cannot lawfully be excluded.
          </p>
          <h2>Questions</h2>
          <p>
            See <Link href="/about">About</Link> to contact us, and our{" "}
            <Link href="/legal/privacy-policy">privacy policy</Link> to
            understand how personal information is used.
          </p>
        </div>
      </section>
    </>
  );
}

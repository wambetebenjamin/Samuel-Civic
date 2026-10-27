import { PageHero } from "@/components/common";
import { CookiePreferencesButton } from "@/components/site-utilities";
export const metadata = { title: "Cookie policy" };
export default function Cookies() {
  return (
    <>
      <PageHero
        title="Cookie policy"
        label="Cookie policy"
        description="Your choices about cookies and similar storage on Samuel Civic."
      />
      <section className="section-space-sm">
        <div className="shell content-prose">
          <p>
            <strong>Last updated: 27 October 2026.</strong>
          </p>
          <h2>What we use</h2>
          <p>
            Necessary cookies and local storage support security, sign-in and
            remembering your consent. Google reCAPTCHA may set cookies when you
            use a protected form. Session storage remembers whether the optional
            voice tour has played during your visit.
          </p>
          <p>
            With your permission, analytics tools can help us understand site
            performance. Functional and marketing options are off until you opt
            in. We do not currently run marketing technologies. Service request
            contents are never used for advertising.
          </p>
          <h2>Your choices</h2>
          <p>
            Necessary storage is always on. You may accept all options, select
            only the optional categories you want, or choose necessary only. You
            can change your choices at any time. Deleting browser storage may
            make the banner appear again.
          </p>
          <CookiePreferencesButton />
          <h2>More information</h2>
          <p>
            See our privacy policy for information about your rights under
            Kenya’s Data Protection Act, 2019.
          </p>
        </div>
      </section>
    </>
  );
}

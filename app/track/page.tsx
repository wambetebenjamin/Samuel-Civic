import { PageHero } from "@/components/common";
import { TrackForm } from "@/components/track-form";
export const metadata = { title: "Track a request" };
export default function Track() {
  return (
    <>
      <PageHero
        title="Track a request"
        label="Track"
        description="Enter your Samuel Civic reference to see a limited status update. No personal details or documents are shown here."
      />
      <section className="section-space-sm">
        <div className="shell">
          <div className="max-w-2xl rounded-lg border border-[#dfe4fd] bg-white p-6 sm:p-8">
            <h2 className="mb-2 text-2xl">Have your reference ready</h2>
            <p className="mb-6 text-sm">
              It starts with SC and was shown when you saved your request.
              Samuel Civic requests are not automatically sent to a county
              office.
            </p>
            <TrackForm />
          </div>
        </div>
      </section>
    </>
  );
}

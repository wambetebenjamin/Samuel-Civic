import { GuideCard, PageHero } from "@/components/common";
import { services } from "@/lib/directory";
export const metadata = { title: "Plain-language guides" };
export default function Guides() {
  return (
    <>
      <PageHero
        title="Plain-language guides"
        label="Guides"
        description="A little preparation can save a trip. Explore practical starting points for common county service questions."
      />
      <section className="section-space-sm">
        <div className="shell">
          <p className="mb-6 text-sm">
            <strong className="text-ink">{services.length} guides</strong> to
            help you prepare
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((s) => (
              <GuideCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

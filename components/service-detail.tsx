"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Disclaimer, PageHero, ServiceCard } from "@/components/common";
import {
  counties,
  getCategory,
  offices,
  services,
  type Service,
} from "@/lib/directory";

function ServiceView({
  service,
  county,
}: {
  service: Service;
  county?: string;
}) {
  const office = offices.find((o) => o.county === county);
  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 2);
  return (
    <>
      <PageHero
        title={service.name}
        label={service.name}
        crumbs={[{ label: "Services", href: "/services" }]}
        description={service.summary}
      />
      <section className="section-space-sm">
        <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="category-badge">
                {getCategory(service.category)?.name}
              </span>
              <span className="category-badge">
                {county ? `${county} County` : "Varies by county"}
              </span>
            </div>
            <div className="content-prose">
              <h2 className="!mt-0">What this service is</h2>
              <p>{service.overview}</p>
              <h2>Documents typically needed</h2>
              <p>
                These are common starting points, not a complete official list.
                Ask the office what applies to your situation.
              </p>
              <ul className="!list-none !pl-0">
                {service.documents.map((d) => (
                  <li className="mb-2 flex gap-3" key={d}>
                    <Check size={18} className="mt-1 shrink-0 text-primary" />
                    {d}
                  </li>
                ))}
              </ul>
              <h2>Fees and timing</h2>
              <p>
                <strong>Fees:</strong> Confirm with the office. Fees and
                procedures may vary by county. This is guidance only, not an
                official fee schedule.
              </p>
              <p>
                <strong>Estimated time:</strong> {service.time}. Ask the
                relevant office for an up-to-date estimate.
              </p>
              <h2>Related guide</h2>
              <Link href={`/guides/${service.slug}`} className="text-link">
                {service.guideTitle} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/requests/new?service=${service.slug}${county ? `&county=${encodeURIComponent(county)}` : ""}`}
                className="btn-civic btn-primary-civic"
              >
                Start a request <ArrowRight size={16} />
              </Link>
              <Link
                href={`/offices${county ? `?county=${encodeURIComponent(county)}` : ""}`}
                className="btn-civic btn-outline-civic"
              >
                Find nearby offices
              </Link>
            </div>
          </div>
          <aside>
            <div className="filter-panel">
              <span className="section-kicker">Office contacts</span>
              {office ? (
                <>
                  <h2 className="text-xl">{office.name}</h2>
                  <p className="text-xs leading-relaxed">
                    This is a general county contact, not necessarily the desk
                    for this service. Please confirm before visiting.
                  </p>
                  <div className="space-y-4 text-sm">
                    <p className="flex gap-3">
                      <MapPin size={17} className="shrink-0 text-primary" />
                      {office.address}
                    </p>
                    <p className="flex gap-3">
                      <Phone size={17} className="shrink-0 text-primary" />
                      <a href={`tel:${office.phone.replace(/[^+\d]/g, "")}`}>
                        {office.phone}
                      </a>
                    </p>
                    <p className="flex break-all gap-3">
                      <Mail size={17} className="shrink-0 text-primary" />
                      <a href={`mailto:${office.email}`}>{office.email}</a>
                    </p>
                    <p className="flex gap-3">
                      <Clock3 size={17} className="shrink-0 text-primary" />
                      {office.hours}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#dfe4fd] bg-[#f7f8fe] p-4 text-sm">
                    <strong className="block text-ink">Address card</strong>
                    {office.address}
                  </div>
                  <Link
                    href={`/offices/${office.slug}`}
                    className="text-link mt-3"
                  >
                    View office details <ArrowRight size={15} />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-xl">Find the right contact</h2>
                  <p className="text-sm leading-relaxed">
                    The responsible office depends on your county. Our directory
                    includes selected general enquiry contacts; other areas are
                    still being added.
                  </p>
                  <div className="rounded-lg border border-[#dfe4fd] bg-[#f7f8fe] p-4 text-sm">
                    <strong className="block text-ink">Address card</strong>
                    Choose your county in the office directory to see available
                    contacts.
                  </div>
                  <Link href="/offices" className="text-link mt-3">
                    Find an office <ArrowRight size={15} />
                  </Link>
                </>
              )}
            </div>
          </aside>
          <div className="lg:col-span-2">
            <Disclaimer />
          </div>
          {related.length > 0 && (
            <div className="lg:col-span-2">
              <h2 className="mb-5 text-2xl">Related services</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((s) => (
                  <ServiceCard key={s.slug} service={s} county={county} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function ServiceDetailContent({ service }: { service: Service }) {
  const search = useSearchParams();
  const county = counties.find((c) => c === search.get("county"));
  return <ServiceView service={service} county={county} />;
}
export function ServiceDefaultContent({ service }: { service: Service }) {
  return <ServiceView service={service} />;
}

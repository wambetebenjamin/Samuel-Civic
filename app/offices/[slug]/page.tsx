import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Disclaimer, PageHero } from "@/components/common";
import { getOffice, offices, services } from "@/lib/directory";
export const dynamicParams = false;
export function generateStaticParams() {
  return offices.map((o) => ({ slug: o.slug }));
}
export default async function OfficeDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const office = getOffice(slug);
  if (!office) notFound();
  return (
    <>
      <PageHero
        title={office.name}
        description={`${office.county} County. General enquiries and direction to the appropriate county desk.`}
        label={office.name}
        crumbs={[{ label: "Offices", href: "/offices" }]}
      />
      <section className="section-space-sm">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="content-prose">
            <span className="category-badge">{office.type}</span>
            <h2>About this office</h2>
            <p>
              This is a general county enquiry contact. Ask the county to
              confirm whether it handles your service and where the relevant
              desk is located. Contacts can change.
            </p>
            <h2>Services to ask about</h2>
            <p>
              General enquiry contacts can help direct you to the relevant
              department. They are not confirmed service desks for every
              subject.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.slice(0, 8).map((s) => (
                <Link
                  key={s.slug}
                  className="text-link"
                  href={`/services/${s.slug}?county=${encodeURIComponent(office.county)}`}
                >
                  {s.name} <ArrowRight size={15} />
                </Link>
              ))}
            </div>
            <h2>Directions notes</h2>
            <p>{office.directions}</p>
            <p className="text-sm">
              Contact source:{" "}
              <a href={office.source} target="_blank" rel="noreferrer">
                county contact page{" "}
                <ExternalLink size={13} className="inline" />
              </a>
              . Confirm current details before visiting.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/requests/new?county=${encodeURIComponent(office.county)}&office=${office.slug}`}
                className="btn-civic btn-primary-civic"
              >
                Save an office-related request <ArrowRight size={16} />
              </Link>
              <Link
                href={`/services?county=${encodeURIComponent(office.county)}`}
                className="btn-civic btn-outline-civic"
              >
                See services
              </Link>
            </div>
            <p className="mt-3 text-xs">
              Requests are saved in Samuel Civic and are not automatically
              delivered to county offices.
            </p>
          </div>
          <aside>
            <div className="filter-panel">
              <h2 className="text-xl">Contact details</h2>
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
                href={`/about?office=${office.slug}#suggest`}
                className="text-link mt-3"
              >
                Suggest a correction <ArrowRight size={15} />
              </Link>
            </div>
          </aside>
          <div className="lg:col-span-2">
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

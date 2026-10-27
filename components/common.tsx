import Link from "next/link";
import { ArrowRight, ChevronRight, Clock3, Info, MapPin } from "lucide-react";
import {
  disclaimer,
  getCategory,
  type Office,
  type Service,
} from "@/lib/directory";

export function PageHero({
  title,
  description,
  label = "Explore",
  crumbs = [],
}: {
  title: string;
  description?: string;
  label?: string;
  crumbs?: { label: string; href: string }[];
}) {
  return (
    <section className="page-hero">
      <div className="shell">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span className="contents" key={c.href}>
              <ChevronRight size={12} />
              <Link href={c.href}>{c.label}</Link>
            </span>
          ))}
          <ChevronRight size={12} />
          <span>{label}</span>
        </div>
        <h1>{title}</h1>
        {description && (
          <p className="mb-0 max-w-2xl text-sm leading-relaxed sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className="disclaimer-box w-full">
      <Info size={20} />
      <div>
        <strong>
          {compact
            ? "A helpful note"
            : "Independent information, always verify"}
        </strong>
        <p>{disclaimer}</p>
      </div>
    </div>
  );
}
export function ServiceCard({
  service,
  county,
}: {
  service: Service;
  county?: string;
}) {
  const category = getCategory(service.category);
  return (
    <article className="directory-card">
      <span className="category-badge">{category?.name}</span>
      <h3>
        <Link
          href={`/services/${service.slug}${county ? `?county=${encodeURIComponent(county)}` : ""}`}
          className="text-ink hover:text-primary"
        >
          {service.name}
        </Link>
      </h3>
      <div className="card-meta">
        <MapPin size={14} />
        {county ? `${county} County, confirm locally` : "Varies by county"}
      </div>
      <p className="card-summary">{service.summary}</p>
      <div className="card-footer">
        <span className="card-meta">
          <Clock3 size={14} /> {service.time}
        </span>
        <Link
          className="text-link"
          href={`/services/${service.slug}${county ? `?county=${encodeURIComponent(county)}` : ""}`}
        >
          View <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
export function OfficeCard({ office }: { office: Office }) {
  return (
    <article className="office-card">
      <span className="category-badge">{office.type}</span>
      <h3>
        <Link
          href={`/offices/${office.slug}`}
          className="text-ink hover:text-primary"
        >
          {office.name}
        </Link>
      </h3>
      <div className="card-meta">
        <MapPin size={14} />
        {office.county} County
      </div>
      <p className="card-summary">{office.address}</p>
      <div className="card-footer">
        <span className="text-xs">{office.phone}</span>
        <Link className="text-link" href={`/offices/${office.slug}`}>
          View office <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
export function GuideCard({ service }: { service: Service }) {
  return (
    <article className="guide-card">
      <span className="category-badge">
        {getCategory(service.category)?.name}
      </span>
      <h3>
        <Link
          href={`/guides/${service.slug}`}
          className="text-ink hover:text-primary"
        >
          {service.guideTitle}
        </Link>
      </h3>
      <p className="card-summary">{service.summary}</p>
      <div className="card-footer">
        <span className="card-meta">
          <Clock3 size={14} /> {service.readTime}
        </span>
        <Link className="text-link" href={`/guides/${service.slug}`}>
          Read <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
export function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="section-kicker">{kicker}</span>
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-intro">{description}</p>}
    </div>
  );
}

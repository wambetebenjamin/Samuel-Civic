import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { Disclaimer, PageHero } from "@/components/common";
import { getCategory, getService, services } from "@/lib/directory";
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export default async function GuideDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  return (
    <>
      <PageHero
        title={s.guideTitle}
        label={s.guideTitle}
        crumbs={[{ label: "Guides", href: "/guides" }]}
        description="A practical starting point for your next conversation with an office."
      />
      <section className="section-space-sm">
        <div className="shell">
          <article className="content-prose">
            <div className="flex flex-wrap items-center gap-3">
              <span className="category-badge">
                {getCategory(s.category)?.name}
              </span>
              <span className="card-meta">
                <Clock3 size={14} />
                {s.readTime}
              </span>
            </div>
            <h2>Start with the basics</h2>
            <p>{s.overview}</p>
            <h2>What to do next</h2>
            <ol className="list-decimal">
              {s.steps.map((step) => (
                <li className="mb-2" key={step}>
                  {step}
                </li>
              ))}
            </ol>
            <h2>Documents checklist</h2>
            <p>
              Ask the office which documents apply to you. Requirements can
              differ by county.
            </p>
            <ul className="!list-none !pl-0">
              {s.documents.map((d) => (
                <li className="mb-2 flex gap-3" key={d}>
                  <Check size={18} className="mt-1 shrink-0 text-primary" />
                  {d}
                </li>
              ))}
            </ul>
            <h2>Common mistakes to avoid</h2>
            <ul className="list-disc">
              {s.commonMistakes.map((m) => (
                <li className="mb-2" key={m}>
                  {m}
                </li>
              ))}
            </ul>
            <h2>Keep a record</h2>
            <p>
              Write down the name of the office, the date you contacted it and
              any reference you receive. You can also use Samuel Civic to keep a
              private record of your enquiry. A Samuel Civic request is not
              automatically sent to an office.
            </p>
            <Link
              className="btn-civic btn-primary-civic mt-4"
              href={`/services/${s.slug}`}
            >
              Find this service <ArrowRight size={16} />
            </Link>
          </article>
          <div className="mt-10">
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

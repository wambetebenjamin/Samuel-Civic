import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Disclaimer, PageHero, SectionHeading } from "@/components/common";
import { getOffice } from "@/lib/directory";
export const metadata = { title: "About us" };
export default async function About({
  searchParams,
}: {
  searchParams: Promise<{ office?: string }>;
}) {
  const query = await searchParams;
  const office = getOffice(query.office || "");
  return (
    <>
      <PageHero
        title="A clearer place to start"
        label="About"
        description="We believe finding the right information about a county service should be a little less complicated."
      />
      <section className="section-space">
        <div className="shell grid items-center gap-10 md:grid-cols-2">
          <div className="relative min-h-[340px] overflow-hidden rounded-lg bg-[#dfe4fd] sm:min-h-[430px]">
            <Image
              src="/images/nairobi-city.jpg"
              alt="Buildings and roads in Nairobi"
              loading="eager"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              kicker="Our purpose"
              title="Information for the journey ahead"
              description="When you are looking for a service, the first question is often the hardest: where do I start?"
            />
            <p className="mt-5 text-sm leading-relaxed">
              Samuel Civic brings service descriptions, practical checklists and
              selected office contacts together in one independent directory. It
              is designed to help residents prepare better questions and keep a
              record of their enquiries.
            </p>
            <p className="text-sm leading-relaxed">
              Our request tracker is a personal record. It does not replace an
              official application or automatically send a request to a
              government office.
            </p>
            <Link href="/services" className="btn-civic btn-primary-civic mt-3">
              Explore services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section-space-sm soft-section">
        <div className="shell">
          <Disclaimer />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [
                BookOpenText,
                "Plain language",
                "We make information easier to understand without pretending every county works the same way.",
              ],
              [
                ShieldCheck,
                "Independent by design",
                "We are not a government entity, and we do not claim official partnerships.",
              ],
              [
                HeartHandshake,
                "Respect for your data",
                "We ask for the information needed to provide the tool and never sell request contents.",
              ],
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof BookOpenText;
              return (
                <div className="step-card" key={title as string}>
                  <I size={25} className="mb-5 text-primary" />
                  <h3>{title as string}</h3>
                  <p>{text as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="shell">
          <div className="section-top">
            <SectionHeading
              kicker="The work behind the directory"
              title="Thoughtful information, made for people"
              description="Good information takes careful research, accessible writing and responsible technology."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                src: "/images/nairobi-resident.jpg",
                alt: "A woman on a Nairobi street",
                title: "Clear guidance",
                description: "Making everyday questions easier to navigate.",
              },
              {
                src: "/images/nairobi-street-portrait.jpg",
                alt: "A man on a street in Nairobi",
                title: "Community perspective",
                description: "Keeping the needs of residents at the centre.",
              },
              {
                src: "/images/nairobi-office.jpg",
                alt: "A person working at a computer in Nairobi",
                title: "Responsible technology",
                description: "Building a useful, privacy-conscious tool.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-lg border border-[#dfe4fd]"
              >
                <div className="relative h-64 bg-[#dfe4fd]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-xl">{item.title}</h3>
                  <p className="mb-0 text-sm">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-3 text-xs">
            Illustrative Pexels photographs, the people pictured are not
            identified as team members.
          </p>
        </div>
      </section>
      <section className="section-space-sm soft-section">
        <div className="shell grid gap-10 lg:grid-cols-2">
          <div>
            <span className="section-kicker">Talk to us</span>
            <h2 className="section-title">Have a question?</h2>
            <p className="mb-6 mt-4 text-sm">
              Ask us about using the directory. Please do not include ID numbers
              or sensitive documents in this form.
            </p>
            <ContactForm variant="enquiry" />
          </div>
          <div id="suggest">
            <span className="section-kicker">Help keep information useful</span>
            <h2 className="section-title">Suggest an office correction</h2>
            <p className="mb-6 mt-4 text-sm">
              Noticed a contact that may have changed? Tell us what to check,
              ideally with a source.
            </p>
            <ContactForm variant="suggest" initialOffice={office?.name} />
          </div>
        </div>
      </section>
    </>
  );
}

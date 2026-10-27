import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileCheck2,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { categories, services, whatsappUrl } from "@/lib/directory";
import { CategoryIcon } from "@/components/icons";
import { Disclaimer, GuideCard, SectionHeading } from "@/components/common";
import {
  HeroMotion,
  RevealGrid,
  RevealItem,
  ScrollEffects,
} from "@/components/animations";

const trust = [
  [BookOpenText, "Plain-language guides"],
  [MapPin, "County filters"],
  [ClipboardList, "Request tracking"],
  [ShieldCheck, "Independent and free to browse"],
] as const;
const steps = [
  {
    icon: Search,
    title: "Search by county or need",
    text: "Start with the service you need, or choose a county to narrow things down.",
  },
  {
    icon: FileCheck2,
    title: "Know before you go",
    text: "Read a simple guide to the documents, contacts and questions worth checking.",
  },
  {
    icon: ClipboardList,
    title: "Keep track of your request",
    text: "Save the details in one place and follow your request using a reference number.",
  },
];
const voices = [
  {
    quote:
      "It helps to know what to ask for before making the journey to an office.",
    name: "Resident from Nakuru",
  },
  {
    quote:
      "A simple checklist makes it easier to prepare for a permit enquiry.",
    name: "Trader from Kisumu",
  },
  {
    quote:
      "Finding a starting point for a question can make all the difference.",
    name: "Parent from Nairobi",
  },
];
export default function Home() {
  return (
    <>
      <ScrollEffects />
      <section className="hero-section">
        <div className="shell">
          <div className="hero-layout">
            <div className="hero-copy">
              <HeroMotion>
                <span className="eyebrow">
                  <span className="eyebrow-dot" /> County services, clearly
                  listed
                </span>
                <h1 className="hero-title">
                  Find the right county office the first time
                </h1>
                <p className="hero-description">
                  Find services, prepare the right documents, get office
                  contacts, and keep track of simple service requests across
                  Kenya.
                </p>
                <div className="hero-actions flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    href="/services"
                    className="btn-civic btn-primary-civic w-full sm:w-auto"
                  >
                    Find a service <ArrowRight size={17} />
                  </Link>
                  <Link
                    href="/track"
                    className="btn-civic btn-outline-civic w-full sm:w-auto"
                  >
                    Track a request <ArrowRight size={17} />
                  </Link>
                </div>
                <div className="hero-popular">
                  <span>Popular searches:</span>
                  <Link href="/services?category=business-permits">
                    Business permits
                  </Link>
                  <Link href="/services?category=water-and-sanitation">
                    Water services
                  </Link>
                  <Link href="/offices">County offices</Link>
                </div>
              </HeroMotion>
            </div>
            <div className="hero-photo-wrap">
              <Image
                src="/images/nairobi-resident.jpg"
                fill
                priority
                alt="A woman on a street in Nairobi"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="hero-photo-label">
                <span className="category-icon !mb-0 !h-10 !w-10">
                  <MapPin size={19} />
                </span>
                <div>
                  <strong>Here to help you get started</strong>
                  <span>Clear information for everyday needs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="trust-bar">
        <div className="shell trust-grid">
          {trust.map(([Icon, label]) => (
            <div className="trust-item" key={label}>
              <Icon size={20} strokeWidth={1.7} /> <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <section className="section-space">
        <div className="shell">
          <div className="section-top">
            <SectionHeading
              kicker="Services directory"
              title="What can we help you find?"
              description="A good place to start, whatever brings you to your county office."
            />
            <Link href="/services" className="text-link desktop-section-link">
              View all services <ArrowRight size={16} />
            </Link>
          </div>
          <RevealGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <RevealItem key={category.slug}>
                <Link
                  href={`/services?category=${category.slug}`}
                  className="category-card"
                >
                  <span className="category-icon">
                    <CategoryIcon name={category.icon} />
                  </span>
                  <h3>{category.name}</h3>
                  <span className="category-link">
                    Explore services <ArrowRight size={13} />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGrid>
          <Link href="/services" className="text-link mobile-section-link mt-5">
            View all services <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="section-space soft-section">
        <div className="shell">
          <div className="section-top">
            <SectionHeading
              kicker="A simpler way forward"
              title="A little clarity goes a long way"
              description="From your first question to your next step, we make it easier to find your way."
            />
            <Link href="/about" className="text-link desktop-section-link">
              How Samuel Civic works <ArrowRight size={16} />
            </Link>
          </div>
          <div
            data-step-group
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {steps.map((step, index) => (
              <div className="step-card" data-step key={step.title}>
                <div className="step-number">
                  <step.icon size={26} strokeWidth={1.6} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="county-section section-space-sm">
        <div className="shell">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="section-kicker !text-white/80">
                Across Kenya
              </span>
              <h2 className="section-title !text-white">
                Start with your county
              </h2>
              <p className="mb-0 mt-3 max-w-xl text-sm text-white/85">
                Find a clearer starting point, wherever you call home.
              </p>
            </div>
            <Link
              href="/services"
              className="text-sm font-bold text-white hover:text-white"
            >
              All 47 counties <ArrowRight size={16} className="inline" />
            </Link>
          </div>
          <div
            className="county-scroller mt-7"
            aria-label="Popular county filters"
          >
            {[
              "Nairobi",
              "Mombasa",
              "Kisumu",
              "Nakuru",
              "Kiambu",
              "Uasin Gishu",
              "Machakos",
              "Meru",
            ].map((county) => (
              <Link
                className="county-chip"
                key={county}
                href={`/services?county=${encodeURIComponent(county)}`}
              >
                <MapPin size={14} className="mr-2 text-primary" />
                {county}
              </Link>
            ))}
            <Link className="county-chip" href="/services">
              And more <ArrowRight size={14} className="ml-2 text-primary" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="shell">
          <div className="section-top">
            <SectionHeading
              kicker="Plain-language guides"
              title="A little preparation makes it easier"
              description="Clear, practical guides to help you know what to ask and what to bring."
            />
            <Link href="/guides" className="text-link desktop-section-link">
              See all guides <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[services[0], services[1], services[3]].map((service) => (
              <GuideCard key={service.slug} service={service} />
            ))}
          </div>
          <Link href="/guides" className="text-link mobile-section-link mt-5">
            See all guides <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="section-space soft-section">
        <div className="shell">
          <div className="section-top">
            <SectionHeading
              kicker="Here for everyday needs"
              title="Made for people like you"
              description="From a first enquiry to a follow-up, a clearer starting point matters."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {voices.map((v) => (
              <article className="quote-card" key={v.name}>
                <span className="quote-icon font-heading text-4xl leading-none">
                  “
                </span>
                <blockquote>“{v.quote}”</blockquote>
                <div className="flex items-center gap-3">
                  <span className="avatar-placeholder">
                    <UserRound size={20} />
                  </span>
                  <div>
                    <strong className="block font-heading text-base text-ink">
                      {v.name}
                    </strong>
                    <span className="text-xs">Illustrative example</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#6c757d]">
            These are illustrative scenarios, not statements from identifiable
            people.
          </p>
        </div>
      </section>
      <section className="section-space-sm">
        <div className="shell">
          <Disclaimer />
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-lg border border-[#dfe4fd] p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="category-icon !mb-0">
                <HeartHandshake size={22} />
              </span>
              <div>
                <h2 className="mb-1 text-xl">Not sure where to start?</h2>
                <p className="mb-0 text-sm">
                  We can help you find your way to the right information.
                </p>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-civic btn-outline-civic"
            >
              <MessageCircle size={17} /> Chat with us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

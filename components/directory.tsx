"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFocusTrap } from "@/components/use-focus-trap";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import {
  categories,
  counties,
  officeTypes,
  offices,
  services,
  whatsappUrl,
} from "@/lib/directory";
import { OfficeCard, ServiceCard } from "@/components/common";

export function Directory({ mode }: { mode: "services" | "offices" }) {
  const search = useSearchParams();
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  useFocusTrap(sheet, sheetRef);
  const q = search.get("q") || "";
  const county = search.get("county") || "";
  const category = search.get("category") || "";
  const type = search.get("type") || "";
  const page = Math.max(1, Math.min(100, Number(search.get("page")) || 1));
  function update(name: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(name, value);
    else params.delete(name);
    if (name !== "page") params.delete("page");
    window.history.replaceState(
      null,
      "",
      `${pathname}${params.size ? `?${params.toString()}` : ""}`,
    );
  }
  function clear() {
    window.history.replaceState(null, "", pathname);
  }
  useEffect(() => {
    if (!sheet) return;
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") setSheet(false);
    }
    function resize() {
      if (window.innerWidth >= 1024) setSheet(false);
    }
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [sheet]);
  const term = q.trim().toLowerCase();
  const matchedServices = services.filter(
    (s) =>
      (!category || s.category === category) &&
      (!type || s.officeType === type) &&
      (!term ||
        `${s.name} ${s.summary} ${s.documents.join(" ")}`
          .toLowerCase()
          .includes(term)),
  );
  const matchedOffices = offices.filter(
    (o) =>
      (!county || o.county === county) &&
      (!type || o.type === type) &&
      (!term ||
        `${o.name} ${o.address} ${o.county}`.toLowerCase().includes(term)),
  );
  const results = mode === "services" ? matchedServices : matchedOffices;
  const pageSize = 9;
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const current = Math.min(page, pages);
  const filters = (prefix: string) => (
    <div className="space-y-5">
      <div>
        <label className="form-label" htmlFor={`${prefix}-county`}>
          County
        </label>
        <select
          id={`${prefix}-county`}
          className="field"
          value={county}
          onChange={(e) => update("county", e.target.value)}
        >
          <option value="">All counties</option>
          {counties.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      {mode === "services" && (
        <div>
          <label className="form-label" htmlFor={`${prefix}-category`}>
            Service category
          </label>
          <select
            id={`${prefix}-category`}
            className="field"
            value={category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option value={c.slug} key={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="form-label" htmlFor={`${prefix}-type`}>
          Office type
        </label>
        <select
          id={`${prefix}-type`}
          className="field"
          value={type}
          onChange={(e) => update("type", e.target.value)}
        >
          <option value="">All office types</option>
          {officeTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <button onClick={clear} className="text-link">
        Clear filters <X size={15} />
      </button>
    </div>
  );
  return (
    <section className="section-space-sm">
      <div className="shell">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
            />
            <label htmlFor="directory-search" className="sr-only">
              Search {mode}
            </label>
            <input
              id="directory-search"
              type="search"
              className="field !pl-12"
              value={q}
              onChange={(e) => update("q", e.target.value)}
              placeholder={
                mode === "services"
                  ? "Search a service or document"
                  : "Search an office or location"
              }
            />
          </div>
          <button
            className="btn-civic btn-outline-civic lg:hidden"
            onClick={() => setSheet(true)}
          >
            <Filter size={17} /> Filters{" "}
            {(county || category || type) && (
              <span className="rounded bg-[#edf0fe] px-2 text-primary">On</span>
            )}
          </button>
        </div>
        <div className="flex items-start gap-7">
          <aside className="filter-panel hidden w-64 shrink-0 lg:block">
            <h2 className="mb-5 text-xl">Filter by</h2>
            {filters("desktop")}
          </aside>
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-sm font-bold text-ink">
                  {results.length} {mode} found
                </span>
                {mode === "services" && county && (
                  <span className="ml-2 text-xs">for {county} County</span>
                )}
              </div>
              <span className="text-xs">
                {mode === "services"
                  ? "General guidance, confirm locally"
                  : "Contacts can change, confirm before visiting"}
              </span>
            </div>
            {results.length ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {mode === "services"
                    ? matchedServices
                        .slice((current - 1) * pageSize, current * pageSize)
                        .map((service) => (
                          <ServiceCard
                            key={service.slug}
                            service={service}
                            county={county}
                          />
                        ))
                    : matchedOffices
                        .slice((current - 1) * pageSize, current * pageSize)
                        .map((office) => (
                          <OfficeCard key={office.slug} office={office} />
                        ))}
                </div>
                {pages > 1 && (
                  <nav
                    className="mt-8 flex items-center justify-center gap-2"
                    aria-label="Directory pages"
                  >
                    <button
                      className="icon-button"
                      aria-label="Previous page"
                      disabled={current === 1}
                      onClick={() => update("page", String(current - 1))}
                    >
                      <ArrowLeft size={16} />
                    </button>
                    {Array.from({ length: pages }, (_, i) => (
                      <button
                        key={i}
                        className={`icon-button ${current === i + 1 ? "!border-primary !bg-primary !text-white" : ""}`}
                        aria-current={current === i + 1 ? "page" : undefined}
                        onClick={() => update("page", String(i + 1))}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="icon-button"
                      aria-label="Next page"
                      disabled={current === pages}
                      onClick={() => update("page", String(current + 1))}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-[#dfe4fd] bg-[#f7f8fe] px-6 py-12 text-center">
                <Search size={29} className="mx-auto text-primary" />
                <h2 className="mt-4 text-2xl">No matches just yet</h2>
                <p className="mx-auto max-w-md text-sm leading-relaxed">
                  Try another search or clear your filters. Our office directory
                  is growing, so we may not have a listing for every county yet.
                </p>
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    className="btn-civic btn-outline-civic"
                    onClick={clear}
                  >
                    Clear filters
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-civic btn-primary-civic"
                  >
                    <MessageCircle size={16} /> Ask on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        {sheet && (
          <div
            className="mobile-sheet-backdrop"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSheet(false);
            }}
          >
            <div
              ref={sheetRef}
              className="mobile-sheet pb-safe"
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-title"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 id="filter-title" className="mb-0 text-2xl">
                  Filters
                </h2>
                <button
                  className="icon-button"
                  aria-label="Close filters"
                  onClick={() => setSheet(false)}
                >
                  <X size={20} />
                </button>
              </div>
              {filters("sheet")}
              <button
                className="btn-civic btn-primary-civic mt-5 w-full"
                onClick={() => setSheet(false)}
              >
                Show {results.length} results
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

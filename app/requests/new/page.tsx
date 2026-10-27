import { redirect } from "next/navigation";
import { getSession } from "@/auth";
import { counties, getOffice, getService } from "@/lib/directory";
import { PageHero } from "@/components/common";
import { RequestForm } from "@/components/request-form";
export const metadata = { title: "Start a request" };
export default async function NewRequest({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; county?: string; office?: string }>;
}) {
  const query = await searchParams;
  const county = counties.find((c) => c === query.county) || "";
  const service = getService(query.service || "")?.slug || "";
  const selectedOffice = getOffice(query.office || "");
  const office = selectedOffice?.county === county ? selectedOffice.slug : "";
  const session = await getSession();
  if (!session?.user?.id) {
    const params = new URLSearchParams();
    if (county) params.set("county", county);
    if (service) params.set("service", service);
    if (office) params.set("office", office);
    const destination = `/requests/new${params.size ? `?${params}` : ""}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(destination)}`);
  }
  return (
    <>
      <PageHero
        title="Start a request"
        label="New request"
        description="Keep the details of a county service enquiry together, then follow up directly with the relevant office."
      />
      <section className="section-space-sm soft-section">
        <div className="shell">
          <RequestForm
            initial={{
              county,
              service,
              office,
              name: session.user.name || "",
              email: session.user.email || "",
            }}
          />
        </div>
      </section>
    </>
  );
}

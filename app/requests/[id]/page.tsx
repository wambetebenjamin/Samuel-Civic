import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import { getSession } from "@/auth";
import { getMessages, getRequest } from "@/lib/store";
import { getOffice, getService } from "@/lib/directory";
import { PageHero } from "@/components/common";
import { RequestActions } from "@/components/request-actions";
import { ScrollEffects } from "@/components/animations";
export const dynamic = "force-dynamic";
const statusSteps = ["Submitted", "In review", "Needs info", "Closed"] as const;
export default async function RequestDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user?.id)
    redirect(`/login?callbackUrl=${encodeURIComponent(`/requests/${id}`)}`);
  let record;
  try {
    record = await getRequest(id);
  } catch {
    return (
      <section className="shell py-16">
        <h1>Request unavailable</h1>
        <p>Please try again later.</p>
      </section>
    );
  }
  if (!record || record.ownerId !== session.user.id) notFound();
  let messages: Awaited<ReturnType<typeof getMessages>> = [];
  let messagesError = false;
  try {
    messages = await getMessages(id);
  } catch {
    messagesError = true;
  }
  const service = getService(record.service);
  const office = getOffice(record.office);
  return (
    <>
      <ScrollEffects />
      <PageHero
        title="Request details"
        label={record.reference}
        crumbs={[{ label: "My requests", href: "/requests" }]}
        description="A private record of your enquiry, with your reference and follow-up notes."
      />
      <section className="section-space-sm">
        <div className="shell">
          <Link href="/requests" className="text-link mb-5">
            <ArrowLeft size={16} /> My requests
          </Link>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div>
              <div className="rounded-lg border border-[#dfe4fd] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs">Your reference</span>
                    <h2 className="mb-0 mt-1 break-all text-2xl">
                      {record.reference}
                    </h2>
                  </div>
                  <span className="category-badge">{record.status}</span>
                </div>
                <h3 className="mb-4 mt-7 text-lg">Status timeline</h3>
                <div
                  data-timeline
                  className="flex flex-col gap-4 md:flex-row md:items-start"
                >
                  {statusSteps.map((status, i) => (
                    <div
                      data-timeline-step
                      key={status}
                      className="flex min-w-0 flex-1 items-center gap-2 md:flex-col md:items-start"
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${record.status === status ? "border-primary bg-primary text-white" : "border-[#dfe4fd] bg-[#f7f8fe] text-primary"}`}
                      >
                        {record.status === status ? (
                          <CheckCircle2 size={17} />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <div>
                        <span className="block text-xs font-bold text-ink">
                          {status}
                        </span>
                        <span className="text-xs">
                          {record.status === status ? "Current status" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mb-0 mt-6 text-xs">
                  This status reflects your Samuel Civic record, not an official
                  county case status.
                </p>
              </div>
              {messagesError ? (
                <p className="mt-6 text-sm" role="alert">
                  Your request notes are temporarily unavailable. Please try
                  again later.
                </p>
              ) : (
                <RequestActions
                  id={id}
                  messages={messages}
                  closed={record.status === "Closed"}
                />
              )}
            </div>
            <aside>
              <div className="filter-panel">
                <h2 className="text-xl">At a glance</h2>
                <dl className="space-y-4 text-sm">
                  {[
                    ["Service", service?.name || record.service],
                    ["County", record.county],
                    ["Office", office?.name || "Not specified"],
                    ["Name", record.name],
                    ["Phone", record.phone],
                    ["Email", record.email],
                    [
                      "National ID",
                      record.nationalId ? "Provided securely" : "Not provided",
                    ],
                    [
                      "Created",
                      new Date(record.createdAt).toLocaleDateString("en-KE", {
                        dateStyle: "long",
                      }),
                    ],
                    [
                      "Last updated",
                      new Date(record.updatedAt).toLocaleDateString("en-KE", {
                        dateStyle: "long",
                      }),
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-[#6c757d]">{label}</dt>
                      <dd className="mb-0 mt-1 break-words font-semibold text-ink">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <h3 className="mt-6 text-base">Your description</h3>
                <p className="whitespace-pre-wrap break-words text-sm">
                  {record.description}
                </p>
                <h3 className="mt-6 text-base">Documents</h3>
                {record.documents.length ? (
                  record.documents.map((f) => (
                    <a
                      key={f.id}
                      href={`/api/requests/files/${record.id}/${f.id}`}
                      className="text-link break-all"
                    >
                      <FileText size={15} />
                      {f.name}
                    </a>
                  ))
                ) : (
                  <p className="text-sm">No documents attached.</p>
                )}
                {office && (
                  <Link className="text-link" href={`/offices/${office.slug}`}>
                    View office contact
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

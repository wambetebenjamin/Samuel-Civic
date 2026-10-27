import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ClipboardList, Plus } from "lucide-react";
import { getSession } from "@/auth";
import { getOwnerRequests, storageReady } from "@/lib/store";
import { getService } from "@/lib/directory";
import { PageHero } from "@/components/common";
export const metadata = { title: "My requests" };
export const dynamic = "force-dynamic";
export default async function Requests() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=%2Frequests");
  let records: Awaited<ReturnType<typeof getOwnerRequests>> = [];
  let error = false;
  try {
    records = await getOwnerRequests(session.user.id);
  } catch {
    error = true;
  }
  return (
    <>
      <PageHero
        title="My requests"
        label="My requests"
        description="Your saved enquiries and their latest status, all in one place."
      />
      <section className="section-space-sm">
        <div className="shell">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="mb-1 text-2xl">Your request list</h2>
              <p className="mb-0 text-sm">
                Only you can see the details on this page.
              </p>
            </div>
            <Link href="/requests/new" className="btn-civic btn-primary-civic">
              <Plus size={16} /> Start a request
            </Link>
          </div>
          {!storageReady() || error ? (
            <div className="disclaimer-box">
              <ClipboardList size={20} />
              <p>
                Request storage is not available right now. Please try again
                later.
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-lg border border-[#dfe4fd] bg-[#f7f8fe] px-6 py-12 text-center">
              <ClipboardList size={30} className="mx-auto text-primary" />
              <h2 className="mt-4 text-2xl">No requests yet</h2>
              <p className="text-sm">
                When you save a request, it will appear here.
              </p>
              <Link
                href="/requests/new"
                className="btn-civic btn-primary-civic mt-3"
              >
                Start a request <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[640px] px-4 sm:px-0">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f7f8fe] text-ink">
                      <tr>
                        {[
                          "Reference",
                          "Service",
                          "County",
                          "Status",
                          "Updated",
                          "",
                        ].map((label) => (
                          <th className="p-4" key={label}>
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r) => (
                        <tr key={r.id} className="border-b border-[#e7eaf8]">
                          <td className="p-4 font-semibold text-ink">
                            {r.reference}
                          </td>
                          <td className="p-4">
                            {getService(r.service)?.name || r.service}
                          </td>
                          <td className="p-4">{r.county}</td>
                          <td className="p-4">
                            <span className="category-badge">{r.status}</span>
                          </td>
                          <td className="p-4">
                            {new Date(r.updatedAt).toLocaleDateString("en-KE")}
                          </td>
                          <td className="p-4">
                            <Link
                              href={`/requests/${r.id}`}
                              className="text-link"
                            >
                              View <ArrowRight size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="mt-2 text-center text-xs opacity-60 sm:hidden">
                Scroll sideways to see all request details.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

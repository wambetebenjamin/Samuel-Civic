import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getService, services } from "@/lib/directory";
import {
  ServiceDefaultContent,
  ServiceDetailContent,
} from "@/components/service-detail";
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return (
    <Suspense fallback={<ServiceDefaultContent service={service} />}>
      <ServiceDetailContent service={service} />
    </Suspense>
  );
}

import { Suspense } from "react";
import { PageHero } from "@/components/common";
import { Directory } from "@/components/directory";
export const metadata = { title: "Service directory" };
export default function Services() {
  return (
    <>
      <PageHero
        title="Find a county service"
        description="Search by what you need, explore a category, or choose your county. Information is a starting point, so always check the details with the office."
        label="Services"
      />
      <Suspense
        fallback={<div className="shell py-12">Loading services...</div>}
      >
        <Directory mode="services" />
      </Suspense>
    </>
  );
}

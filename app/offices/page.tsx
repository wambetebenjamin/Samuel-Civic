import { Suspense } from "react";
import { PageHero } from "@/components/common";
import { Directory } from "@/components/directory";
export const metadata = { title: "Office directory" };
export default function Offices() {
  return (
    <>
      <PageHero
        title="Find an office"
        description="Start with a county contact, then ask which desk handles your enquiry. Our directory is growing and does not yet list every county."
        label="Offices"
      />
      <Suspense
        fallback={<div className="shell py-12">Loading offices...</div>}
      >
        <Directory mode="offices" />
      </Suspense>
    </>
  );
}

import Link from "next/link";
import { ArrowLeft, UserRoundPlus } from "lucide-react";
import { RegisterForm } from "@/components/auth-forms";
import { safeCallbackPath } from "@/lib/safe-path";
export const metadata = { title: "Create an account" };
export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const callbackUrl = safeCallbackPath((await searchParams).callbackUrl);
  return (
    <section className="section-space soft-section">
      <div className="shell">
        <Link href="/" className="text-link mb-5">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="mx-auto max-w-lg rounded-lg border border-[#dfe4fd] bg-white p-6 sm:p-9">
          <span className="category-icon">
            <UserRoundPlus size={22} />
          </span>
          <span className="section-kicker">Get started</span>
          <h1 className="mb-2 text-3xl">Create your account</h1>
          <p className="mb-6 text-sm leading-relaxed">
            Save your request details in one place and return to them whenever
            you need to.
          </p>
          <RegisterForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </section>
  );
}

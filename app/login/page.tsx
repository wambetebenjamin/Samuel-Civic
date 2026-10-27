import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/auth-forms";
import { safeCallbackPath } from "@/lib/safe-path";
export const metadata = { title: "Sign in" };
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const query = await searchParams;
  const callbackUrl = safeCallbackPath(query.callbackUrl);
  return (
    <section className="section-space soft-section">
      <div className="shell">
        <Link href="/" className="text-link mb-5">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="mx-auto max-w-lg rounded-lg border border-[#dfe4fd] bg-white p-6 sm:p-9">
          <span className="category-icon">
            <LockKeyhole size={22} />
          </span>
          <span className="section-kicker">Welcome back</span>
          <h1 className="mb-2 text-3xl">Sign in to track your requests.</h1>
          <p className="mb-6 text-sm leading-relaxed">
            Your requests and documents are only visible when you sign in.
          </p>
          <LoginForm
            callbackUrl={callbackUrl}
            googleEnabled={Boolean(
              process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
            )}
          />
        </div>
      </div>
    </section>
  );
}

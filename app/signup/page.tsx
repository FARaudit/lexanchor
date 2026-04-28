import Link from "next/link";
import SignupForm from "../_components/signup-form";

export const metadata = {
  title: "Sign up — LexAnchor",
  description: "Create your LexAnchor account."
};

export default function SignupPage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-12 max-w-md mx-auto">
      <Link href="/" className="text-text-3 hover:text-text-2 text-xs">← Home</Link>
      <h1 className="font-display text-3xl text-text font-medium mt-4">Create your account</h1>
      <p className="mt-2 text-text-2 text-sm">
        LexAnchor analyzes legal documents in seconds. Information only — not legal advice.
      </p>
      <div className="mt-6">
        <SignupForm />
      </div>
    </main>
  );
}

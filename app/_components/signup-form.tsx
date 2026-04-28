"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase-browser";

type Status = "idle" | "submitting" | "sent" | "error";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }
    setError(null);
    setStatus("submitting");
    const supabase = createBrowserClient();
    const { data, error: authErr } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (authErr) {
      setError(authErr.message);
      setStatus("error");
      return;
    }
    // If email confirmation is required, Supabase returns a user with no session.
    if (data.session) {
      router.push("/dashboard");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="border border-gold/30 bg-gold/5 p-5 max-w-md">
        <p className="text-text font-display text-lg">Check your email.</p>
        <p className="mt-2 text-text-2 text-sm">
          We sent a confirmation link to <span className="text-text font-mono">{email}</span>. Click it to finish creating your LexAnchor account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-3">
      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@firm.com"
        className="w-full bg-surface border border-border text-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-accent"
      />
      <input
        type="password"
        required
        minLength={12}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password — 12+ characters"
        className="w-full bg-surface border border-border text-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-accent text-bg py-3 font-medium tracking-wide hover:bg-mid transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Creating account…" : "Create account"}
      </button>
      {error && <p className="text-red text-xs">{error}</p>}
      <p className="text-text-3 text-xs">
        Already have an account? <a href="/login" className="text-accent hover:underline">Sign in</a>.
      </p>
    </form>
  );
}

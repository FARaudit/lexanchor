"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

const SCENARIOS = [
  {
    label: "Employment offer",
    body: "Senior engineer offer with 4-year vest cliff at 12 months. We surface the cliff trigger, IP assignment scope, and a non-compete that reaches 50 miles outside the office state."
  },
  {
    label: "Apartment lease",
    body: "12-month lease auto-renews to a 10% increase if no notice given 60 days out. We flag the auto-renewal, the security-deposit return window, and the joint-and-several roommate clause."
  },
  {
    label: "Contractor MSA",
    body: "Master service agreement with a buried IP assignment that captures pre-existing work. We flag the IP scope and a 60-day kill-fee term that's narrower than market."
  }
];

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [scenario, setScenario] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setScenario((s) => (s + 1) % SCENARIOS.length), 5000);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = createBrowserClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (otpError) {
      setError(otpError.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  const current = SCENARIOS[scenario];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5">
      <aside className="lg:col-span-2 bg-bg border-b lg:border-b-0 lg:border-r border-border px-8 md:px-12 py-12 lg:py-16 flex flex-col justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">LexAnchor</p>
          <h1 className="mt-12 lg:mt-20 font-display text-3xl md:text-4xl font-light text-text leading-[1.1]">
            Legal Intelligence<span className="text-gold">.</span>
          </h1>
          <p className="mt-6 text-text-2 leading-relaxed max-w-md">
            Sign in to upload contracts and run senior-attorney-grade analysis in 60 seconds.
          </p>

          <div className="mt-12 border border-border bg-surface p-6 max-w-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-3">{current.label}</p>
            <p className="text-text-2 text-sm leading-relaxed">{current.body}</p>
            <div className="mt-5 flex gap-1.5">
              {SCENARIOS.map((_, i) => (
                <span
                  key={i}
                  className={`h-0.5 w-6 transition-colors ${
                    i === scenario ? "bg-gold" : "bg-border-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-12 lg:mt-0 text-xs text-text-3 font-mono">
          © 2026 LexAnchor · Information only, not legal advice.
        </p>
      </aside>

      <section className="lg:col-span-3 bg-surface flex items-center justify-center px-6 md:px-10 py-16 lg:py-0">
        <div className="w-full max-w-md">
          <h2 className="font-display text-3xl md:text-4xl text-text">Sign in to LexAnchor</h2>
          <p className="mt-3 text-text-2 text-sm">Magic link — no password required.</p>

          {status === "sent" ? (
            <div className="mt-12 border border-gold/40 bg-gold/5 p-7">
              <p className="font-display text-xl text-text">Check your inbox</p>
              <p className="mt-3 text-sm text-text-2">
                Sign-in link sent to <span className="text-text font-mono">{email}</span>.
              </p>
              <button
                onClick={() => { setStatus("idle"); setEmail(""); }}
                className="mt-5 text-xs text-text-3 underline hover:text-text-2 font-mono"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-text-3 mb-3 font-mono">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@firm.com"
                  required
                  autoFocus
                  className="w-full bg-bg border border-border text-text px-4 py-3.5 focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-gold text-bg py-4 font-medium tracking-wide hover:bg-gold-dim disabled:opacity-50 transition-colors"
              >
                {status === "sending" ? "Sending..." : "Send magic link"}
              </button>
              {error && <p className="text-sm text-red border-l-2 border-red pl-3">{error}</p>}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

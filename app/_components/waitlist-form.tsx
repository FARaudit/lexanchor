"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "joined" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `HTTP ${res.status}`);
        setStatus("error");
      } else {
        setStatus("joined");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  }

  if (status === "joined") {
    return (
      <div className="border border-gold/40 bg-gold/5 p-5 max-w-md">
        <p className="font-display text-lg text-text">You&apos;re on the list.</p>
        <p className="mt-2 text-text-2 text-sm">We&apos;ll notify you when access opens.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@firm.com"
        required
        className="flex-1 bg-surface border border-border text-text px-4 py-3 focus:outline-none focus:border-gold transition-colors"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-3 bg-gold text-bg font-medium tracking-wide hover:bg-gold-dim disabled:opacity-50 transition-colors"
      >
        {status === "sending" ? "Joining…" : "Join the waitlist"}
      </button>
      {error && <p className="text-sm text-red w-full">{error}</p>}
    </form>
  );
}

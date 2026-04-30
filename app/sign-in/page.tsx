"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase-browser";

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const sb = createBrowserClient();
      const { error: err } = await sb.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setBusy(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#1A1A2E", color: "#e2e8f2", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/" style={{ fontFamily: "monospace", fontSize: 11, color: "#6b6b8a", textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
          ← LexAnchor
        </Link>

        <div style={{ background: "#0F0F1E", border: "1px solid #2D1B69", borderRadius: 12, padding: "32px 28px" }}>
          <div style={{ fontSize: 11, color: "#C4B5FD", fontFamily: "monospace", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
            Sign in
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#e2e8f2", marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: "#6b6b8a", marginBottom: 24, lineHeight: 1.6 }}>
            Continue to your contract analyses and clause library.
          </p>

          <form onSubmit={onSubmit}>
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ display: "block", fontSize: 10, color: "#6b6b8a", marginBottom: 6, fontFamily: "monospace", letterSpacing: ".1em", textTransform: "uppercase" }}>
                Email
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: "#1A1A2E", border: "1px solid #2D1B69", borderRadius: 6, color: "#e2e8f2", fontSize: 14 }}
              />
            </label>
            <label style={{ display: "block", marginBottom: 18 }}>
              <span style={{ display: "block", fontSize: 10, color: "#6b6b8a", marginBottom: 6, fontFamily: "monospace", letterSpacing: ".1em", textTransform: "uppercase" }}>
                Password
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: "#1A1A2E", border: "1px solid #2D1B69", borderRadius: 6, color: "#e2e8f2", fontSize: 14 }}
              />
            </label>

            {error && (
              <div style={{ padding: "10px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: 12, color: "#fca5a5", marginBottom: 14 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%",
                padding: 12,
                background: "#6C63FF",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: busy ? "wait" : "pointer",
                opacity: busy ? 0.6 : 1
              }}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p style={{ fontSize: 12, color: "#6b6b8a", marginTop: 18, textAlign: "center" }}>
            Need an account? <Link href="/signup" style={{ color: "#C4B5FD" }}>Create one free</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}

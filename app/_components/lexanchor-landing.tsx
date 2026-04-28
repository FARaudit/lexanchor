"use client";

import Link from "next/link";
import { useEffect } from "react";

const BG = "#06040f";
const SURFACE = "#09071a";
const SURFACE_2 = "#0d0c22";
const TEXT_1 = "#e0d8f8";
const TEXT_2 = "#5a4e88";
const TEXT_3 = "#3a2e60";
const PURPLE = "#7045e8";
const PURPLE_LIGHT = "#9468f5";

export default function LexAnchorLanding() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main style={{ background: BG, color: TEXT_1, minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />

      <style>{`
        .reveal { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.in { opacity: 1; transform: none; }
        .h-cta { transition: filter .15s ease, transform .15s ease; }
        .h-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }
        ::selection { background: ${PURPLE}; color: ${BG}; }
      `}</style>

      <nav style={{ padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ color: TEXT_1, textDecoration: "none", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20 }}>
          LexAnchor
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 13, color: TEXT_2 }}>
          <Link href="/pricing" style={{ color: TEXT_2, textDecoration: "none" }}>Pricing</Link>
          <Link href="/login" style={{ color: TEXT_2, textDecoration: "none" }}>Sign in</Link>
          <Link
            href="/signup"
            className="h-cta"
            style={{ background: PURPLE, color: "#fff", padding: "9px 18px", borderRadius: 6, fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, textDecoration: "none" }}
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 32px 100px", maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.22em", color: TEXT_3, textTransform: "uppercase", marginBottom: 16 }}>
          Legal Intelligence · First contract free
        </p>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 24, color: TEXT_1 }}>
          Read the contract.<br />Catch every risk.<br /><span style={{ color: PURPLE_LIGHT }}>Negotiate from leverage.</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: TEXT_2, maxWidth: 620, fontWeight: 300, marginBottom: 32 }}>
          LexAnchor analyzes any contract — NDA, SaaS terms, employment offer, vendor MSA — in
          under 60 seconds. Surfaces P0 / P1 / P2 risks, drafts redline language, builds your
          personal clause library over time. Information only — not legal advice.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/signup"
            className="h-cta"
            style={{ background: PURPLE, color: "#fff", padding: "14px 26px", borderRadius: 6, fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
          >
            Analyze first contract free
          </Link>
          <Link
            href="/pricing"
            className="h-cta"
            style={{ border: "1px solid rgba(255,255,255,0.14)", color: TEXT_1, padding: "13px 26px", borderRadius: 6, fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
          >
            See pricing
          </Link>
        </div>
      </section>

      {/* P0/P1/P2 explainer */}
      <section className="reveal" style={{ padding: "0 32px 100px", maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.22em", color: TEXT_3, textTransform: "uppercase", marginBottom: 14 }}>
          The risk priority system
        </p>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 38, color: TEXT_1 }}>
          P0 / P1 / P2 — every risk, ranked.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <PriorityCard tier="P0" title="Deal-breakers" body="Risks that should stop the signing — non-compete duration violating state law, IP assignment with no carve-outs, indemnification with no cap. Address before you sign." color="#c84d4d" />
          <PriorityCard tier="P1" title="Negotiable" body="Material risks worth pushing back on — auto-renewal terms, exclusivity windows, payment milestones. We draft redline language for each." color="#c4a44a" />
          <PriorityCard tier="P2" title="Standard" body="Common boilerplate worth flagging but rarely breaking the deal — choice of law, arbitration clauses, notice provisions. Surface and move on." color={PURPLE_LIGHT} />
        </div>
      </section>

      {/* Contract types */}
      <section className="reveal" style={{ padding: "60px 32px", maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.22em", color: TEXT_3, textTransform: "uppercase", marginBottom: 14 }}>
          What it analyzes
        </p>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 38, color: TEXT_1 }}>
          Every contract type founders, freelancers, and SMBs sign.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { tag: "NDA", body: "Mutual or unilateral. Term, scope of confidential info, residuals carve-outs, return-or-destroy obligations." },
            { tag: "Service agreement", body: "MSA + SOW combos. Payment terms, IP ownership of deliverables, warranties, limitation of liability cap." },
            { tag: "Employment offer", body: "Comp structure, equity vesting, non-compete (state-law-aware), proprietary information assignment, severance triggers." },
            { tag: "IP assignment", body: "Pre-existing IP carve-outs, work-for-hire scope, moral rights waivers, post-termination assignment." },
            { tag: "Vendor / MSA", body: "Auto-renewal, termination for convenience, data processing addendums, audit rights, sub-processor disclosure." },
            { tag: "Government contract", body: "Federal Acquisition Regulation flowdowns, FAR/DFARS clauses, prevailing wage, equal employment opportunity." }
          ].map((f) => (
            <div key={f.tag} style={{ background: SURFACE, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "20px 22px" }}>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.15em", color: PURPLE_LIGHT, textTransform: "uppercase", marginBottom: 10 }}>{f.tag}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: TEXT_2 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* vs Harvey */}
      <section className="reveal" style={{ padding: "60px 32px", maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.22em", color: TEXT_3, textTransform: "uppercase", marginBottom: 14 }}>
          Vs the alternatives
        </p>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 32, color: TEXT_1 }}>
          Harvey is for BigLaw. LexAnchor is for everyone else.
        </h2>
        <div style={{ background: SURFACE, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
            <thead>
              <tr style={{ color: TEXT_3, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.16em", background: SURFACE_2 }}>
                <th style={th}>Capability</th>
                <th style={{ ...th, color: PURPLE_LIGHT, fontWeight: 600 }}>LexAnchor</th>
                <th style={th}>Harvey</th>
                <th style={th}>Hire an attorney</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Per-contract cost", "$0 first · $99/mo unlimited", "$$$$ enterprise only", "$300–$600/hr"],
                ["Time to result", "<60 seconds", "Hours", "Days–weeks"],
                ["P0/P1/P2 prioritization", "Yes", "No", "Maybe (depends on attorney)"],
                ["Redline draft included", "Yes", "Sometimes", "Yes"],
                ["Personal clause library", "Yes (grows over time)", "No", "No"],
                ["Renewal alerts (90/60/30)", "Yes", "No", "Manual"],
                ["Designed for", "Founders · SMB · freelancers", "BigLaw firms", "Anyone with budget"]
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ ...td, color: TEXT_2, fontWeight: 500 }}>{row[0]}</td>
                  <td style={{ ...td, color: PURPLE_LIGHT, fontWeight: 600 }}>{row[1]}</td>
                  <td style={{ ...td, color: TEXT_2 }}>{row[2]}</td>
                  <td style={{ ...td, color: TEXT_2 }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Process */}
      <section className="reveal" style={{ padding: "60px 32px", maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.22em", color: TEXT_3, textTransform: "uppercase", marginBottom: 14 }}>
          Process
        </p>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 38, color: TEXT_1 }}>
          Paste it. Read the risks. Save the clause.
        </h2>
        <ol style={{ listStyle: "none", padding: 0, display: "grid", gap: 12, maxWidth: 720 }}>
          {[
            { n: "01", title: "Upload PDF or paste clause text", body: "Any length, any format. Redacted versions encouraged." },
            { n: "02", title: "Risk extraction in seconds", body: "P0/P1/P2 cards rendered with plain-English explanation." },
            { n: "03", title: "Save to your library", body: "Build a personal clause bank that compounds over time." },
            { n: "04", title: "Negotiate or sign with leverage", body: "Redline draft language ready to paste into a counter-proposal." }
          ].map((s) => (
            <li key={s.n} style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "baseline", gap: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 18, color: PURPLE_LIGHT, fontWeight: 500 }}>{s.n}</span>
              <div>
                <p style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 600, color: TEXT_1, marginBottom: 4 }}>{s.title}</p>
                <p style={{ fontSize: 13, color: TEXT_2, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Pricing teaser */}
      <section className="reveal" style={{ padding: "60px 32px 100px", maxWidth: 1080, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 18, color: TEXT_1 }}>
          Legal intelligence. <span style={{ color: PURPLE_LIGHT }}>Without the hourly rate.</span>
        </h2>
        <p style={{ fontSize: 15, color: TEXT_2, maxWidth: 580, lineHeight: 1.65, fontWeight: 300, marginBottom: 28 }}>
          Individual $99/mo · Professional $199/mo · Business $499/mo · Law firm $999/mo. First contract free — no credit card.
        </p>
        <Link
          href="/pricing"
          className="h-cta"
          style={{ display: "inline-block", border: `1px solid ${PURPLE_LIGHT}`, color: PURPLE_LIGHT, padding: "12px 22px", borderRadius: 6, fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, textDecoration: "none" }}
        >
          See pricing
        </Link>
      </section>

      {/* Final CTA */}
      <section className="reveal" style={{ padding: "60px 32px 120px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 38, fontWeight: 700, letterSpacing: "-0.02em", color: TEXT_1, marginBottom: 12 }}>
          Analyze your first contract free.
        </h2>
        <p style={{ fontSize: 15, color: TEXT_2, marginBottom: 24, fontWeight: 300 }}>
          Paste any clause text. Get the P0/P1/P2 breakdown in seconds. Decide from there.
        </p>
        <Link
          href="/signup"
          className="h-cta"
          style={{ background: PURPLE, color: "#fff", padding: "14px 30px", borderRadius: 6, fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-block" }}
        >
          Start free
        </Link>
      </section>

      <footer style={{ padding: "32px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", fontSize: 12, color: TEXT_3 }}>
        <div>
          <span style={{ color: TEXT_1, fontFamily: "Syne, sans-serif", fontWeight: 600, marginRight: 12 }}>LexAnchor</span>
          © 2026 · Legal Intelligence · Information only, not legal advice
        </div>
        <nav style={{ display: "flex", gap: 18 }}>
          <Link href="/login" style={{ color: TEXT_3, textDecoration: "none" }}>Sign in</Link>
          <Link href="/pricing" style={{ color: TEXT_3, textDecoration: "none" }}>Pricing</Link>
          <Link href="/privacy" style={{ color: TEXT_3, textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ color: TEXT_3, textDecoration: "none" }}>Terms</Link>
          <a href="mailto:jose@lexanchor.ai" style={{ color: TEXT_3, textDecoration: "none" }}>Contact</a>
        </nav>
      </footer>
    </main>
  );
}

function PriorityCard({ tier, title, body, color }: { tier: string; title: string; body: string; color: string }) {
  return (
    <div style={{ background: "#09071a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 22, fontWeight: 700, color }}>{tier}</span>
        <span style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 600, color: "#e0d8f8" }}>{title}</span>
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "#5a4e88" }}>{body}</p>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: "11px 18px", fontWeight: 500 };
const td: React.CSSProperties = { padding: "11px 18px" };

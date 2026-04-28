"use client";

import Link from "next/link";
import { useState } from "react";

const BG = "#06040f";
const SURFACE = "#09071a";
const TEXT_1 = "#e0d8f8";
const TEXT_2 = "#5a4e88";
const TEXT_3 = "#3a2e60";
const PURPLE = "#7045e8";
const PURPLE_LIGHT = "#9468f5";

const TOUR = [
  {
    n: "01",
    title: "Upload a contract",
    body: "Drop any PDF — NDA, MSA, employment offer, lease, vendor agreement. We accept files up to 25MB. The analyzer reads every page and never retains the source document beyond the analysis."
  },
  {
    n: "02",
    title: "Read the priority breakdown",
    body: "Risks classified into three tiers. P0 = walk-away clauses (unilateral indemnity, hidden auto-renewal, IP grab). P1 = scoring concerns (vague SLAs, ambiguous termination). P2 = polish (typos, formatting, minor renumbering)."
  },
  {
    n: "03",
    title: "Get plain-English translations",
    body: "Every clause is rewritten in clear language. \"Mutual general release of claims, known and unknown, arising out of or related to the subject matter hereof\" becomes: \"You both agree not to sue each other over anything connected to this deal.\""
  },
  {
    n: "04",
    title: "Use the negotiation playbook",
    body: "Each P0/P1 risk includes a redline suggestion and rationale. Copy-paste into your counter-draft, or export the full playbook as PDF for your attorney to review."
  },
  {
    n: "05",
    title: "Track renewals and obligations",
    body: "Every analyzed contract auto-loads into your dashboard with key dates: renewal, termination notice deadline, payment milestones. Alerts fire 60/30/7 days out."
  }
];

const MODULES = [
  {
    title: "P0 / P1 / P2 — what makes a clause walk-away?",
    body: "P0 risks are clauses that, if signed as-written, can destroy the deal economics or expose you to unbounded liability. Examples: unlimited indemnification, IP assignment of pre-existing work, perpetual exclusivity, automatic renewal with no opt-out window. P1 risks are scoring concerns — clauses that aren't fatal but materially shift leverage: one-way confidentiality, vague SLAs, broad non-competes, ambiguous termination. P2 risks are polish: typos, mis-numbered exhibits, undefined terms, signature block errors. Every analysis ranks the contract on a 0–100 risk score weighted by tier."
  },
  {
    title: "NDA structure — mutual vs one-way",
    body: "One-way (unilateral) NDAs: only one party discloses confidential info. Common for vendor pitches, hiring interviews, M&A targets. Mutual NDAs: both parties exchange confidential info. Insist on mutual whenever you'll share anything proprietary back. Watch the term length (2 years standard for general business; 5+ years for trade secrets), the residual knowledge clause (employees can't unsee what they've seen), and the destruction-vs-return obligation. Carve out: pre-existing knowledge, independently developed info, info from third parties without breach."
  },
  {
    title: "MSA + SOW — where the risks live",
    body: "Master Service Agreement (MSA) sets the framework — payment terms, IP ownership, liability cap, indemnification, term, termination. Statement of Work (SOW) is project-specific — scope, deliverables, timeline, milestones. Risks: MSA limitation of liability that doesn't carve out IP indemnity (catastrophic if you indemnify for IP); MSA payment terms that conflict with SOW (always specify which controls); change-order pricing left ambiguous (\"to be agreed\" = vendor leverage). Always read MSA + SOW + Order Form together — they form the whole contract."
  },
  {
    title: "Employment offers — what to negotiate",
    body: "Salary is the obvious lever, but the high-impact items are: equity vesting (4-year/1-year cliff is standard; double-trigger acceleration on change-of-control protects you), at-will modification (most US states default at-will; severance triggers matter), non-compete scope (post-employment restrictions vary by state — California and ND are nearly unenforceable; Texas, Florida, Massachusetts strict), IP assignment (carve out pre-existing work, side projects), and arbitration clause (waive jury trial, class action — read carefully)."
  }
];

const GLOSSARY = [
  ["Indemnification", "One party agrees to cover losses incurred by the other from specified events."],
  ["Limitation of Liability", "Cap on damages — usually fees paid in last 12 months. Carve-outs: IP, confidentiality, willful misconduct."],
  ["Force Majeure", "Excuses performance during extraordinary events (acts of God, war, pandemics)."],
  ["Severability", "If one clause is unenforceable, the rest of the contract survives."],
  ["Choice of Law", "Which state/country's law governs interpretation."],
  ["Forum Selection", "Where disputes get litigated — venue, often paired with choice of law."],
  ["Liquidated Damages", "Pre-agreed dollar amount for specific breach (e.g., $X per day late)."],
  ["Material Breach", "A breach significant enough to justify termination."],
  ["Cure Period", "Time given to fix a breach before termination is allowed."],
  ["Survival Clause", "Lists which clauses remain in force after the contract ends."],
  ["Assignment", "Whether one party can transfer rights/obligations to a third party."],
  ["Non-Compete", "Post-employment/post-deal restriction on competing activities."],
  ["Non-Solicit", "Restriction on poaching employees or customers."],
  ["MFN", "Most Favored Nation — guarantees the best price/terms offered to anyone else."],
  ["NDA", "Non-Disclosure Agreement — confidentiality covenant."],
  ["MSA", "Master Service Agreement — framework contract for ongoing services."],
  ["SOW", "Statement of Work — project-specific deliverables under an MSA."],
  ["DPA", "Data Processing Addendum — required under GDPR/CCPA when handling personal data."]
];

export default function LearnPage() {
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [openTour, setOpenTour] = useState<number | null>(0);

  return (
    <main style={{ background: BG, minHeight: "100vh", padding: "80px 40px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <Link href="/" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: TEXT_3, textDecoration: "none" }}>
          ← LexAnchor
        </Link>

        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: TEXT_2, letterSpacing: "0.22em", textTransform: "uppercase", margin: "24px 0 12px" }}>
          Learn
        </p>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 44, fontWeight: 700, color: TEXT_1, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 14 }}>
          Contracts,<br /><span style={{ color: PURPLE_LIGHT }}>without the law degree.</span>
        </h1>
        <p style={{ fontSize: 16, color: TEXT_2, marginBottom: 52, maxWidth: 600, lineHeight: 1.7, fontWeight: 300 }}>
          Five steps to your first analysis. Four modules on the clauses that actually matter. A glossary you'll come back to.
        </p>

        <Section label="Tour">
          {TOUR.map((step, i) => (
            <Card
              key={step.n}
              n={step.n}
              title={step.title}
              body={step.body}
              open={openTour === i}
              onClick={() => setOpenTour(openTour === i ? null : i)}
            />
          ))}
        </Section>

        <Section label="Modules">
          {MODULES.map((m, i) => (
            <Card
              key={m.title}
              n={`0${i + 1}`}
              title={m.title}
              body={m.body}
              open={openModule === i}
              onClick={() => setOpenModule(openModule === i ? null : i)}
            />
          ))}
        </Section>

        <Section label="Glossary">
          <div style={{ background: SURFACE, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
            {GLOSSARY.map(([term, def]) => (
              <div key={term} style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: 16 }}>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: PURPLE_LIGHT }}>{term}</p>
                <p style={{ fontSize: 13, color: TEXT_2, lineHeight: 1.6 }}>{def}</p>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ marginTop: 48, padding: "20px 24px", background: "rgba(112,69,232,0.08)", border: `1px solid ${PURPLE}33`, borderRadius: 10 }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: PURPLE_LIGHT, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>
            Ready
          </p>
          <p style={{ fontSize: 16, color: TEXT_1, marginBottom: 12, lineHeight: 1.5 }}>
            First contract is free. No card. No commitment.
          </p>
          <Link href="/signup" style={{ display: "inline-block", padding: "10px 20px", background: PURPLE, color: TEXT_1, textDecoration: "none", fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 600, borderRadius: 6 }}>
            Start free →
          </Link>
        </div>

        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: TEXT_3, lineHeight: 1.7, marginTop: 32 }}>
          LexAnchor provides information only — not legal advice. Material decisions warrant attorney review.
        </p>
      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: TEXT_3, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 16 }}>
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function Card({ n, title, body, open, onClick }: { n: string; title: string; body: string; open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        background: SURFACE,
        border: open ? `1px solid ${PURPLE}55` : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "16px 20px",
        cursor: "pointer",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "inherit"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: PURPLE_LIGHT, flexShrink: 0 }}>{n}</p>
        <p style={{ fontSize: 14, color: TEXT_1, flex: 1, fontWeight: 500 }}>{title}</p>
        <p style={{ color: TEXT_3, fontSize: 18 }}>{open ? "−" : "+"}</p>
      </div>
      {open && (
        <p style={{ marginTop: 12, marginLeft: 27, fontSize: 13, color: TEXT_2, lineHeight: 1.7 }}>{body}</p>
      )}
    </button>
  );
}

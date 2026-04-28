import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LexAnchor Pricing — Legal Intelligence",
  description:
    "Unlimited contract reviews. Individual $99/mo · Professional $199/mo · Business $499/mo · Law Firm $999/mo. First contract free."
};

const tiers = [
  {
    name: "Individual",
    price: "$99",
    term: "Month-to-month · cancel anytime",
    featured: false,
    features: [
      "10 contracts / month",
      "P0/P1/P2 risk prioritization",
      "Plain-English summaries",
      "All contract types",
      "PDF export",
      "Renewal alerts"
    ],
    cta: { text: "Start free", href: "/signup", style: "outline" }
  },
  {
    name: "Professional",
    price: "$199",
    term: "Month-to-month · most popular",
    featured: true,
    features: [
      "Unlimited contracts",
      "Side-by-side document compare",
      "Negotiation playbook export",
      "Custom clause flagging",
      "Clause library",
      "Priority processing",
      "API access"
    ],
    cta: { text: "Start free", href: "/signup", style: "primary" }
  },
  {
    name: "Business",
    price: "$499",
    term: "Month-to-month · 5 seats",
    featured: false,
    features: [
      "Everything in Professional",
      "5 user seats",
      "Team-shared library",
      "SSO / SAML",
      "Custom playbooks",
      "Audit log",
      "Dedicated onboarding"
    ],
    cta: { text: "Contact us", href: "mailto:jose@lexanchor.ai?subject=Business%20plan", style: "outline" }
  },
  {
    name: "Law Firm",
    price: "$999",
    term: "Month-to-month · 25 seats",
    featured: false,
    features: [
      "Everything in Business",
      "25 attorney seats",
      "Matter-level organization",
      "Conflict checking",
      "Client portal",
      "White-label option",
      "Custom training"
    ],
    cta: { text: "Contact us", href: "mailto:jose@lexanchor.ai?subject=Law%20Firm%20plan", style: "outline" }
  }
];

const BG = "#06040f";
const SURFACE = "#09071a";
const TEXT_1 = "#e0d8f8";
const TEXT_2 = "#5a4e88";
const TEXT_3 = "#3a2e60";
const PURPLE = "#7045e8";
const PURPLE_LIGHT = "#9468f5";

export default function PricingPage() {
  return (
    <main style={{ background: BG, minHeight: "100vh", padding: "80px 40px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link href="/" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: TEXT_3, textDecoration: "none" }}>
          ← LexAnchor
        </Link>

        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: TEXT_2, letterSpacing: "0.22em", textTransform: "uppercase", margin: "24px 0 12px" }}>
          Pricing
        </p>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 44, fontWeight: 700, color: TEXT_1, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 14 }}>
          Senior-attorney review.<br /><span style={{ color: PURPLE_LIGHT }}>One flat rate.</span>
        </h1>
        <p style={{ fontSize: 16, color: TEXT_2, marginBottom: 52, maxWidth: 560, lineHeight: 1.7, fontWeight: 300 }}>
          Every plan includes P0/P1/P2 risk prioritization, plain-English summaries, and unlimited contract types. First contract is free — no credit card.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              style={{
                background: tier.featured ? "linear-gradient(165deg, #0d0c22, #09071a)" : SURFACE,
                border: tier.featured ? `1px solid ${PURPLE}55` : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: -11, left: 24, background: PURPLE, color: TEXT_1, fontFamily: "JetBrains Mono, monospace", fontSize: 9, padding: "3px 12px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
                  Most popular
                </div>
              )}

              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: TEXT_2, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12 }}>
                {tier.name}
              </p>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 32, fontWeight: 500, color: TEXT_1, lineHeight: 1, marginBottom: 4 }}>
                {tier.price}
                <sub style={{ fontSize: 12, color: TEXT_2 }}> /mo</sub>
              </p>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: TEXT_2, marginBottom: 22 }}>
                {tier.term}
              </p>

              <ul style={{ listStyle: "none", padding: 0, flex: 1, marginBottom: 22 }}>
                {tier.features.map((f) => (
                  <li
                    key={f}
                    style={{ fontSize: 12, color: TEXT_2, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 8, lineHeight: 1.5 }}
                  >
                    <span style={{ color: PURPLE_LIGHT, flexShrink: 0 }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.cta.href}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: 12,
                  borderRadius: 6,
                  fontFamily: "Syne, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  background: tier.cta.style === "primary" ? PURPLE : "transparent",
                  color: TEXT_1,
                  border: tier.cta.style === "outline" ? "1px solid rgba(255,255,255,0.12)" : "none"
                }}
              >
                {tier.cta.text}
              </Link>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: TEXT_2, padding: "13px 16px", background: "rgba(112,69,232,0.08)", border: `1px solid ${PURPLE}33`, borderRadius: 5, display: "flex", alignItems: "center", gap: 9, marginBottom: 32 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: PURPLE_LIGHT, flexShrink: 0, display: "inline-block" }} />
          First contract is free — no credit card required. Upload any agreement and see the full P0/P1/P2 report in under 60 seconds.
        </div>

        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: TEXT_3, lineHeight: 1.7, marginTop: 48 }}>
          LexAnchor provides information only — not legal advice. Material decisions warrant attorney review.
          <br />© 2026 LexAnchor · Legal Intelligence
        </p>
      </div>
    </main>
  );
}

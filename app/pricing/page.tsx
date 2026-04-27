import Link from "next/link";

const FAQ = [
  {
    q: "Is this legal advice?",
    a: "No. LexAnchor provides information only — descriptive analysis of what your contract says and what risks may exist. We do not represent you, take instructions from you, or form an attorney-client relationship. For material decisions, consult a licensed attorney."
  },
  {
    q: "What document types do you support?",
    a: "Employment offers, leases, NDAs, freelance contracts, terms of service, service agreements, and most other US-style commercial contracts. The analyzer adapts to whatever it reads — if your document doesn't match a common template, the engine still returns a clause-by-clause breakdown."
  },
  {
    q: "How accurate is the analysis?",
    a: "Senior-attorney-grade — but not a substitute for one. The model reads every page and surfaces risks a careful reader should not miss. It does not interpret jurisdiction-specific case law, predict outcomes, or replace a litigator. Treat it as a smart pre-read before your attorney call."
  },
  {
    q: "What about data privacy?",
    a: "Documents are processed in-memory and not retained beyond the analysis. The structured findings (clause names, risk levels, plain-English summaries) are stored under your account so you can revisit them. No third-party training. No cross-customer data sharing."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Month-to-month, no commitment. Annual pricing available — email support@lexanchor.ai."
  },
  {
    q: "Do you support languages other than English?",
    a: "English-only at launch. Spanish coming next."
  }
];

export default function PricingPage() {
  return (
    <main>
      <header className="px-6 md:px-10 py-6 flex items-center justify-between border-b border-border">
        <Link href="/" className="font-display text-xl text-text tracking-tight">LexAnchor</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-text-2 hover:text-text">Home</Link>
          <Link href="/login" className="px-4 py-2 border border-border-2 text-text hover:border-gold hover:text-gold transition-colors">Sign in</Link>
        </nav>
      </header>

      <section className="px-6 md:px-10 pt-24 pb-20 max-w-5xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Pricing</p>
        <h1 className="mt-6 font-display text-5xl md:text-6xl text-text font-light leading-tight">
          Two tiers.<br />Both unlimited.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-text-2 leading-relaxed">
          Pricing built around a single principle: contract review should cost less than the smallest decision it informs.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <PricingCard
            tier="Individual"
            price="$15"
            tagline="Personal contracts. Job offers. Apartment leases."
            features={[
              "Unlimited analyses",
              "All document types",
              "Plain-English summaries",
              "Red flag prioritization (P0 / P1 / P2)",
              "Negotiation hints",
              "PDF export",
              "Clause library"
            ]}
            cta={{ label: "Start individual", href: "/login" }}
          />
          <PricingCard
            tier="Business"
            price="$49"
            tagline="Vendor contracts. SOWs. NDAs. Hiring agreements."
            features={[
              "Everything in Individual",
              "5 user seats",
              "Team-shared clause library",
              "Side-by-side document compare",
              "Custom clause flagging rules",
              "API access",
              "Priority processing",
              "Negotiation playbook export"
            ]}
            cta={{ label: "Start business", href: "/login" }}
            highlighted
          />
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-3 mb-3">FAQ</p>
          <h2 className="font-display text-3xl md:text-4xl text-text font-light mb-12">Common questions</h2>
          <div className="space-y-px bg-border">
            {FAQ.map((item) => (
              <details key={item.q} className="group bg-bg p-6">
                <summary className="cursor-pointer flex items-center justify-between text-text font-display text-lg">
                  <span>{item.q}</span>
                  <span className="text-gold font-mono text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-text-2 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-4">Disclosure</p>
          <p className="font-display text-xl md:text-2xl text-text font-light italic max-w-3xl mx-auto leading-relaxed">
            LexAnchor provides information only — not legal advice. Material decisions warrant attorney review.
          </p>
        </div>
      </section>

      <footer className="border-t border-border px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-display text-lg text-text">LexAnchor</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-text-3 font-mono">
            <span>lexanchor.ai</span>
            <span>support@lexanchor.ai</span>
            <span>© 2026 Apex Empire</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function PricingCard({
  tier, price, tagline, features, cta, highlighted
}: {
  tier: string;
  price: string;
  tagline: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
}) {
  return (
    <div className="bg-bg p-10">
      <p className={`font-mono text-xs uppercase tracking-[0.25em] mb-5 ${highlighted ? "text-gold" : "text-text-3"}`}>
        {tier}
      </p>
      <p className="font-display text-5xl md:text-6xl text-text font-light">
        {price}<span className="text-text-2 text-2xl">/mo</span>
      </p>
      <p className="mt-3 text-text-2 text-sm leading-relaxed">{tagline}</p>
      <ul className="mt-8 space-y-3 text-sm text-text">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="text-gold">—</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={`mt-10 inline-flex items-center justify-center w-full px-6 py-3.5 font-medium tracking-wide transition-colors ${
          highlighted
            ? "bg-gold text-bg hover:bg-gold-dim"
            : "border border-border-2 text-text hover:border-gold hover:text-gold"
        }`}
      >
        {cta.label}
      </Link>
    </div>
  );
}

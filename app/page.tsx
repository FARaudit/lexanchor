import Link from "next/link";
import WaitlistForm from "./_components/waitlist-form";

const DOC_TYPES = [
  { label: "Employment Offer", body: "Compensation, equity vesting, non-compete scope, IP assignment, severance triggers." },
  { label: "Lease", body: "Renewal terms, fee escalation, security deposit return, repair obligations, sublet rules." },
  { label: "NDA", body: "Definition of confidential info, term length, residual knowledge, return obligations, exceptions." },
  { label: "Freelance Contract", body: "Scope creep clauses, payment terms, IP ownership, kill fees, indemnification." },
  { label: "Terms of Service", body: "Arbitration clauses, class-action waivers, content licenses, termination rights, data use." },
  { label: "Service Agreement", body: "SLA penalties, auto-renewal, liability caps, exclusivity, change-order pricing." }
];

const STEPS = [
  { n: "01", title: "Upload document", body: "Drop a PDF. We never store it longer than the analysis." },
  { n: "02", title: "AI analysis", body: "Three parallel calls — overview, every clause, every red flag." },
  { n: "03", title: "Plain English report", body: "Risk score. Negotiation suggestions. What an attorney would catch." }
];

export default function LandingPage() {
  return (
    <main>
      <header className="px-6 md:px-10 py-6 flex items-center justify-between border-b border-border">
        <Link href="/" className="font-display text-xl text-text tracking-tight">LexAnchor</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="#how" className="text-text-2 hover:text-text">How it works</Link>
          <Link href="#pricing" className="text-text-2 hover:text-text">Pricing</Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-border-2 text-text hover:border-gold hover:text-gold transition-colors"
          >
            Sign in
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-10 pt-24 md:pt-32 pb-20 max-w-6xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          AI Legal Intelligence
        </p>
        <h1 className="mt-8 font-display font-light text-5xl sm:text-6xl md:text-7xl tracking-tight text-text leading-[1.05]">
          Your contracts.<br />
          Senior attorney review.<br />
          <span className="text-gold">60 seconds.</span>
        </h1>
        <p className="mt-10 max-w-2xl text-lg md:text-xl text-text-2 leading-relaxed font-body">
          LexAnchor analyzes every clause, flags every risk, explains every term — in plain English.
        </p>
        <div className="mt-12">
          <WaitlistForm />
        </div>
        <div className="mt-20 h-px bg-gradient-to-r from-gold via-gold-dim to-transparent" />
      </section>

      {/* Document types */}
      <section className="px-6 md:px-10 pb-32 max-w-6xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-3 mb-3">Coverage</p>
        <h2 className="font-display text-3xl md:text-4xl text-text font-light mb-12 max-w-3xl">
          Every document a non-lawyer signs.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {DOC_TYPES.map((d) => (
            <div key={d.label} className="bg-bg p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-4">{d.label}</p>
              <p className="text-text-2 leading-relaxed text-[15px]">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-3 mb-3">Process</p>
          <h2 className="font-display text-3xl md:text-4xl text-text font-light mb-14 max-w-3xl">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-mono text-xs text-gold tracking-[0.25em]">{s.n}</p>
                <h3 className="mt-4 font-display text-2xl text-text font-light">{s.title}</h3>
                <p className="mt-3 text-text-2 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-4">Disclosure</p>
          <p className="font-display text-xl md:text-2xl text-text font-light italic max-w-3xl leading-relaxed">
            Information only. Not legal advice. Not a substitute for an attorney. LexAnchor describes what your contract says and flags potential risks; it does not represent you, take instructions from you, or form an attorney-client relationship.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-3 mb-3">Pricing</p>
          <h2 className="font-display text-3xl md:text-4xl text-text font-light mb-14">Two tiers.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border max-w-4xl">
            <div className="bg-bg p-10">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-3 mb-5">Individual</p>
              <p className="font-display text-5xl text-text font-light">$15<span className="text-text-2 text-2xl">/mo</span></p>
              <ul className="mt-8 space-y-3 text-sm text-text">
                <li className="flex items-start gap-3"><span className="text-gold">—</span> 10 analyses / month</li>
                <li className="flex items-start gap-3"><span className="text-gold">—</span> Full clause breakdown + risk flags</li>
                <li className="flex items-start gap-3"><span className="text-gold">—</span> Plain-English explainer</li>
                <li className="flex items-start gap-3"><span className="text-gold">—</span> Export to PDF</li>
              </ul>
            </div>
            <div className="bg-bg p-10">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-5">Business</p>
              <p className="font-display text-5xl text-text font-light">$49<span className="text-text-2 text-2xl">/mo</span></p>
              <ul className="mt-8 space-y-3 text-sm text-text">
                <li className="flex items-start gap-3"><span className="text-gold">—</span> Unlimited analyses</li>
                <li className="flex items-start gap-3"><span className="text-gold">—</span> Side-by-side document compare</li>
                <li className="flex items-start gap-3"><span className="text-gold">—</span> Negotiation playbook export</li>
                <li className="flex items-start gap-3"><span className="text-gold">—</span> 5 user seats</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-display text-lg text-text">LexAnchor</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-text-3 font-mono">
            <span>lexanchor.ai</span>
            <a href="mailto:jose@lexanchor.ai" className="hover:text-text">jose@lexanchor.ai</a>
            <Link href="/privacy" className="hover:text-text">Privacy</Link>
            <Link href="/terms" className="hover:text-text">Terms</Link>
            <span>© 2026 LexAnchor Inc.</span>
            <span>Information only, not legal advice.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

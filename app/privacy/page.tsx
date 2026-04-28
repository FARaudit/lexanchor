import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — LexAnchor",
  description: "How LexAnchor handles your legal documents."
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-12 max-w-3xl mx-auto">
      <Link href="/" className="text-text-3 hover:text-text-2 text-xs">← Home</Link>
      <h1 className="font-display text-3xl text-text font-medium mt-4">Privacy Policy</h1>
      <p className="mt-2 text-text-3 text-xs font-mono">Effective April 27, 2026</p>

      <section className="mt-8 space-y-6 text-sm leading-relaxed text-text-2">
        <div className="border border-warn/40 bg-warn/5 p-4 text-warn">
          <p className="font-medium">⚠️ Attorney-client privilege.</p>
          <p className="mt-2 text-text-2 text-sm">
            LexAnchor is information-only software, not a law firm. Submitting a document does NOT create an attorney-client relationship and is not protected by attorney-client privilege. If you need privilege, work directly with a licensed attorney.
          </p>
        </div>

        <Block title="Information we collect">
          LexAnchor collects (a) account info on sign-up — name, email; (b) legal documents and clause text you upload or paste for analysis; (c) saved clauses you mark for your library; (d) matters and contracts you track; (e) usage telemetry needed to operate the service.
        </Block>
        <Block title="How we use it">
          Document content is sent to our analysis pipeline (Anthropic Claude via authenticated server-side calls) only to produce the analysis you requested. Saved clauses and analysis outputs are stored on your account so you can re-open them. We do not train external models on your data. We do not sell or rent your documents.
        </Block>
        <Block title="Where it lives">
          Documents and outputs are stored in Supabase (Postgres) with row-level security — only you can read your rows. Encryption in transit (TLS) and at rest (AES-256). Service-role keys live only in our server environment.
        </Block>
        <Block title="Third parties">
          Anthropic for analysis. Supabase for storage and auth. Resend for transactional email. Vercel for hosting. Each is a sub-processor with its own privacy commitments. We do not share documents with marketing or advertising vendors.
        </Block>
        <Block title="Your rights">
          You may request access, correction, or deletion at any time. /settings exposes one-click account deletion (CCPA-compliant). Email <a href="mailto:jose@lexanchor.ai" className="text-accent">jose@lexanchor.ai</a> for anything not exposed in-product.
        </Block>
        <Block title="Document deletion">
          Deleting an analysis or matter removes it from your view and queues it for permanent deletion within 30 days. Deleting your account purges all your documents within 24 hours. Backups are rotated on a 35-day schedule.
        </Block>
        <Block title="Changes">
          Material changes posted here with 30-day email notice to active users.
        </Block>
        <Block title="Contact">
          <a href="mailto:jose@lexanchor.ai" className="text-accent">jose@lexanchor.ai</a> · LexAnchor · Operated under Woof Management LLC.
        </Block>
      </section>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg text-text font-medium">{title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}

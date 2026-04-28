import Link from "next/link";

export const metadata = {
  title: "Terms of Service — LexAnchor",
  description: "LexAnchor Terms of Service."
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-12 max-w-3xl mx-auto">
      <Link href="/" className="text-text-3 hover:text-text-2 text-xs">← Home</Link>
      <h1 className="font-display text-3xl text-text font-medium mt-4">Terms of Service</h1>
      <p className="mt-2 text-text-3 text-xs font-mono">Effective April 27, 2026</p>

      <section className="mt-8 space-y-6 text-sm leading-relaxed text-text-2">
        <div className="border border-warn/40 bg-warn/5 p-4 text-warn">
          <p className="font-medium">⚠️ Not legal advice.</p>
          <p className="mt-2 text-text-2 text-sm">
            LexAnchor outputs are information-only. Nothing on this platform is legal advice and does not create an attorney-client relationship. Material decisions — contract execution, litigation strategy, regulatory positioning — should be reviewed by qualified counsel licensed in your jurisdiction.
          </p>
        </div>

        <Block title="Service">
          LexAnchor analyzes legal documents, surfaces clause-level risks, builds a personal clause library, and helps you track matters and contracts.
        </Block>
        <Block title="Your obligations">
          You will (a) keep credentials confidential, (b) only upload documents you have authority to analyze, (c) not upload privileged material expecting privilege protection (LexAnchor is not a law firm), (d) not attempt to reverse-engineer the analysis pipeline, (e) not abuse rate limits.
        </Block>
        <Block title="Account">
          We may suspend accounts that violate these terms. You may delete your account at any time from /settings; deletion is irreversible.
        </Block>
        <Block title="Limitation of liability">
          Service is provided AS IS. To the maximum extent permitted, LexAnchor and Woof Management LLC are not liable for outcomes of any contract executed, decision made, or position taken based on platform output. Our aggregate liability for any claim is limited to the amount you paid in the 12 months preceding the claim.
        </Block>
        <Block title="Governing law">
          Delaware law. Disputes resolved in Delaware state and federal courts.
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

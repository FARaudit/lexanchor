export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#1A1A2E", color: "#e2e8f2", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Terms of Service</h1>
        <p style={{ fontSize: "13px", color: "#6b6b8a", marginBottom: "32px" }}>Last updated: April 29, 2026</p>
        <div style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.8 }}>
          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#e2e8f2" }}>Not legal advice.</strong> LexAnchor is a legal intelligence platform. Analysis provided by LexAnchor is not legal advice and does not create an attorney-client relationship. For P0-flagged clauses, consult a licensed attorney before signing.
          </p>
          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#e2e8f2" }}>Service.</strong> LexAnchor provides AI-assisted contract analysis including risk classification, plain English explanations, and negotiation scripts.
          </p>
          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#e2e8f2" }}>Subscription.</strong> Plans are billed monthly. Cancel any time. No refunds on current billing period.
          </p>
          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#e2e8f2" }}>Contact:</strong> jose@lexanchor.ai
          </p>
        </div>
      </div>
    </main>
  );
}

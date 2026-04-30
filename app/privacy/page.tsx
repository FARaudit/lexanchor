export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#1A1A2E", color: "#e2e8f2", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Privacy Policy</h1>
        <p style={{ fontSize: "13px", color: "#6b6b8a", marginBottom: "32px" }}>Last updated: April 29, 2026</p>
        <div style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.8 }}>
          <p style={{ marginBottom: "16px" }}>LexAnchor Inc. operates lexanchor.ai. We are a legal intelligence platform, not a law firm. LexAnchor does not provide legal advice.</p>
          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#e2e8f2" }}>Contract data:</strong> Contracts you upload are processed to generate analysis. We do not use your contract data to train models. Data is encrypted at rest and in transit.
          </p>
          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#e2e8f2" }}>Data we do not sell:</strong> We do not sell personal data or contract content to third parties.
          </p>
          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#e2e8f2" }}>Contact:</strong> jose@lexanchor.ai
          </p>
        </div>
      </div>
    </main>
  );
}

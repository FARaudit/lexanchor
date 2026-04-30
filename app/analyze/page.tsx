import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyze Contract — LexAnchor Legal Intelligence",
  description: "Upload any contract and get P0/P1/P2 risk classification, plain English explanations, and negotiation scripts in seconds."
};

const TRAPS = [
  { clause: "IP ownership — pre-existing work", detail: '"All work product created during the engagement, including pre-existing work, is assigned to Client."' },
  { clause: "Auto-renewal trap", detail: '"This agreement shall automatically renew for successive one-year terms unless cancelled 60 days prior."' },
  { clause: "Personal guarantee", detail: '"Signatory agrees to be personally liable for all obligations of the contracting entity."' },
  { clause: "Overly broad non-compete", detail: '"Signatory agrees not to work in a competing capacity within 50 miles for 24 months."' }
];

export default function AnalyzePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#1A1A2E", color: "#e2e8f2", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", color: "#C4B5FD", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
            Contract Analysis
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#e2e8f2", marginBottom: "8px" }}>Paste or upload any contract</h1>
          <p style={{ fontSize: "14px", color: "#6b6b8a", lineHeight: 1.7 }}>
            LexAnchor reads every clause, classifies each as P0 (do not sign), P1 (negotiate), or P2 (understand and accept), and gives you the exact negotiation language for every flag.
          </p>
        </div>

        <div style={{ background: "#0F0F1E", border: "1px dashed #4C1D95", borderRadius: "12px", padding: "48px 24px", textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📄</div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#e2e8f2", marginBottom: "6px" }}>Drop your contract here</div>
          <div style={{ fontSize: "13px", color: "#6b6b8a", marginBottom: "20px" }}>PDF, Word, or plain text · Up to 50 pages</div>
          <a
            href="/signup"
            style={{ display: "inline-block", padding: "10px 24px", background: "#6C63FF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", marginRight: "10px", textDecoration: "none" }}
          >
            Upload contract
          </a>
          <a
            href="/signup"
            style={{ display: "inline-block", padding: "10px 24px", background: "transparent", border: ".5px solid #4C1D95", color: "#C4B5FD", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
          >
            Paste text
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
          {[
            { label: "P0 FLAGS", color: "#EF4444", desc: "Do not sign without removing or rewriting these clauses" },
            { label: "P1 FLAGS", color: "#F59E0B", desc: "Negotiate these before signing — scripts provided" },
            { label: "P2 FLAGS", color: "#10B981", desc: "Understand and accept — plain English explanation" }
          ].map((f) => (
            <div key={f.label} style={{ background: "#0F0F1E", border: `.5px solid ${f.color}40`, borderRadius: "8px", padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: f.color, letterSpacing: ".08em", marginBottom: "6px" }}>{f.label}</div>
              <div style={{ fontSize: "12px", color: "#6b6b8a", lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#0F0F1E", border: ".5px solid #2D1B69", borderRadius: "10px", padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "#6b6b8a", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "14px" }}>
            Most common P0 flags LexAnchor catches
          </div>
          {TRAPS.map((t) => (
            <div key={t.clause} style={{ padding: "10px 0", borderBottom: ".5px solid #2D1B69" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "3px" }}>
                <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "3px", background: "rgba(239,68,68,.15)", color: "#EF4444", fontWeight: 700 }}>P0</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f2" }}>{t.clause}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#6b6b8a", fontStyle: "italic", paddingLeft: "36px", lineHeight: 1.5 }}>{t.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

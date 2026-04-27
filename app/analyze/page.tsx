"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DOC_TYPES = [
  "",
  "Employment offer",
  "Lease",
  "NDA",
  "Freelance contract",
  "Terms of Service",
  "Service agreement",
  "Other"
];

export default function AnalyzePage() {
  const router = useRouter();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError(null);
    } else if (file) {
      setError("Only PDF files are accepted.");
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    setDragActive(active);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pdfFile) {
      setError("Upload a PDF first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      if (docType) formData.append("document_type", docType);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed");
        setSubmitting(false);
        return;
      }
      router.push(`/analyze/${data.analysisId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl text-text">LexAnchor</Link>
        <Link href="/dashboard" className="text-sm text-text-2 hover:text-text font-mono uppercase tracking-wider">
          Dashboard
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-3">Analyze</p>
          <h1 className="font-display text-4xl md:text-5xl text-text font-light">Upload a document</h1>
          <p className="mt-4 text-text-2 leading-relaxed">
            We&apos;ll run three parallel calls — <span className="text-text">overview</span>, <span className="text-text">every clause</span>, and <span className="text-text">every red flag</span> — and return a plain-English report in about 60 seconds.
          </p>

          {submitting ? (
            <div className="mt-14 border border-gold/40 bg-gold/5 p-12 text-center">
              <div className="inline-flex gap-2 mb-8">
                <span className="w-2.5 h-2.5 bg-gold rounded-full" style={{ animation: "dotPulse 1.4s infinite", animationDelay: "0ms" }} />
                <span className="w-2.5 h-2.5 bg-gold rounded-full" style={{ animation: "dotPulse 1.4s infinite", animationDelay: "200ms" }} />
                <span className="w-2.5 h-2.5 bg-gold rounded-full" style={{ animation: "dotPulse 1.4s infinite", animationDelay: "400ms" }} />
              </div>
              <p className="font-display text-2xl text-text">Reading every clause</p>
              <p className="mt-3 text-text-2 text-sm font-mono uppercase tracking-wider">
                Overview · Clauses · Risks
              </p>
              <p className="mt-2 text-text-3 text-xs">~60 seconds</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-text-3 mb-3 font-mono">
                  Document type (optional)
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-bg border border-border text-text px-4 py-3.5 focus:outline-none focus:border-gold transition-colors font-body"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>{t || "— Auto-detect —"}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-text-3 mb-3 font-mono">
                  PDF
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => handleDrag(e, true)}
                  onDragEnter={(e) => handleDrag(e, true)}
                  onDragLeave={(e) => handleDrag(e, false)}
                  className={`border-2 border-dashed transition-colors px-6 py-12 text-center ${
                    dragActive ? "border-gold bg-gold/5" : "border-border bg-surface/40 hover:border-border-2"
                  }`}
                >
                  {pdfFile ? (
                    <div>
                      <p className="font-mono text-sm text-text">{pdfFile.name}</p>
                      <p className="text-text-3 text-xs mt-2 font-mono">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button type="button" onClick={() => setPdfFile(null)} className="mt-4 text-xs text-text-3 underline hover:text-text-2 font-mono">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-text-2 text-sm">Drop a PDF here or</p>
                      <label className="inline-block mt-2 cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          className="hidden"
                          onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                        />
                        <span className="text-gold underline hover:text-gold-dim">browse files</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!pdfFile}
                className="w-full bg-gold text-bg py-4 font-medium tracking-wide hover:bg-gold-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Run analysis
              </button>

              {error && (
                <div className="border-l-2 border-red bg-red/5 p-4 text-sm text-red">{error}</div>
              )}
            </form>
          )}

          <p className="mt-10 text-xs text-text-3 leading-relaxed italic">
            LexAnchor provides information only. Not legal advice. Not a substitute for an attorney.
          </p>
        </div>
      </main>
    </div>
  );
}

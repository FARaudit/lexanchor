"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DOC_TYPES = [
  "",
  "NDA",
  "Service Agreement",
  "Employment offer",
  "IP Assignment",
  "Vendor Contract",
  "Government Contract",
  "Lease",
  "Freelance contract",
  "Terms of Service",
  "Other"
];

type Mode = "upload" | "paste";

export default function AnalyzePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("upload");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
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
    if (mode === "upload" && !pdfFile) {
      setError("Upload a PDF first.");
      return;
    }
    if (mode === "paste" && pasteText.trim().length < 80) {
      setError("Paste at least 80 characters of clause text.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      let res: Response;
      if (mode === "upload" && pdfFile) {
        const formData = new FormData();
        formData.append("pdf", pdfFile);
        if (docType) formData.append("document_type", docType);
        res = await fetch("/api/analyze", { method: "POST", body: formData });
      } else {
        res = await fetch("/api/analyze/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: pasteText, document_type: docType || undefined })
        });
      }
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
              <div className="inline-flex border border-border" role="tablist">
                {(["upload", "paste"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.18em] ${
                      mode === m ? "bg-accent text-bg" : "text-text-3 hover:text-text"
                    }`}
                  >
                    {m === "upload" ? "Upload PDF" : "Paste text"}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-text-3 mb-3 font-mono">
                  Document type (optional)
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-bg border border-border text-text px-4 py-3.5 focus:outline-none focus:border-accent transition-colors"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>{t || "— Auto-detect —"}</option>
                  ))}
                </select>
              </div>

              {mode === "paste" ? (
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-text-3 mb-3 font-mono">
                    Clause text
                  </label>
                  <textarea
                    rows={12}
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Paste a clause, section, or full agreement here…"
                    className="w-full bg-bg border border-border text-text px-4 py-3 font-mono text-xs focus:outline-none focus:border-accent transition-colors"
                  />
                  <p className="mt-2 text-[11px] text-text-3">{pasteText.length} chars</p>
                </div>
              ) : (
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
                    dragActive ? "border-accent bg-accent/5" : "border-border bg-surface/40 hover:border-border-2"
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
                        <span className="text-accent underline hover:text-mid">browse files</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
              )}

              <button
                type="submit"
                disabled={mode === "upload" ? !pdfFile : pasteText.trim().length < 80}
                className="w-full bg-accent text-bg py-4 font-medium tracking-wide hover:bg-mid disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

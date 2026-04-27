"use client";

import { useState } from "react";

export default function FollowUpForm({ analysisId }: { analysisId: number }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, question })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `HTTP ${res.status}`);
      } else {
        setAnswer(data.answer || "(empty response)");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Can I negotiate the IP assignment scope?  ·  What does the cliff trigger mean in practice?  ·  Is the non-compete enforceable in California?"
          rows={4}
          className="w-full bg-surface border border-border text-text px-4 py-3 focus:outline-none focus:border-gold transition-colors resize-y font-body"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-6 py-3 bg-gold text-bg font-medium tracking-wide hover:bg-gold-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && (
        <div className="mt-4 border-l-2 border-red bg-red/5 p-4 text-sm text-red">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-6 border border-gold/30 bg-gold/5 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">Answer</p>
          <div className="text-text leading-relaxed whitespace-pre-wrap">{answer}</div>
        </div>
      )}
    </div>
  );
}

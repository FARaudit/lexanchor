"use client";

import { useState } from "react";

export interface ClausePayload {
  analysis_id: number;
  clause_name?: string | null;
  clause_text?: string | null;
  risk_level?: string | null;
  doc_type?: string | null;
  explanation?: string | null;
  citation?: string | null;
}

export default function SaveClauseButton({ payload }: { payload: ClausePayload }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/saved-clauses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2200);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "saved") {
    return (
      <span className="text-xs text-gold font-mono">✓ Saved to library</span>
    );
  }
  if (status === "error") {
    return (
      <button
        onClick={save}
        className="text-xs text-red font-mono hover:text-red"
      >
        Retry save
      </button>
    );
  }
  return (
    <button
      onClick={save}
      disabled={status === "saving"}
      className="text-xs text-text-3 hover:text-gold font-mono uppercase tracking-wider disabled:opacity-50"
    >
      {status === "saving" ? "Saving…" : "Save to library"}
    </button>
  );
}

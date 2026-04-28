"use client";

import { useMemo, useState } from "react";
import StreamingText from "@/components/StreamingText";

interface Clause {
  id: string;
  analysis_id: number | null;
  clause_name: string | null;
  clause_text: string | null;
  risk_level: string | null;
  doc_type: string | null;
  explanation: string | null;
  citation: string | null;
  notes: string | null;
  created_at: string;
}

export default function LibraryClient({ initialClauses }: { initialClauses: Clause[] }) {
  const [clauses, setClauses] = useState<Clause[]>(initialClauses);
  const [filter, setFilter] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const docTypes = useMemo(() => {
    const set = new Set<string>();
    for (const c of clauses) if (c.doc_type) set.add(c.doc_type);
    return Array.from(set).sort();
  }, [clauses]);

  const visible = clauses.filter((c) => {
    if (docTypeFilter && c.doc_type !== docTypeFilter) return false;
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (
      (c.clause_name ?? "").toLowerCase().includes(q) ||
      (c.clause_text ?? "").toLowerCase().includes(q) ||
      (c.notes ?? "").toLowerCase().includes(q)
    );
  });

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id].slice(-2)));
  }

  async function remove(id: string) {
    if (!confirm("Remove from library?")) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/saved-clauses?id=${id}`, { method: "DELETE" });
      if (res.ok) setClauses((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setBusy(null);
    }
  }

  const compareIds = selected.slice(0, 2);
  const a = clauses.find((c) => c.id === compareIds[0]);
  const b = clauses.find((c) => c.id === compareIds[1]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search clauses, notes…"
          className="bg-bg border border-border text-text px-3 py-2 text-sm w-72"
        />
        <select
          value={docTypeFilter}
          onChange={(e) => setDocTypeFilter(e.target.value)}
          className="bg-bg border border-border text-text px-3 py-2 text-sm"
        >
          <option value="">All doc types</option>
          {docTypes.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs text-text-3">{visible.length} clauses · select 2 to compare</span>
      </div>

      {visible.length === 0 ? (
        <p className="text-text-3 italic text-sm">No clauses match.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visible.map((c) => {
            const isSel = selected.includes(c.id);
            return (
              <div
                key={c.id}
                className={`border ${isSel ? "border-accent" : "border-border"} bg-surface p-4 cursor-pointer hover:bg-surface-2`}
                onClick={() => toggle(c.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-text font-medium truncate">{c.clause_name ?? "Untitled clause"}</p>
                    <p className="text-[11px] text-text-3 mt-0.5">
                      {c.doc_type ?? "—"}
                      {c.citation && ` · ${c.citation}`}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(c.id);
                    }}
                    disabled={busy === c.id}
                    className="text-[10px] uppercase tracking-wider text-red hover:text-red-dim disabled:opacity-50"
                  >
                    Del
                  </button>
                </div>
                {c.clause_text && (
                  <p className="mt-3 text-text-2 text-xs leading-relaxed line-clamp-3">{c.clause_text}</p>
                )}
                {c.explanation && (
                  <p className="mt-2 text-text-3 text-xs italic line-clamp-2">{c.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {a && b && (
        <section className="mt-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Side-by-side compare</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[a, b].map((c, i) => (
              <div key={c.id} className="border border-border bg-surface p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-text-3 mb-1">{i === 0 ? "A" : "B"}</p>
                <p className="text-text font-medium">{c.clause_name}</p>
                {c.clause_text && <p className="mt-3 text-text-2 text-xs leading-relaxed">{c.clause_text}</p>}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-3 mb-2">Market standard analysis</p>
            <StreamingText
              prompt={`Compare these two clauses against market standard for ${a.doc_type ?? "this document type"}. Identify which is more aggressive, which is closer to market, and the single biggest material difference. Surface trade-offs only — no advice.\n\nA (${a.clause_name}):\n${a.clause_text ?? ""}\n\nB (${b.clause_name}):\n${b.clause_text ?? ""}`}
              emptyState="Set ANTHROPIC_API_KEY to compare."
            />
          </div>
        </section>
      )}
    </div>
  );
}

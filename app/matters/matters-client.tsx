"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Matter {
  id: string;
  name: string;
  type: string;
  status: string;
  parties: unknown;
  key_dates: unknown;
  notes: string | null;
  created_at: string;
}

const TYPES = [
  ["vendor", "Vendor"],
  ["employment", "Employment"],
  ["ip", "IP"],
  ["litigation", "Litigation"],
  ["ma", "M&A"],
  ["regulatory", "Regulatory"],
  ["real_estate", "Real Estate"],
  ["other", "Other"]
] as const;

const STATUSES = [
  ["open", "Open"],
  ["negotiating", "Negotiating"],
  ["executed", "Executed"],
  ["closed", "Closed"],
  ["on_hold", "On Hold"]
] as const;

export default function MattersClient({ initial }: { initial: Matter[] }) {
  const router = useRouter();
  const [matters, setMatters] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("vendor");
  const [status, setStatus] = useState("open");
  const [partiesText, setPartiesText] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/matters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          status,
          parties: partiesText ? partiesText.split(",").map((s) => s.trim()).filter(Boolean) : null,
          notes
        })
      });
      const data = (await res.json()) as { matter?: Matter; error?: string };
      if (!res.ok) {
        setError(data.error || `HTTP ${res.status}`);
        return;
      }
      if (data.matter) {
        setMatters([data.matter, ...matters]);
      }
      setName("");
      setPartiesText("");
      setNotes("");
      setShowAdd(false);
      router.refresh();
    } catch {
      setError("Network");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this matter?")) return;
    const res = await fetch(`/api/matters?id=${id}`, { method: "DELETE" });
    if (res.ok) setMatters(matters.filter((m) => m.id !== id));
  }

  const grouped = STATUSES.map(([s, label]) => ({
    s,
    label,
    items: matters.filter((m) => m.status === s)
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-text-3">{matters.length} matters</p>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="bg-accent text-bg px-4 py-2 text-xs font-medium tracking-wide hover:bg-mid"
        >
          {showAdd ? "Cancel" : "+ New matter"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={create} className="border border-border bg-surface p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-text-3 mb-1">Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
                placeholder="Acme MSA renewal"
              />
            </label>
            <label>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-text-3 mb-1">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
              >
                {TYPES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-text-3 mb-1">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
              >
                {STATUSES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-[0.18em] text-text-3 mb-1">Parties (comma separated)</span>
            <input
              value={partiesText}
              onChange={(e) => setPartiesText(e.target.value)}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
              placeholder="Acme Corp, Counterparty Inc"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-[0.18em] text-text-3 mb-1">Notes</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
            />
          </label>
          {error && <p className="text-xs text-red">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-bg px-5 py-2 text-sm font-medium hover:bg-mid disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create matter"}
            </button>
          </div>
        </form>
      )}

      {matters.length === 0 ? (
        <p className="text-text-3 italic text-sm">No matters yet.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map((g) => (
            <section key={g.s}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-3 mb-3">{g.label}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {g.items.map((m) => (
                  <article key={m.id} className="border border-border bg-surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-text font-medium">{m.name}</p>
                        <p className="text-[11px] text-text-3 mt-0.5 uppercase tracking-[0.18em]">{m.type}</p>
                      </div>
                      <button
                        onClick={() => remove(m.id)}
                        className="text-[10px] uppercase tracking-wider text-red hover:text-red-dim"
                      >
                        Del
                      </button>
                    </div>
                    {Array.isArray(m.parties) && (m.parties as string[]).length > 0 && (
                      <p className="mt-2 text-xs text-text-2">{(m.parties as string[]).join(" · ")}</p>
                    )}
                    {m.notes && <p className="mt-3 text-xs text-text-3 italic">{m.notes}</p>}
                    <p className="mt-3 pt-2 border-t border-border text-[10px] text-text-3 font-mono">
                      Created {new Date(m.created_at).toLocaleDateString()}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

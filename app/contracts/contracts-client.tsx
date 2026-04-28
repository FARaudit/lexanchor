"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Contract {
  id: string;
  name: string;
  type: string | null;
  parties: unknown;
  start_date: string | null;
  end_date: string | null;
  renewal_date: string | null;
  value: number | null;
  status: string;
  obligations: unknown;
  created_at: string;
}

const STATUSES = ["active", "expired", "terminated", "draft"] as const;

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function renewalTone(days: number | null): "red" | "warn" | "info" | "muted" {
  if (days === null) return "muted";
  if (days <= 30) return "red";
  if (days <= 60) return "warn";
  if (days <= 90) return "info";
  return "muted";
}

export default function ContractsClient({ initial }: { initial: Contract[] }) {
  const router = useRouter();
  const [contracts, setContracts] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    parties: "",
    start_date: "",
    end_date: "",
    renewal_date: "",
    value: "",
    status: "active",
    obligations: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          type: form.type || null,
          parties: form.parties ? form.parties.split(",").map((s) => s.trim()).filter(Boolean) : null,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          renewal_date: form.renewal_date || null,
          value: form.value ? Number(form.value) : null,
          status: form.status,
          obligations: form.obligations ? form.obligations.split("\n").filter(Boolean) : null
        })
      });
      const data = (await res.json()) as { contract?: Contract; error?: string };
      if (!res.ok) {
        setError(data.error || `HTTP ${res.status}`);
        return;
      }
      if (data.contract) setContracts([data.contract, ...contracts]);
      setShowAdd(false);
      setForm({ name: "", type: "", parties: "", start_date: "", end_date: "", renewal_date: "", value: "", status: "active", obligations: "" });
      router.refresh();
    } catch {
      setError("Network");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this contract?")) return;
    const res = await fetch(`/api/contracts?id=${id}`, { method: "DELETE" });
    if (res.ok) setContracts(contracts.filter((c) => c.id !== id));
  }

  const upcomingRenewals = contracts
    .filter((c) => c.status === "active" && c.renewal_date)
    .map((c) => ({ ...c, days: daysUntil(c.renewal_date) }))
    .filter((c) => c.days !== null && c.days >= -1 && c.days <= 90)
    .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-text-3">{contracts.length} contracts</p>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="bg-accent text-bg px-4 py-2 text-xs font-medium tracking-wide hover:bg-mid"
        >
          {showAdd ? "Cancel" : "+ New contract"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={create} className="border border-border bg-surface p-5 mb-8 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Type">
            <input
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              placeholder="MSA · SOW · NDA · Lease"
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Parties (comma)">
            <input
              value={form.parties}
              onChange={(e) => setForm({ ...form, parties: e.target.value })}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Start">
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm font-mono"
            />
          </Field>
          <Field label="End">
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm font-mono"
            />
          </Field>
          <Field label="Renewal">
            <input
              type="date"
              value={form.renewal_date}
              onChange={(e) => setForm({ ...form, renewal_date: e.target.value })}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm font-mono"
            />
          </Field>
          <Field label="Contract value (USD)">
            <input
              type="number"
              step="any"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full bg-bg border border-border text-text px-3 py-2 text-sm font-mono"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Obligations (one per line)">
              <textarea
                rows={3}
                value={form.obligations}
                onChange={(e) => setForm({ ...form, obligations: e.target.value })}
                className="w-full bg-bg border border-border text-text px-3 py-2 text-sm"
              />
            </Field>
          </div>
          {error && <p className="md:col-span-2 text-xs text-red">{error}</p>}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-bg px-5 py-2 text-sm font-medium hover:bg-mid disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save contract"}
            </button>
          </div>
        </form>
      )}

      {upcomingRenewals.length > 0 && (
        <section className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-warn mb-3">⚠ Upcoming renewals (≤90 days)</p>
          <div className="border border-warn/40 bg-warn/5 p-4">
            <ul className="space-y-2">
              {upcomingRenewals.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between text-sm">
                  <span className="text-text font-medium">{c.name}</span>
                  <span className={`font-mono text-xs ${tone(renewalTone(c.days ?? null))}`}>
                    {c.renewal_date} · {c.days === 0 ? "today" : c.days! < 0 ? "past" : `${c.days}d`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {contracts.length === 0 ? (
        <p className="text-text-3 italic text-sm">No contracts yet.</p>
      ) : (
        <div className="border border-border bg-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-text-3">
              <tr>
                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Name</th>
                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Type</th>
                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Status</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Value</th>
                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Renewal</th>
                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">End</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal" />
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => {
                const days = daysUntil(c.renewal_date);
                return (
                  <tr key={c.id} className="border-t border-border hover:bg-surface-2">
                    <td className="px-4 py-2 text-text font-medium text-sm">{c.name}</td>
                    <td className="px-4 py-2 text-text-2 text-xs">{c.type ?? "—"}</td>
                    <td className="px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-2">{c.status}</td>
                    <td className="px-4 py-2 text-text text-right font-mono text-xs">
                      {c.value ? `$${c.value.toLocaleString("en-US")}` : "—"}
                    </td>
                    <td className={`px-4 py-2 text-xs font-mono ${tone(renewalTone(days))}`}>
                      {c.renewal_date ?? "—"}
                      {days !== null && days >= 0 && days <= 90 && ` · ${days}d`}
                    </td>
                    <td className="px-4 py-2 text-text-3 text-xs font-mono">{c.end_date ?? "—"}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => remove(c.id)}
                        className="text-[10px] uppercase tracking-wider text-red hover:text-red-dim"
                      >
                        Del
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.18em] text-text-3 mb-1">{label}</span>
      {children}
    </label>
  );
}

function tone(t: "red" | "warn" | "info" | "muted"): string {
  if (t === "red") return "text-red";
  if (t === "warn") return "text-warn";
  if (t === "info") return "text-accent";
  return "text-text-3";
}

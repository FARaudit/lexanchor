import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import StreamingText from "@/components/StreamingText";

export const dynamic = "force-dynamic";

interface AnalysisRow {
  id: number;
  filename: string | null;
  document_type: string | null;
  risk_score: number | null;
  recommendation: string | null;
  status: string;
  created_at: string;
}

export default async function DashboardPage() {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: analyses }, { count: clauseCount }, mattersResp] = await Promise.all([
    sb
      .from("analyses")
      .select("id, filename, document_type, risk_score, recommendation, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    sb.from("saved_clauses").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    sb.from("matters").select("id", { count: "exact", head: true }).eq("user_id", user.id).then(
      (r) => r,
      () => ({ count: 0 })
    )
  ]);
  const matters = (mattersResp as { count?: number | null }).count ?? 0;

  const list = (analyses ?? []) as AnalysisRow[];
  const flaggedCount = list.filter((a) => (a.risk_score ?? 0) >= 60).length;
  const avgRisk = list.length > 0 ? list.reduce((s, a) => s + (a.risk_score ?? 0), 0) / list.length : 0;

  const briefPrompt = `Today's legal intelligence brief for an in-house counsel managing vendor + employment + IP contracts. In 4 bullets:
1. New regulatory or case-law developments worth monitoring this week
2. Contract risk trends Claude expects across vendor agreements right now
3. One area to audit in the saved-clause library this week
4. One actionable next step for the day

No preamble. Bullets only. Each ≤25 words.`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-1">Dashboard</p>
          <h1 className="font-display text-3xl text-text font-medium">LexAnchor command</h1>
        </div>
        <Link
          href="/analyze"
          className="bg-accent text-bg px-4 py-2 text-sm font-medium tracking-wide hover:bg-mid"
        >
          + New analysis
        </Link>
      </header>

      <main className="px-6 md:px-10 py-8 max-w-7xl mx-auto space-y-10">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          <Stat label="Documents Analyzed" value={String(list.length)} sub="Recent 20 shown" />
          <Stat label="Clauses Saved" value={String(clauseCount ?? 0)} sub="Personal library" />
          <Stat label="Risks Flagged" value={String(flaggedCount)} tone="red" sub="Score ≥ 60" />
          <Stat label="Active Matters" value={String(matters ?? 0)} sub="Open" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Morning Brief</p>
            <StreamingText prompt={briefPrompt} emptyState="ANTHROPIC_API_KEY not set — brief unavailable." />
          </div>
          <div className="border border-border bg-surface p-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-3 mb-3">Risk exposure</p>
            <p className="font-display text-5xl text-text font-light">
              {Math.round(avgRisk)}<span className="text-text-3 text-2xl">/100</span>
            </p>
            <p className="mt-2 text-text-3 text-xs">Average risk across {list.length} analyses.</p>
          </div>
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-3 mb-3">Recent analyses</p>
          {list.length === 0 ? (
            <p className="text-text-3 italic text-sm">No analyses yet — drop your first clause.</p>
          ) : (
            <div className="border border-border bg-surface overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-text-3">
                  <tr>
                    <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Document</th>
                    <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Type</th>
                    <th className="text-right px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Risk</th>
                    <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Recommendation</th>
                    <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal">Status</th>
                    <th className="text-right px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-normal" />
                  </tr>
                </thead>
                <tbody>
                  {list.map((a) => (
                    <tr key={a.id} className="border-t border-border hover:bg-surface-2">
                      <td className="px-4 py-2 text-text text-xs truncate max-w-[28ch]">{a.filename || "Untitled"}</td>
                      <td className="px-4 py-2">
                        {a.document_type ? (
                          <span className="text-[10px] tracking-[0.18em] uppercase border border-accent/40 text-accent px-2 py-0.5">
                            {a.document_type}
                          </span>
                        ) : (
                          <span className="text-text-3">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-text text-right font-mono">{a.risk_score ?? "—"}</td>
                      <td className="px-4 py-2 text-xs">
                        {a.recommendation === "SIGN" && <span className="text-green">Sign</span>}
                        {a.recommendation === "NEGOTIATE" && <span className="text-warn">Negotiate</span>}
                        {a.recommendation === "DO_NOT_SIGN" && <span className="text-red">Do Not Sign</span>}
                        {!a.recommendation && <span className="text-text-3">—</span>}
                      </td>
                      <td className="px-4 py-2 text-xs text-text-3 uppercase">{a.status}</td>
                      <td className="px-4 py-2 text-right">
                        <Link href={`/analyze/${a.id}`} className="text-xs text-accent hover:text-mid">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "red" | "green" }) {
  const color = tone === "red" ? "text-red" : tone === "green" ? "text-green" : "text-text";
  return (
    <div className="bg-surface px-5 py-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-text-3">{label}</p>
      <p className={`mt-2 font-mono text-3xl ${color}`}>{value}</p>
      {sub && <p className="mt-1 text-[10px] text-text-3">{sub}</p>}
    </div>
  );
}

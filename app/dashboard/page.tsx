import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import SignOutButton from "./signout-button";

interface AnalysisRow {
  id: number;
  document_type: string | null;
  filename: string | null;
  risk_score: number | null;
  recommendation: string | null;
  status: string | null;
  created_at: string | null;
}

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [totalRes, completeRes, recentRes] = await Promise.all([
    supabase.from("analyses").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("analyses").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "complete"),
    supabase
      .from("analyses")
      .select("id, document_type, filename, risk_score, recommendation, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
  ]);

  const recent = (recentRes.data || []) as AnalysisRow[];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-2xl text-text">LexAnchor</Link>
          <nav className="hidden md:flex gap-6 text-sm text-text-2">
            <Link href="/dashboard" className="text-text">Dashboard</Link>
            <Link href="/analyze" className="hover:text-text">Analyze</Link>
          </nav>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-3 font-mono uppercase tracking-wider">Signed in as</p>
          <p className="text-sm text-text">{user.email}</p>
          <SignOutButton />
        </div>
      </header>

      <main className="px-6 md:px-10 py-12 md:py-16 max-w-6xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-4">Library</p>
        <h1 className="font-display text-4xl md:text-5xl text-text font-light">Dashboard</h1>
        <p className="mt-3 text-text-2">Recent analyses · upload a new document below</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <Metric label="Total Analyses" value={totalRes.count ?? 0} />
          <Metric label="Completed" value={completeRes.count ?? 0} accent="gold" />
        </div>

        {/* Upload CTA */}
        <div className="mt-14 border border-gold/30 bg-gold/5 p-8 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-2">Action</p>
            <p className="font-display text-2xl text-text font-light">Analyze a new document</p>
            <p className="mt-2 text-sm text-text-2">PDF only · ≤10 MB · ~60 seconds</p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-8 py-4 bg-gold text-bg font-medium tracking-wide hover:bg-gold-dim transition-colors whitespace-nowrap"
          >
            Upload document
          </Link>
        </div>

        {/* Recent analyses */}
        <div className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-3 mb-2">Recent</p>
          <h2 className="font-display text-2xl md:text-3xl text-text font-light mb-8">Your analyses</h2>

          {recent.length === 0 ? (
            <div className="border border-border bg-surface p-16 text-center">
              <p className="font-display text-xl text-text-2">No analyses yet.</p>
              <p className="text-sm text-text-3 mt-2 mb-6">Upload your first contract to see findings here.</p>
              <Link
                href="/analyze"
                className="inline-block px-8 py-3 bg-gold text-bg font-medium hover:bg-gold-dim transition-colors"
              >
                Analyze your first document
              </Link>
            </div>
          ) : (
            <div className="border border-border">
              {recent.map((a) => <FeedRow key={a.id} analysis={a} />)}
            </div>
          )}
        </div>

        {/* Daily intel link */}
        <div className="mt-16 mb-8 border border-border bg-surface p-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2 font-mono">Daily Brief</p>
            <p className="font-display text-xl text-text">Today&apos;s LexAnchor digest</p>
          </div>
          <a
            href="https://www.notion.so/34efaf5b931481efa727ca963c744339"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-dim text-sm font-mono"
          >
            Read in Notion →
          </a>
        </div>

        <p className="mt-8 text-xs text-text-3 font-mono italic">
          LexAnchor provides information only — not legal advice. Material decisions warrant attorney review.
        </p>
      </main>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent?: "gold" }) {
  return (
    <div className="bg-surface px-8 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-text-3 font-mono">{label}</p>
      <p className={`mt-5 font-display text-5xl md:text-6xl font-light tracking-tight ${accent === "gold" ? "text-gold" : "text-text"}`}>
        {value}
      </p>
    </div>
  );
}

function FeedRow({ analysis }: { analysis: AnalysisRow }) {
  const score = analysis.risk_score;
  let scoreColor = "text-text-3 border-text-3/40";
  if (typeof score === "number") {
    if (score < 35) scoreColor = "text-green border-green";
    else if (score < 70) scoreColor = "text-amber border-amber";
    else scoreColor = "text-red border-red";
  }

  const isPending = analysis.status === "processing" || analysis.status === "pending";
  const isFailed = analysis.status === "failed";

  return (
    <Link
      href={`/analyze/${analysis.id}`}
      className="group flex items-center justify-between gap-6 bg-surface hover:bg-surface-2 px-6 py-5 border-b border-border last:border-b-0 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs text-gold tracking-wider uppercase">
            {analysis.document_type || "Document"}
          </p>
          {isPending && <span className="font-mono text-xs text-amber uppercase">processing</span>}
          {isFailed && <span className="font-mono text-xs text-red uppercase">failed</span>}
        </div>
        <p className="mt-1.5 text-text truncate font-display text-lg">{analysis.filename || "Untitled"}</p>
        <p className="mt-1 text-xs text-text-2 font-mono">
          {analysis.recommendation && analysis.recommendation.replace(/_/g, " ")}
          {analysis.created_at && ` · ${new Date(analysis.created_at).toLocaleDateString()}`}
        </p>
      </div>

      <div className={`flex items-center justify-center w-14 h-14 rounded-full border-2 ${scoreColor} font-display text-xl`}>
        {typeof score === "number" ? score : "—"}
      </div>
    </Link>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import SignOutButton from "../dashboard/signout-button";

interface SavedClause {
  id: number;
  analysis_id: number | null;
  clause_name: string | null;
  clause_text: string | null;
  risk_level: string | null;
  doc_type: string | null;
  explanation: string | null;
  citation: string | null;
  created_at: string | null;
}

const RISK_STYLES: Record<string, string> = {
  P0: "border-red text-red bg-red/5",
  P1: "border-amber text-amber bg-amber/5",
  P2: "border-blue text-blue bg-blue/5",
  standard: "border-text-3 text-text-3 bg-text-3/5"
};

export default async function ClauseLibraryPage() {
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: clauses } = await supabase
    .from("saved_clauses")
    .select("id, analysis_id, clause_name, clause_text, risk_level, doc_type, explanation, citation, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (clauses || []) as SavedClause[];

  // Group by doc_type
  const grouped: Record<string, SavedClause[]> = {};
  for (const c of list) {
    const k = c.doc_type || "Other";
    (grouped[k] = grouped[k] || []).push(c);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-2xl text-text">LexAnchor</Link>
          <nav className="hidden md:flex gap-6 text-sm text-text-2">
            <Link href="/dashboard" className="hover:text-text">Dashboard</Link>
            <Link href="/analyze" className="hover:text-text">Analyze</Link>
            <Link href="/clause-library" className="text-text">Clause Library</Link>
          </nav>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-3 font-mono uppercase tracking-wider">Signed in as</p>
          <p className="text-sm text-text">{user.email}</p>
          <SignOutButton />
        </div>
      </header>

      <main className="px-6 md:px-10 py-12 max-w-5xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-3">Library</p>
        <h1 className="font-display text-4xl md:text-5xl text-text font-light">Saved clauses</h1>
        <p className="mt-3 text-text-2">{list.length} clause{list.length === 1 ? "" : "s"} flagged across all your analyses.</p>

        {list.length === 0 ? (
          <div className="mt-14 border border-border bg-surface p-16 text-center">
            <p className="font-display text-xl text-text-2">No saved clauses yet.</p>
            <p className="text-sm text-text-3 mt-2 mb-6">When viewing an analysis, click any clause card to save it here for cross-document reference.</p>
            <Link href="/analyze" className="inline-block px-8 py-3 bg-gold text-bg font-medium hover:bg-gold-dim transition-colors">
              Run an analysis
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {Object.entries(grouped).map(([docType, items]) => (
              <section key={docType}>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-3 mb-4">{docType}</p>
                <div className="space-y-3">
                  {items.map((c) => {
                    const badge = RISK_STYLES[c.risk_level || "standard"] || RISK_STYLES.standard;
                    return (
                      <article key={c.id} className="border border-border bg-surface p-5">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border ${badge}`}>
                            {c.risk_level || "standard"}
                          </span>
                          <p className="font-display text-lg text-text">{c.clause_name || "Untitled clause"}</p>
                          {c.citation && (
                            <span className="font-mono text-xs text-text-3 ml-auto">{c.citation}</span>
                          )}
                        </div>
                        {c.explanation && (
                          <p className="mt-3 text-text-2 leading-relaxed text-sm">{c.explanation}</p>
                        )}
                        {c.clause_text && (
                          <details className="mt-4">
                            <summary className="cursor-pointer text-xs text-gold hover:text-gold-dim font-mono">
                              Show clause text
                            </summary>
                            <p className="mt-3 text-sm text-text-2 italic border-l-2 border-gold pl-4 leading-relaxed">
                              {c.clause_text}
                            </p>
                          </details>
                        )}
                        {c.analysis_id && (
                          <Link
                            href={`/analyze/${c.analysis_id}`}
                            className="mt-4 inline-block text-xs text-gold hover:text-gold-dim font-mono uppercase tracking-wider"
                          >
                            ← back to source analysis
                          </Link>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="mt-16 text-xs text-text-3 italic font-mono">
          LexAnchor provides information only — not legal advice.
        </p>
      </main>
    </div>
  );
}

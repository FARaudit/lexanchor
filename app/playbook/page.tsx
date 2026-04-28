import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import StreamingText from "@/components/StreamingText";

export const dynamic = "force-dynamic";

interface SavedClause {
  id: string;
  clause_name: string | null;
  clause_text: string | null;
  doc_type: string | null;
  risk_level: string | null;
  citation: string | null;
  notes: string | null;
}

export default async function PlaybookPage() {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: clauses } = await sb
    .from("saved_clauses")
    .select("id, clause_name, clause_text, doc_type, risk_level, citation, notes")
    .eq("user_id", user.id);

  const list = (clauses ?? []) as SavedClause[];

  // Group by doc_type for "your standard X positions"
  const groups = new Map<string, SavedClause[]>();
  for (const c of list) {
    const key = c.doc_type ?? "Uncategorized";
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  const sortedGroups = Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 md:px-10 py-5">
        <div className="flex items-center gap-2 text-xs text-text-3 mb-2">
          <Link href="/dashboard" className="hover:text-text-2">Dashboard</Link>
          <span>›</span>
          <span className="text-text-2">Playbook</span>
        </div>
        <h1 className="font-display text-3xl text-text font-medium">Your playbook</h1>
        <p className="mt-2 text-text-2 text-sm">
          Standard positions surfaced from your saved-clause library. Claude infers the patterns; you confirm or override.
        </p>
      </header>

      <main className="px-6 md:px-10 py-8 max-w-5xl mx-auto space-y-10">
        {list.length === 0 ? (
          <p className="text-text-3 italic text-sm">No saved clauses yet — analyze a document and save your favorite positions.</p>
        ) : (
          sortedGroups.map(([docType, items]) => (
            <section key={docType}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">{docType}</p>
              <h2 className="font-display text-xl text-text font-medium mb-4">
                Your standard {docType.toLowerCase()} positions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                {items.slice(0, 6).map((c) => (
                  <div key={c.id} className="border border-border bg-surface p-4">
                    <p className="text-text font-medium text-sm">{c.clause_name ?? "Untitled"}</p>
                    {c.citation && <p className="text-[10px] text-text-3 font-mono mt-1">{c.citation}</p>}
                    {c.clause_text && (
                      <p className="mt-2 text-xs text-text-2 line-clamp-3">{c.clause_text}</p>
                    )}
                  </div>
                ))}
                {items.length > 6 && (
                  <p className="text-xs text-text-3 italic flex items-center">+ {items.length - 6} more in library</p>
                )}
              </div>

              <StreamingText
                prompt={`Across the user's saved ${docType} clauses, infer their standard playbook positions. List 3 positions they consistently take (e.g. 'limitation of liability capped at fees paid', 'IP ownership stays with vendor for pre-existing materials'). For each, give the position + 1-line justification. Surface as 3 numbered bullets. UPL-safe — no advice phrasing.\n\nClauses:\n${items.slice(0, 12).map((c, i) => `${i + 1}. ${c.clause_name ?? "Clause"}: ${c.clause_text ?? ""}`).join("\n\n")}`}
                emptyState="Set ANTHROPIC_API_KEY to surface playbook positions."
              />
            </section>
          ))
        )}
      </main>
    </div>
  );
}

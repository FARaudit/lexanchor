import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import LibraryClient from "./library-client";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: clauses } = await sb
    .from("saved_clauses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 md:px-10 py-5">
        <div className="flex items-center gap-2 text-xs text-text-3 mb-2">
          <Link href="/dashboard" className="hover:text-text-2">Dashboard</Link>
          <span>›</span>
          <span className="text-text-2">Library</span>
        </div>
        <h1 className="font-display text-3xl text-text font-medium">Clause library</h1>
        <p className="mt-2 text-text-2 text-sm">Filter, compare side-by-side, ask Claude how each clause stacks up against market standard.</p>
      </header>
      <main className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        <LibraryClient initialClauses={clauses ?? []} />
      </main>
    </div>
  );
}

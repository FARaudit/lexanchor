import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import MattersClient from "./matters-client";

export const dynamic = "force-dynamic";

export default async function MattersPage() {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  let matters: unknown[] = [];
  try {
    const { data } = await sb
      .from("matters")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    matters = data ?? [];
  } catch {
    /* table may not be migrated yet */
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 md:px-10 py-5">
        <div className="flex items-center gap-2 text-xs text-text-3 mb-2">
          <Link href="/dashboard" className="hover:text-text-2">Dashboard</Link>
          <span>›</span>
          <span className="text-text-2">Matters</span>
        </div>
        <h1 className="font-display text-3xl text-text font-medium">Matters</h1>
        <p className="mt-2 text-text-2 text-sm">Track ongoing legal matters: vendors, employment, IP, litigation, M&A.</p>
      </header>
      <main className="px-6 md:px-10 py-8 max-w-5xl mx-auto">
        <MattersClient initial={matters as never} />
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import ContractsClient from "./contracts-client";

export const dynamic = "force-dynamic";

export default async function ContractsPage() {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  let contracts: unknown[] = [];
  try {
    const { data } = await sb
      .from("contracts")
      .select("*")
      .eq("user_id", user.id)
      .order("renewal_date", { ascending: true, nullsFirst: false });
    contracts = data ?? [];
  } catch {
    /* table may not be migrated */
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 md:px-10 py-5">
        <div className="flex items-center gap-2 text-xs text-text-3 mb-2">
          <Link href="/dashboard" className="hover:text-text-2">Dashboard</Link>
          <span>›</span>
          <span className="text-text-2">Contracts</span>
        </div>
        <h1 className="font-display text-3xl text-text font-medium">Contracts</h1>
        <p className="mt-2 text-text-2 text-sm">
          Active contracts with key dates. Renewal alerts at 30 / 60 / 90 days out.
        </p>
      </header>
      <main className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        <ContractsClient initial={contracts as never} />
      </main>
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 10;

const STATUSES = new Set(["active", "expired", "terminated", "draft"]);

export async function GET() {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("contracts")
    .select("*")
    .eq("user_id", user.id)
    .order("renewal_date", { ascending: true, nullsFirst: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contracts: data ?? [] });
}

export async function POST(req: NextRequest) {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rate = checkRateLimit(`contract:${user.id}`, { max: 30, windowMs: 60_000 });
  if (!rate.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name ?? "").trim().slice(0, 200);
  const status = String(body.status ?? "active");
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (!STATUSES.has(status)) return NextResponse.json({ error: "invalid status" }, { status: 400 });

  const numOrNull = (v: unknown): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const dateOrNull = (v: unknown): string | null => {
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v;
    return null;
  };

  const { data, error } = await sb
    .from("contracts")
    .insert({
      user_id: user.id,
      name,
      type: typeof body.type === "string" ? body.type.slice(0, 80) : null,
      parties: body.parties ?? null,
      start_date: dateOrNull(body.start_date),
      end_date: dateOrNull(body.end_date),
      renewal_date: dateOrNull(body.renewal_date),
      value: numOrNull(body.value),
      status,
      obligations: body.obligations ?? null
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contract: data });
}

export async function DELETE(req: NextRequest) {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await sb.from("contracts").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 10;

const TYPES = new Set([
  "vendor",
  "employment",
  "ip",
  "litigation",
  "ma",
  "regulatory",
  "real_estate",
  "other"
]);
const STATUSES = new Set(["open", "negotiating", "executed", "closed", "on_hold"]);

export async function GET() {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("matters")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ matters: data ?? [] });
}

export async function POST(req: NextRequest) {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rate = checkRateLimit(`matter:${user.id}`, { max: 30, windowMs: 60_000 });
  if (!rate.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name ?? "").trim().slice(0, 200);
  const type = String(body.type ?? "other");
  const status = String(body.status ?? "open");

  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (!TYPES.has(type)) return NextResponse.json({ error: "invalid type" }, { status: 400 });
  if (!STATUSES.has(status)) return NextResponse.json({ error: "invalid status" }, { status: 400 });

  const { data, error } = await sb
    .from("matters")
    .insert({
      user_id: user.id,
      name,
      type,
      status,
      parties: body.parties ?? null,
      key_dates: body.key_dates ?? null,
      notes: typeof body.notes === "string" ? body.notes.slice(0, 2000) : null
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ matter: data });
}

export async function DELETE(req: NextRequest) {
  const sb = await createServerClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await sb.from("matters").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

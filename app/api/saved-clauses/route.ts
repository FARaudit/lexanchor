import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

interface SaveBody {
  analysis_id?: number | string;
  clause_name?: string;
  clause_text?: string;
  risk_level?: string;
  doc_type?: string;
  explanation?: string;
  citation?: string;
  notes?: string;
}

export async function GET() {
  const sb = await createServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("saved_clauses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clauses: data || [] });
}

export async function POST(req: NextRequest) {
  const sb = await createServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: SaveBody = await req.json().catch(() => ({}));

  if (!body.clause_name && !body.clause_text) {
    return NextResponse.json({ error: "clause_name or clause_text required" }, { status: 400 });
  }

  const { data, error } = await sb
    .from("saved_clauses")
    .insert({
      user_id: user.id,
      analysis_id: body.analysis_id ?? null,
      clause_name: body.clause_name ?? null,
      clause_text: body.clause_text ?? null,
      risk_level: body.risk_level ?? null,
      doc_type: body.doc_type ?? null,
      explanation: body.explanation ?? null,
      citation: body.citation ?? null,
      notes: body.notes ?? null
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: data });
}

export async function DELETE(req: NextRequest) {
  const sb = await createServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await sb
    .from("saved_clauses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

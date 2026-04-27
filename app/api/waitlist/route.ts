import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const sb = getAdminClient();
  if (!sb) {
    console.warn("[waitlist] not configured; received:", email);
    return NextResponse.json({ ok: true, deferred: true });
  }

  const userAgent = req.headers.get("user-agent") || null;
  const { error } = await sb
    .from("waitlist")
    .upsert(
      [{ email, source: "lexanchor.ai", user_agent: userAgent }],
      { onConflict: "email", ignoreDuplicates: true }
    );

  if (error) {
    console.error("[waitlist]", error.message);
    return NextResponse.json({ error: "Could not save signup" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "waitlist endpoint live" });
}

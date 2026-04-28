import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { runAnalysis } from "@/lib/analyze-engine";

export const maxDuration = 60;

const MAX_PDF_BYTES = 10 * 1024 * 1024;
const PDF_MAGIC = Buffer.from("%PDF", "ascii");

function isPdfMagicValid(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).equals(PDF_MAGIC);
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/[/\\:*?"<>|]/g, "_")
    .slice(0, 200) || "untitled.pdf";
}

export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Supabase env vars not set" }, { status: 500 });
  }

  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Multipart parse
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const pdfEntry = formData.get("pdf");
  const documentTypeHint = String(formData.get("document_type") || "").trim();

  if (!(pdfEntry instanceof File) || pdfEntry.size === 0) {
    return NextResponse.json({ error: "PDF required" }, { status: 400 });
  }

  if (pdfEntry.type !== "application/pdf") {
    return NextResponse.json({ error: "File must be application/pdf" }, { status: 400 });
  }

  if (pdfEntry.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: `PDF exceeds ${MAX_PDF_BYTES / 1024 / 1024}MB` }, { status: 413 });
  }

  const buffer = Buffer.from(await pdfEntry.arrayBuffer());
  if (!isPdfMagicValid(buffer)) {
    return NextResponse.json({ error: "Not a valid PDF (magic bytes)" }, { status: 400 });
  }

  const safeName = sanitizeFilename(pdfEntry.name);

  // Insert pending row
  const { data: row, error: insertError } = await supabase
    .from("analyses")
    .insert({
      document_type: documentTypeHint || null,
      filename: safeName,
      user_id: user.id,
      status: "processing"
    })
    .select("id")
    .single();

  if (insertError || !row) {
    return NextResponse.json(
      { error: insertError?.message || "Insert failed" },
      { status: 500 }
    );
  }

  try {
    const result = await runAnalysis({
      pdfBase64: buffer.toString("base64"),
      filename: safeName,
      document_type_hint: documentTypeHint || undefined
    });

    const { error: updateError } = await supabase
      .from("analyses")
      .update({
        document_type: result.overview.json.document_type || documentTypeHint || null,
        overview_summary: result.overview.summary,
        overview_json: result.overview.json,
        clauses_summary: result.clauses.summary,
        clauses_json: result.clauses.json,
        risks_summary: result.risks.summary,
        risks_json: result.risks.json,
        risk_score: result.risk_score,
        recommendation: result.recommendation,
        plain_english_summary: result.plain_english_summary,
        status: "complete",
        completed_at: new Date().toISOString()
      })
      .eq("id", row.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message, analysisId: row.id },
        { status: 500 }
      );
    }

    // Best-effort intelligence-corpus write — every analysis teaches the engine
    // what risk flags fire on what clause types.
    try {
      const flags = ((result.risks.json as Record<string, unknown>).red_flags as Array<{ severity?: string; flag?: string }> | undefined) ?? [];
      const flagLabels = flags.filter((f) => f && typeof f.flag === "string").map((f) => `${f.severity ?? "?"}: ${f.flag}`);
      if (flagLabels.length > 0) {
        await supabase.from("la_intelligence_corpus").insert({
          user_id: user.id,
          analysis_id: row.id,
          clause_type: result.overview.json.document_type || documentTypeHint || null,
          risk_flags: flagLabels.slice(0, 20),
          metadata: { recommendation: result.recommendation, risk_score: result.risk_score }
        });
      }
    } catch {
      /* silent — corpus is best-effort */
    }

    return NextResponse.json({
      analysisId: row.id,
      status: "complete",
      recommendation: result.recommendation,
      risk_score: result.risk_score
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await supabase
      .from("analyses")
      .update({ status: "failed", error_message: message })
      .eq("id", row.id);
    return NextResponse.json({ error: message, analysisId: row.id }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "analyze endpoint live" });
}

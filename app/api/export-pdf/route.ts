import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import * as React from "react";

export const maxDuration = 30;

interface RedFlag { flag?: string; severity?: string; why_it_matters?: string; what_to_negotiate?: string; }
interface ClauseItem { name?: string; what_it_says?: string; why_it_matters?: string; citation?: string; }

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", lineHeight: 1.5, color: "#1A1A2E" },
  header: { borderBottomWidth: 1, borderBottomColor: "#C9A84C", paddingBottom: 12, marginBottom: 24 },
  brand: { fontSize: 9, letterSpacing: 4, color: "#C9A84C", textTransform: "uppercase", marginBottom: 4 },
  title: { fontSize: 20, color: "#1A1A2E", marginBottom: 4 },
  meta: { fontSize: 9, color: "#6E7287" },
  sectionTitle: { fontSize: 9, letterSpacing: 3, color: "#C9A84C", textTransform: "uppercase", marginTop: 20, marginBottom: 8 },
  h2: { fontSize: 14, color: "#1A1A2E", marginBottom: 12 },
  summary: { fontSize: 11, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.6 },
  scoreBox: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, padding: 12, borderWidth: 1, borderColor: "#C9A84C", backgroundColor: "#F8F5F0" },
  scoreCell: { flexDirection: "column" },
  scoreLabel: { fontSize: 8, letterSpacing: 1.5, color: "#6E7287", textTransform: "uppercase", marginBottom: 4 },
  scoreValue: { fontSize: 16, color: "#1A1A2E" },
  flagCard: { borderLeftWidth: 3, padding: 10, marginBottom: 8 },
  flagP0: { borderLeftColor: "#A32D2D", backgroundColor: "#FBEFEF" },
  flagP1: { borderLeftColor: "#BA7517", backgroundColor: "#FBF4EA" },
  flagP2: { borderLeftColor: "#185FA5", backgroundColor: "#EAF1FA" },
  flagSeverity: { fontSize: 8, letterSpacing: 1.5, marginBottom: 4 },
  flagText: { fontSize: 10, marginBottom: 6 },
  flagSub: { fontSize: 9, color: "#6E7287" },
  clauseCard: { borderWidth: 1, borderColor: "#E0DCD3", padding: 10, marginBottom: 8 },
  clauseName: { fontSize: 11, marginBottom: 4 },
  clauseBody: { fontSize: 9, color: "#4A4A5E" },
  footer: { marginTop: 32, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E0DCD3", fontSize: 8, fontStyle: "italic", color: "#6E7287", lineHeight: 1.6 }
});

function flagStyle(severity?: string) {
  if (severity === "P0") return [styles.flagCard, styles.flagP0];
  if (severity === "P1") return [styles.flagCard, styles.flagP1];
  return [styles.flagCard, styles.flagP2];
}

export async function GET(req: NextRequest) {
  const sb = await createServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data: analysis } = await sb
    .from("analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (!analysis) return NextResponse.json({ error: "Analysis not found" }, { status: 404 });

  const overview = (analysis.overview_json ?? {}) as Record<string, unknown>;
  const clauses = ((analysis.clauses_json as Record<string, unknown> | null)?.clauses as ClauseItem[] | undefined) ?? [];
  const redFlags = ((analysis.risks_json as Record<string, unknown> | null)?.red_flags as RedFlag[] | undefined) ?? [];

  const e = React.createElement;
  const doc = e(Document, null,
    e(Page, { size: "LETTER", style: styles.page },
      // Header
      e(View, { style: styles.header },
        e(Text, { style: styles.brand }, "LEXANCHOR · ANALYSIS REPORT"),
        e(Text, { style: styles.title }, String(analysis.filename ?? "Untitled document")),
        e(Text, { style: styles.meta },
          `${analysis.document_type ?? "Document"} · ${analysis.created_at ? new Date(analysis.created_at as string).toLocaleDateString() : ""}`
        )
      ),

      // Score box
      e(View, { style: styles.scoreBox },
        e(View, { style: styles.scoreCell },
          e(Text, { style: styles.scoreLabel }, "Risk Score"),
          e(Text, { style: styles.scoreValue }, `${analysis.risk_score ?? "—"}/100`)
        ),
        e(View, { style: styles.scoreCell },
          e(Text, { style: styles.scoreLabel }, "Recommendation"),
          e(Text, { style: styles.scoreValue }, String(analysis.recommendation ?? "—").replace(/_/g, " "))
        )
      ),

      // Plain English summary
      analysis.plain_english_summary
        ? e(View, null,
            e(Text, { style: styles.sectionTitle }, "Summary"),
            e(Text, { style: styles.summary }, String(analysis.plain_english_summary))
          )
        : null,

      // Red flags
      e(View, null,
        e(Text, { style: styles.sectionTitle }, "Red Flags"),
        e(Text, { style: styles.h2 }, "Risks worth reading carefully"),
        ...(redFlags.length === 0
          ? [e(Text, { style: styles.flagSub }, "No red flags surfaced. Attorney review still recommended for material decisions.")]
          : redFlags.map((f, i) =>
              e(View, { key: i, style: flagStyle(f.severity) },
                e(Text, { style: styles.flagSeverity }, String(f.severity ?? "")),
                e(Text, { style: styles.flagText }, String(f.flag ?? "")),
                f.why_it_matters ? e(Text, { style: styles.flagSub }, String(f.why_it_matters)) : null,
                f.what_to_negotiate ? e(Text, { style: styles.flagSub }, `Consider asking about: ${f.what_to_negotiate}`) : null
              )
            ))
      ),

      // Clauses
      e(View, { break: true },
        e(Text, { style: styles.sectionTitle }, "Clauses"),
        e(Text, { style: styles.h2 }, "What every section says"),
        ...clauses.map((c, i) =>
          e(View, { key: i, style: styles.clauseCard },
            e(Text, { style: styles.clauseName }, `${c.name ?? "Untitled"}${c.citation ? ` · ${c.citation}` : ""}`),
            c.what_it_says ? e(Text, { style: styles.clauseBody }, String(c.what_it_says)) : null,
            c.why_it_matters ? e(Text, { style: { ...styles.clauseBody, marginTop: 4, fontStyle: "italic" } }, String(c.why_it_matters)) : null
          )
        )
      ),

      // Overview
      Object.keys(overview).length > 0
        ? e(View, null,
            e(Text, { style: styles.sectionTitle }, "Overview"),
            e(Text, { style: styles.h2 }, "Document at a glance"),
            ...Object.entries(overview)
              .filter(([, v]) => v !== null && v !== undefined && v !== "")
              .map(([k, v]) =>
                e(Text, { key: k, style: { fontSize: 9, marginBottom: 4 } },
                  `${k.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}: ${Array.isArray(v) ? v.join(", ") : String(v)}`
                )
              )
          )
        : null,

      // UPL footer
      e(View, { style: styles.footer },
        e(Text, null, "LexAnchor provides information only — not legal advice — and does not represent you, take instructions from you, or form an attorney-client relationship. For material decisions, consult a licensed attorney."),
        e(Text, { style: { marginTop: 6 } }, `Generated ${new Date().toLocaleDateString()} · lexanchor.ai`)
      )
    )
  );

  const buffer = await renderToBuffer(doc);
  const safeName = String(analysis.filename ?? `analysis-${id}`).replace(/\.pdf$/i, "").replace(/[^A-Za-z0-9_-]/g, "_");

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="lexanchor-${safeName}.pdf"`,
      "Cache-Control": "no-store"
    }
  });
}

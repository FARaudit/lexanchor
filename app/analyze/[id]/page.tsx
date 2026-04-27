import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import FollowUpForm from "./follow-up-form";

type Params = { id: string };

interface RedFlag {
  flag: string;
  severity: "P0" | "P1" | "P2";
  why_it_matters?: string;
  what_to_negotiate?: string;
}

interface ClauseItem {
  name: string;
  what_it_says?: string;
  why_it_matters?: string;
  citation?: string;
}

const REC_STYLES: Record<string, { color: string; label: string }> = {
  SIGN: { color: "text-green border-green", label: "Sign" },
  NEGOTIATE: { color: "text-amber border-amber", label: "Negotiate" },
  DO_NOT_SIGN: { color: "text-red border-red", label: "Do Not Sign" }
};

const PRIORITY_BORDERS: Record<string, string> = {
  P0: "border-red bg-red/5",
  P1: "border-amber bg-amber/5",
  P2: "border-blue bg-blue/5"
};
const PRIORITY_COLORS: Record<string, string> = {
  P0: "text-red",
  P1: "text-amber",
  P2: "text-blue"
};

export default async function AnalysisResultPage({
  params
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (!analysis) notFound();

  const recStyle = REC_STYLES[analysis.recommendation as string] || REC_STYLES.NEGOTIATE;
  const score: number = analysis.risk_score ?? 0;
  const overviewJson = (analysis.overview_json ?? {}) as Record<string, unknown>;
  const clausesJson = (analysis.clauses_json ?? {}) as Record<string, unknown>;
  const risksJson = (analysis.risks_json ?? {}) as Record<string, unknown>;

  const clauses = (clausesJson.clauses as ClauseItem[] | undefined) ?? [];
  const omissions = (clausesJson.notable_omissions as string[] | undefined) ?? [];
  const redFlags = (risksJson.red_flags as RedFlag[] | undefined) ?? [];
  const asymmetric = (risksJson.asymmetric_terms as string[] | undefined) ?? [];
  const unusual = (risksJson.unusual_provisions as string[] | undefined) ?? [];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="font-display text-2xl text-text">LexAnchor</Link>
        <Link href="/analyze" className="text-sm text-gold hover:text-gold-dim font-mono uppercase tracking-wider">
          + New analysis
        </Link>
      </header>

      <main className="px-6 md:px-10 py-12 md:py-16 max-w-5xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Analysis Report</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
          <div>
            <p className="font-mono text-sm text-text-2 tracking-wider uppercase">
              {analysis.document_type || "Document"}
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl text-text font-light leading-tight">
              {analysis.filename || "Untitled document"}
            </h1>
            <p className="mt-4 text-text-2 text-sm font-mono">
              {analysis.created_at && new Date(analysis.created_at).toLocaleDateString()}
            </p>
          </div>

          {analysis.status === "complete" && (
            <div className="flex items-center gap-6">
              <ScoreCircle score={score} />
              <div className={`px-5 py-3 border-2 ${recStyle.color} font-mono text-xs tracking-[0.25em] uppercase`}>
                {recStyle.label}
              </div>
            </div>
          )}
        </div>

        {analysis.status === "processing" && (
          <div className="mt-12 border border-amber/40 bg-amber/5 p-6">
            <p className="font-display text-xl text-text">Analysis in progress</p>
            <p className="mt-2 text-text-2 text-sm">Refresh in a few seconds.</p>
          </div>
        )}

        {analysis.status === "failed" && (
          <div className="mt-12 border border-red/40 bg-red/5 p-6">
            <p className="font-display text-xl text-text">Analysis failed</p>
            <p className="mt-2 text-text-2 text-sm">{analysis.error_message || "Unknown error"}</p>
          </div>
        )}

        {analysis.status === "complete" && (
          <>
            {/* Plain English summary */}
            {analysis.plain_english_summary && (
              <Section eyebrow="Summary" title="Plain English">
                <p className="font-display text-xl md:text-2xl text-text leading-relaxed font-light italic max-w-3xl">
                  {analysis.plain_english_summary}
                </p>
              </Section>
            )}

            {/* Red flags first — most important */}
            <Section eyebrow="Red Flags" title="Risks worth reading carefully">
              {redFlags.length === 0 ? (
                <p className="text-text-2 italic">No red flags surfaced. An attorney review is still recommended for material decisions.</p>
              ) : (
                <div className="space-y-3">
                  {redFlags.sort((a, b) => {
                    const order = { P0: 0, P1: 1, P2: 2 } as const;
                    return (order[a.severity] ?? 2) - (order[b.severity] ?? 2);
                  }).map((f, i) => <RedFlagCard key={i} flag={f} />)}
                </div>
              )}
              {asymmetric.length > 0 && (
                <div className="mt-10">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-3 mb-3">Asymmetric terms</p>
                  <ul className="space-y-2">
                    {asymmetric.map((t, i) => (
                      <li key={i} className="border-l-2 border-amber pl-4 py-1 text-sm text-text">{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              {unusual.length > 0 && (
                <div className="mt-8">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-3 mb-3">Unusual provisions</p>
                  <ul className="space-y-2">
                    {unusual.map((t, i) => (
                      <li key={i} className="border-l-2 border-blue pl-4 py-1 text-sm text-text">{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>

            {/* Clauses */}
            <Section eyebrow="Clauses" title="What every section says">
              {clauses.length === 0 ? (
                <p className="text-text-2 italic">No clauses surfaced.</p>
              ) : (
                <div className="space-y-5">
                  {clauses.map((c, i) => <ClauseCard key={i} clause={c} />)}
                </div>
              )}
              {omissions.length > 0 && (
                <div className="mt-10">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-3 mb-3">Notable omissions</p>
                  <ul className="space-y-2">
                    {omissions.map((o, i) => (
                      <li key={i} className="border-l-2 border-border-2 pl-4 py-1 text-sm text-text-2 italic">{o}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>

            {/* Overview */}
            <Section eyebrow="Overview" title="Document at a glance">
              <OverviewGrid data={overviewJson} />
            </Section>

            {/* Follow-up Q&A */}
            <Section eyebrow="Ask" title="Follow-up question">
              <p className="text-text-2 mb-5 leading-relaxed max-w-2xl">
                Ask anything about this analysis — clause meaning, negotiation framing, or how a specific term might apply in your situation. Information only.
              </p>
              <FollowUpForm analysisId={Number(analysis.id)} />
            </Section>

            {/* UPL footer */}
            <div className="mt-16 mb-8 border-t border-border pt-8">
              <p className="text-xs text-text-3 italic font-mono leading-relaxed max-w-3xl">
                LexAnchor provides information only — not legal advice — and does not represent you, take instructions from you, or form an attorney-client relationship. For material decisions, consult a licensed attorney.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  let color = "text-green";
  if (score >= 70) color = "text-red";
  else if (score >= 35) color = "text-amber";
  const dash = Math.max(0, Math.min(100, score)) * 2.76;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" fill="none" className="text-border" />
        <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="3" fill="none" className={color} strokeDasharray={`${dash} 276`} strokeLinecap="round" />
      </svg>
      <span className="font-display text-3xl text-text font-light">{score}</span>
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-3">{eyebrow}</p>
      <h2 className="font-display text-2xl md:text-3xl text-text font-light mb-10">{title}</h2>
      {children}
    </section>
  );
}

function RedFlagCard({ flag }: { flag: RedFlag }) {
  const border = PRIORITY_BORDERS[flag.severity] || PRIORITY_BORDERS.P2;
  const labelColor = PRIORITY_COLORS[flag.severity] || PRIORITY_COLORS.P2;
  return (
    <div className={`border-l-4 ${border} pl-5 pr-4 py-4`}>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className={`font-mono text-xs font-medium tracking-wider ${labelColor}`}>{flag.severity}</span>
      </div>
      <p className="mt-2 text-text leading-relaxed">{flag.flag}</p>
      {flag.why_it_matters && (
        <p className="mt-2 text-sm text-text-2 leading-relaxed">{flag.why_it_matters}</p>
      )}
      {flag.what_to_negotiate && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-3 mb-1">Consider asking about</p>
          <p className="text-sm text-text">{flag.what_to_negotiate}</p>
        </div>
      )}
    </div>
  );
}

function ClauseCard({ clause }: { clause: ClauseItem }) {
  return (
    <div className="border border-border bg-surface p-5">
      <div className="flex items-baseline gap-3 flex-wrap">
        <p className="font-display text-lg text-text">{clause.name}</p>
        {clause.citation && (
          <span className="font-mono text-xs text-text-3">{clause.citation}</span>
        )}
      </div>
      {clause.what_it_says && (
        <p className="mt-2 text-text-2 leading-relaxed">{clause.what_it_says}</p>
      )}
      {clause.why_it_matters && (
        <p className="mt-2 text-sm text-text-3 italic leading-relaxed">{clause.why_it_matters}</p>
      )}
    </div>
  );
}

function OverviewGrid({ data }: { data: Record<string, unknown> }) {
  const fields = [
    { key: "document_type", label: "Document Type" },
    { key: "parties", label: "Parties" },
    { key: "effective_date", label: "Effective Date" },
    { key: "termination_date", label: "Term" },
    { key: "governing_law", label: "Governing Law" }
  ];
  return (
    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {fields.map(({ key, label }) => {
        const v = data[key];
        if (v === null || v === undefined || v === "") return null;
        const display = Array.isArray(v) ? v.join(" · ") : String(v);
        return (
          <div key={key}>
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-text-3 mb-2">{label}</dt>
            <dd className="text-text">{display}</dd>
          </div>
        );
      })}
    </dl>
  );
}

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; reset: number }>();

function rateLimit(key: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const b = rateBuckets.get(key);
  if (!b || now > b.reset) {
    rateBuckets.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (b.count >= RATE_LIMIT_MAX) return { ok: false, remaining: 0 };
  b.count += 1;
  return { ok: true, remaining: RATE_LIMIT_MAX - b.count };
}

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

const SYSTEM_PROMPT = `You are LexAnchor Support — the embedded help agent for LexAnchor, an AI contract review product run by Woof Management LLC.

PRODUCT CONTEXT:
- LexAnchor analyzes contracts (NDAs, MSAs, employment offers, leases, vendor agreements, government contracts) and prioritizes risks as P0 (walk-away), P1 (scoring), P2 (polish).
- Outputs: plain-English clause summaries, redline suggestions, negotiation playbook, renewal alerts, clause library.
- Four plans: Individual $99/mo, Professional $199/mo (most popular), Business $499/mo (5 seats), Law Firm $999/mo (25 seats). First contract free.
- Workflows: Upload at /signup → analysis → /analyze/[id] → playbook export.
- Education at /learn. Pricing at /pricing.

DISCLOSURE — ALWAYS:
- LexAnchor provides information only — not legal advice.
- We describe what a contract says and what risks may exist; we do not represent users, take instructions from them, or form an attorney-client relationship.
- For material decisions, recommend consulting a licensed attorney.

ANSWER STYLE:
- Direct, plain English. Users come to LexAnchor specifically because legalese exhausts them.
- Cap responses at ~120 words unless the user explicitly asks for depth.
- Never invent statutes, case names, or jurisdiction-specific rules you don't have.
- If a question is jurisdiction-specific (state law, country of incorporation), surface the variation and recommend an attorney.

OUT OF SCOPE:
- Telling users whether to sign a specific contract.
- Predicting litigation outcomes.
- Tax advice.
- Anything outside US/Canada/UK common-law contracts unless asked.`;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const rate = rateLimit(clientKey(req));
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded — slow down." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Support is offline." }, { status: 503 });
  }

  let body: { messages?: Msg[]; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const messages: Msg[] = Array.isArray(body.messages)
    ? body.messages
    : body.question
    ? [{ role: "user", content: body.question }]
    : [];

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages." }, { status: 400 });
  }

  const trimmed = messages.slice(-12).map((m) => ({
    role: m.role,
    content: String(m.content || "").slice(0, 4000)
  }));

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const res = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: trimmed
    });

    const text = res.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { text: string }).text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: text || "I'm not sure — email support@lexanchor.ai." });
  } catch (err) {
    console.error("[support]", err);
    return NextResponse.json({ error: "Support failed." }, { status: 500 });
  }
}

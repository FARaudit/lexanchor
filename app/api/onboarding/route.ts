import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEQUENCES: Record<number, { subject: string; prompt: string }> = {
  0: {
    subject: "Welcome to LexAnchor — here is how to get started",
    prompt:
      "Write a welcome email for a new LexAnchor user. Warm but professional. Tell them exactly what to do first in 3 steps (upload first contract, read the P0/P1/P2 risk breakdown, export the negotiation playbook). No fluff. Under 150 words. End with the standard disclosure: information only, not legal advice. Sign as Jose Rodriguez, Founder."
  },
  3: {
    subject: "Have you tried this yet?",
    prompt:
      "Write a day-3 onboarding email for LexAnchor. Reference one specific feature (side-by-side compare or the negotiation playbook export). Ask if they have any questions. Include the standard not-legal-advice disclosure footer. Under 100 words. Sign as Jose Rodriguez, Founder."
  },
  7: {
    subject: "Quick question about your experience",
    prompt:
      'Write a day-7 check-in email for LexAnchor. Ask one question: "On a scale of 1-10, how useful has LexAnchor been?" Tell them their reply goes directly to the founder. Include the standard not-legal-advice disclosure footer. Under 75 words. Sign as Jose Rodriguez, Founder.'
  }
};

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Anthropic key missing." }, { status: 503 });
  }

  let body: { userId?: string; email?: string; day?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { userId, email, day } = body;
  if (!userId || !email || day === undefined) {
    return NextResponse.json({ error: "userId, email, day required" }, { status: 400 });
  }
  const sequence = SEQUENCES[day];
  if (!sequence) return NextResponse.json({ error: "Invalid day" }, { status: 400 });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    messages: [{ role: "user", content: sequence.prompt }]
  });

  const text = msg.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { text: string }).text)
    .join("\n")
    .trim();

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Jose Rodriguez <jose@lexanchor.ai>",
        to: email,
        subject: sequence.subject,
        text
      });
    } catch (err) {
      console.error("[onboarding-send]", err);
    }
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const col = day === 0 ? "day0_sent_at" : day === 3 ? "day3_sent_at" : "day7_sent_at";
      await sb.from("onboarding_sequences").upsert({ user_id: userId, [col]: new Date().toISOString() });
    } catch (err) {
      console.error("[onboarding-log]", err);
    }
  }

  return NextResponse.json({ ok: true, day, email });
}

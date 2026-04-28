import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (process.env.RESEND_API_KEY && process.env.CEO_EMAIL) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "LexAnchor Sales AI <sales@lexanchor.ai>",
        to: process.env.CEO_EMAIL,
        subject: `Sales AI · ${today} · Check LinkedIn inbox`,
        html: `<div style="font-family:monospace;background:#06040f;color:#e0d8f8;padding:24px;max-width:560px">
          <p style="color:#9468f5;font-size:10px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:12px">LexAnchor Sales AI · Daily</p>
          <p style="font-size:14px;color:#fff;font-weight:500;margin-bottom:16px">${today}</p>
          <div style="background:#09071a;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:14px;margin-bottom:12px">
            <p style="color:#9468f5;font-size:9px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Today's outreach</p>
            <p style="font-size:12px;color:#5a4e88">Active prospect queue — check Notion daily execution page for the next firm and outreach copy.</p>
          </div>
          <div style="background:#09071a;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:14px;margin-bottom:12px">
            <p style="color:#9468f5;font-size:9px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Inbox check</p>
            <p style="font-size:12px;color:#fff">Open LinkedIn + jose@lexanchor.ai inbox — reply to any prospect that responded.</p>
          </div>
          <p style="font-size:11px;color:#3a2e60;margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,.07)">
            Sales AI · LexAnchor · Full Gmail autonomy activates when Gmail OAuth server credentials are added to Vercel
          </p>
        </div>`
      });
    } catch (err) {
      console.error("[sales-cron]", err);
    }
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}

import { NextRequest, NextResponse } from "next/server";
import { analyzeDomain } from "@/lib/dns-checks";

// In production: poll your email inbox (Resend inbound / Mailgun routes / IMAP)
// and check which folder the test email landed in.
//
// This stub simulates the result deterministically from the domain so the
// UI flow works end-to-end. Replace the block marked REPLACE IN PRODUCTION
// with your real inbox polling logic.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id     = searchParams.get("id");
  const domain = searchParams.get("domain");
  const elapsed = Number(searchParams.get("elapsed") ?? "0");

  if (!id || !domain) {
    return NextResponse.json({ error: "Missing id or domain" }, { status: 400 });
  }

  // Simulate a realistic wait (real email takes 5-30s to arrive)
  if (elapsed < 12000) {
    return NextResponse.json({ status: "waiting" });
  }

  // ── REPLACE IN PRODUCTION ─────────────────────────────────────────────────
  // Poll Resend inbound webhooks / Mailgun routes / IMAP for the seed address.
  // Check the folder header or spam flag on the received message.
  // ─────────────────────────────────────────────────────────────────────────

  const { score, checks } = analyzeDomain(domain);

  // Deterministic verdict from score for demo
  const h = domain.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const blacklisted = h % 97 % 11 === 0;

  let folder: "inbox" | "spam" | "promotions";
  if (score >= 72)       folder = "inbox";
  else if (score >= 48)  folder = "promotions";
  else                   folder = "spam";

  const verdict = folder === "inbox" ? "inbox"
    : folder === "promotions" ? "inbox"  // still delivered, just tabbed
    : "spam";

  return NextResponse.json({
    status: "received",
    verdict,
    folder,
    score,
    checks,
    blacklisted,
  });
}

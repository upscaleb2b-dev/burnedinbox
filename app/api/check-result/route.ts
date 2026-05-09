import { NextRequest, NextResponse } from "next/server";

// Checks (SPF/DKIM/DMARC/Blacklist) are run during start-test and held in client
// state — no need to re-run DNS here. This endpoint only returns placement verdict
// derived from the score the client already has.
//
// TODO: replace verdict logic with real seed-account polling (Gmail API, Graph API)
// once seed mailboxes are wired up.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id      = searchParams.get("id");
  const domain  = searchParams.get("domain");
  const elapsed = Number(searchParams.get("elapsed") ?? "0");
  const score   = Number(searchParams.get("score") ?? "0");

  if (!id || !domain) {
    return NextResponse.json({ error: "Missing id or domain" }, { status: 400 });
  }

  // Simulate realistic email delivery latency
  if (elapsed < 12000) {
    return NextResponse.json({ status: "waiting" });
  }

  // Derive placement from warm score until real seed accounts are wired up
  let folder: "inbox" | "promotions" | "spam";
  if (score >= 72)      folder = "inbox";
  else if (score >= 45) folder = "promotions";
  else                  folder = "spam";

  const verdict = folder !== "spam" ? "inbox" : "spam";

  return NextResponse.json({ status: "received", verdict, folder });
}

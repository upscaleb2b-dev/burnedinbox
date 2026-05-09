import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { DnsCheck } from "@/lib/types";

const SEED_PROVIDERS = [
  { provider: "Gmail",   tag: "gmail" },
  { provider: "Outlook", tag: "outlook" },
  { provider: "Yahoo",   tag: "yahoo" },
  { provider: "iCloud",  tag: "icloud" },
];

// ── Normalizers: map each tool API response → DnsCheck + score points ─────────

function normalizeSPF(data: Record<string, unknown>): { check: DnsCheck; pts: number } {
  if (!data.found) {
    return {
      check: { label: "SPF Record", status: "fail", value: "No SPF record found",
        detail: "No SPF record exists. Any server can send email claiming to be you. Add v=spf1 ... -all to your DNS." },
      pts: 0,
    };
  }
  const parsed = data.parsed as { all?: string } | undefined;
  const allTag = parsed?.all ?? "";
  const issues = (data.grade as { issues?: string[] } | undefined)?.issues ?? [];
  let pts: number; let status: DnsCheck["status"]; let detail: string;
  if (allTag === "-all") {
    status = issues.length ? "warn" : "pass"; pts = issues.length ? 18 : 25;
    detail = issues.join(" ") || "SPF hardfail (-all) active. Only your authorized servers can send as this domain.";
  } else if (allTag === "~all") {
    status = "warn"; pts = 15;
    detail = issues.join(" ") || "SPF softfail (~all) — unauthorized senders aren't rejected. Upgrade to -all for stricter enforcement.";
  } else if (allTag === "+all" || allTag === "all") {
    status = "fail"; pts = 3;
    detail = "SPF uses +all — any server can send as your domain. Change to -all immediately.";
  } else {
    status = "warn"; pts = 10;
    detail = issues.join(" ") || "SPF record found but missing an 'all' qualifier. Add -all to complete the policy.";
  }
  return { check: { label: "SPF Record", status, value: (data.record as string) || "No record", detail }, pts };
}

function normalizeDKIM(data: Record<string, unknown>): { check: DnsCheck; pts: number } {
  const results = data.results as Array<{ found: boolean; selector: string; keyLength?: number }> | undefined;
  const found = results?.filter(r => r.found) ?? [];
  if (!data.found || found.length === 0) {
    return {
      check: { label: "DKIM Signature", status: "fail", value: "No DKIM record found",
        detail: "DKIM signing not detected across common selectors. Emails can't prove they haven't been tampered with. Configure DKIM with your email provider." },
      pts: 0,
    };
  }
  const best = found[0];
  const keyLen = best.keyLength;
  let pts = 18; let keyLabel = "";
  if (keyLen) {
    if (keyLen >= 2048) { pts = 25; keyLabel = "2048-bit"; }
    else if (keyLen >= 1024) { pts = 18; keyLabel = "1024-bit"; }
    else { pts = 10; keyLabel = "512-bit"; }
  }
  const status: DnsCheck["status"] = pts >= 25 ? "pass" : "warn";
  const selectorList = found.map(r => r.selector).join(", ");
  const detail = pts >= 25
    ? `DKIM active (${selectorList}). 2048-bit RSA — strong authentication.`
    : `DKIM found (${selectorList})${keyLabel ? ` with ${keyLabel} key` : ""}. ${keyLabel === "1024-bit" ? "Upgrade to 2048-bit RSA for better security." : "Verify key length with your provider."}`;
  return {
    check: { label: "DKIM Signature", status, value: `${best.selector}._domainkey.${data.domain as string}${keyLabel ? ` — ${keyLabel}` : ""}`, detail },
    pts,
  };
}

function normalizeDMARC(data: Record<string, unknown>): { check: DnsCheck; pts: number } {
  if (!data.found) {
    return {
      check: { label: "DMARC Policy", status: "fail", value: "No DMARC record found",
        detail: "No DMARC policy set. Your domain has no protection against spoofing. Add _dmarc TXT — start with p=none, then upgrade to p=quarantine or p=reject." },
      pts: 0,
    };
  }
  const tags = data.tags as Record<string, string> | undefined;
  const policy = tags?.p ?? "none";
  let pts: number; let status: DnsCheck["status"]; let detail: string;
  if (policy === "reject") {
    status = "pass"; pts = 30;
    detail = "DMARC p=reject — unauthorized emails blocked outright. Maximum domain protection.";
  } else if (policy === "quarantine") {
    status = "warn"; pts = 20;
    detail = "DMARC p=quarantine — unauthorized emails go to spam. Consider upgrading to p=reject.";
  } else {
    status = "warn"; pts = 8;
    detail = "DMARC p=none — monitoring only, no enforcement. Upgrade to p=quarantine or p=reject.";
  }
  if (tags && !tags.rua) detail += " No aggregate report address (rua=) set — add one to receive DMARC reports.";
  return { check: { label: "DMARC Policy", status, value: (data.record as string) || "No record", detail }, pts };
}

function normalizeBlacklist(data: Record<string, unknown>): { check: DnsCheck; pts: number } {
  const listedCount = (data.listed as number) ?? 0;
  const verdict = (data.verdict as string) ?? "clean";
  const checks = (data.checks as Array<{ name: string; listed: boolean; severity: string }>) ?? [];
  const hits = checks.filter(c => c.listed);
  let pts: number; let status: DnsCheck["status"]; let value: string; let detail: string;
  if (listedCount === 0) {
    pts = 20; status = "pass";
    value = `Clean across ${data.total as number} blacklists`;
    detail = "Not listed on any major IP or domain blacklist databases. Reputation is clean.";
  } else if (verdict === "critical") {
    pts = 0; status = "fail";
    value = hits.map(h => h.name).join(", ");
    const critNames = hits.filter(h => h.severity === "critical").map(h => h.name).join(", ");
    detail = `Listed on ${listedCount} blacklist(s) including critical databases (${critNames}). Primary driver of spam delivery — request delisting immediately.`;
  } else if (verdict === "warning") {
    pts = 4; status = "fail";
    value = hits.map(h => h.name).join(", ");
    detail = `Listed on ${listedCount} high-severity blacklist(s): ${hits.map(h => h.name).join(", ")}. Significant deliverability impact — request delisting.`;
  } else {
    pts = 12; status = "warn";
    value = hits.map(h => h.name).join(", ");
    detail = `Listed on ${listedCount} low/medium blacklist(s): ${hits.map(h => h.name).join(", ")}. Minor impact — monitor and request delisting.`;
  }
  return { check: { label: "Blacklist Status", status, value, detail }, pts };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Domain required" }, { status: 400 });
    }

    const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    const id = uuidv4().replace(/-/g, "").slice(0, 16);

    // One seed address per provider — user sends directly to all of them
    const seedAddresses = SEED_PROVIDERS.map(p => ({
      provider: p.provider,
      address: `seed+${id}+${p.tag}@burnedinbox.com`,
    }));

    // Call deployed tool APIs in parallel — same logic powering the standalone tools
    const origin = new URL(req.url).origin;
    const h = { "Content-Type": "application/json" };
    const [spfRes, dkimRes, dmarcRes, blRes] = await Promise.all([
      fetch(`${origin}/api/spf-lookup`,      { method: "POST", headers: h, body: JSON.stringify({ domain: clean }) }),
      fetch(`${origin}/api/dkim-lookup`,     { method: "POST", headers: h, body: JSON.stringify({ domain: clean }) }),
      fetch(`${origin}/api/dmarc-lookup`,    { method: "POST", headers: h, body: JSON.stringify({ domain: clean }) }),
      fetch(`${origin}/api/blacklist-check`, { method: "POST", headers: h, body: JSON.stringify({ query: clean }) }),
    ]);
    const [spfData, dkimData, dmarcData, blData] = await Promise.all([
      spfRes.json(), dkimRes.json(), dmarcRes.json(), blRes.json(),
    ]);

    const spf   = normalizeSPF(spfData);
    const dkim  = normalizeDKIM(dkimData);
    const dmarc = normalizeDMARC(dmarcData);
    const bl    = normalizeBlacklist(blData);

    const score: number = Math.min(100, spf.pts + dkim.pts + dmarc.pts + bl.pts);
    const checks: DnsCheck[] = [spf.check, dkim.check, dmarc.check, bl.check];

    return NextResponse.json({ id, domain: clean, seedAddresses, score, checks, createdAt: Date.now() });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

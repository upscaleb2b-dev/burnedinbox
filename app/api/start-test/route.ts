import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { DnsCheck } from "@/lib/types";

// ── Normalizers: map each tool API response → DnsCheck + score points ─────────

function normalizeSPF(data: Record<string, unknown>): { check: DnsCheck; pts: number } {
  if (!data.found) {
    return {
      check: { label: "SPF Record", status: "fail", value: "No SPF record found",
        detail: "No SPF record exists, so nothing tells receivers which servers may send as you. Publish one that includes your email provider, e.g. v=spf1 include:_spf.google.com ~all." },
      pts: 0,
    };
  }
  const allTag = (data.parsed as { all?: string } | undefined)?.all ?? "";
  const grade = data.grade as { issues?: string[]; tips?: string[] } | undefined;
  const issues = grade?.issues ?? [];
  const lookups = data.lookupCount as number | undefined;
  const record = (data.record as string) || "No record";
  const lookupNote = typeof lookups === "number" ? ` Uses ${lookups} of 10 DNS lookups.` : "";

  if ((typeof lookups === "number" && lookups > 10) || ((data.recordCount as number) ?? 1) > 1) {
    return { check: { label: "SPF Record", status: "fail", value: record, detail: issues.join(" ") }, pts: 5 };
  }
  if (allTag === "+all" || allTag === "all") {
    return { check: { label: "SPF Record", status: "fail", value: record, detail: "SPF uses +all, which lets any server send as your domain. Change it to ~all or -all." }, pts: 3 };
  }
  if (!allTag || allTag === "?all") {
    return { check: { label: "SPF Record", status: "warn", value: record, detail: (issues.join(" ") || "SPF has no effective default policy.") + lookupNote }, pts: 12 };
  }
  if (allTag === "~all") {
    return { check: { label: "SPF Record", status: "pass", value: record,
      detail: `Published, so receivers can tell which servers may send as you.${lookupNote} Optional: move ~all to -all for stricter enforcement once all your senders are listed.` }, pts: 23 };
  }
  return { check: { label: "SPF Record", status: "pass", value: record,
    detail: `Published with -all, so only the servers listed may send as you.${lookupNote}` }, pts: 25 };
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
        detail: "No DMARC record. Gmail and Yahoo require one from bulk senders. Add a TXT record at _dmarc with v=DMARC1; p=none; rua=mailto:you@yourdomain.com to start." },
      pts: 0,
    };
  }
  const tags = data.tags as Record<string, string> | undefined;
  const policy = tags?.p ?? "none";
  const record = (data.record as string) || "No record";
  const ruaTip = tags && !tags.rua ? " Add rua= to receive aggregate reports." : "";
  if (policy === "reject") {
    return { check: { label: "DMARC Policy", status: "pass", value: record, detail: "Published at p=reject: mail that fails authentication is rejected. Strongest protection." + ruaTip }, pts: 30 };
  }
  if (policy === "quarantine") {
    return { check: { label: "DMARC Policy", status: "pass", value: record, detail: "Published at p=quarantine: mail that fails authentication goes to spam." + ruaTip }, pts: 29 };
  }
  return { check: { label: "DMARC Policy", status: "pass", value: record,
    detail: "Published at p=none. Monitoring only, which meets Gmail and Yahoo's requirement and is fine for cold email. Optional: p=quarantine if you want enforcement." + ruaTip }, pts: 27 };
}

interface ListResult { name: string; status: "clean" | "listed" | "unavailable"; note?: string | null }

function normalizeBlacklist(data: Record<string, unknown>): { check: DnsCheck; pts: number } {
  const domainLists = (data.domainLists as ListResult[] | undefined) ?? [];
  const ipLists = (data.ipLists as ListResult[] | undefined) ?? [];
  const verdict = (data.verdict as string) ?? "unchecked";
  const fmt = (l: ListResult) => `${l.name} ${l.status === "unavailable" ? "not checked" : l.status}`;
  const value = domainLists.map(fmt).join(" · ") || "Not checked";

  const ipListed = ipLists.filter(l => l.status === "listed").map(l => l.name);
  const ipChecked = ipLists.filter(l => l.status !== "unavailable").length;
  const ipNote = data.ip
    ? ipListed.length
      ? ` The website's IP (${data.ip}) is listed on ${ipListed.join(", ")}. Mail sent through Google Workspace or Microsoft 365 leaves from their servers, so this describes the web host and isn't counted.`
      : ` The website's IP (${data.ip}) is clean on the ${ipChecked} IP lists that answered.`
    : "";
  const unavailable = domainLists.filter(l => l.status === "unavailable").map(l => l.name);
  const unavailableNote = unavailable.length
    ? ` ${unavailable.join(" and ")} refused the lookup, so ${unavailable.length > 1 ? "they weren't" : "it wasn't"} checked either way${unavailable.includes("Spamhaus DBL") ? "; check it free by hand at check.spamhaus.org" : ""}.`
    : "";

  if (verdict === "critical") {
    return { check: { label: "Blacklist Status", status: "fail", value,
      detail: "The domain is on the Spamhaus Domain Block List, which major providers use to filter mail. Fix the cause and request removal at check.spamhaus.org before sending more." + ipNote }, pts: 0 };
  }
  if (verdict === "warning" || verdict === "minor") {
    return { check: { label: "Blacklist Status", status: "warn", value,
      detail: "The domain is on SURBL, which lists domains seen in spam message bodies. In WarmInboxes' study of 2,817 sending domains, reply rates stayed flat after a SURBL listing while bounces rose slightly, so it's worth fixing but rarely the main problem. Request removal at surbl.org." + unavailableNote + ipNote }, pts: 14 };
  }
  if (verdict === "unchecked") {
    return { check: { label: "Blacklist Status", status: "warn", value,
      detail: "No domain blacklist answered this lookup, so blacklist status couldn't be checked either way. This isn't a listing." + unavailableNote + ipNote }, pts: 20 };
  }
  return { check: { label: "Blacklist Status", status: "pass", value,
    detail: "Not listed on the domain blacklists that answered." + unavailableNote + ipNote }, pts: 20 };
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

    return NextResponse.json({ id, domain: clean, score, checks, createdAt: Date.now() });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

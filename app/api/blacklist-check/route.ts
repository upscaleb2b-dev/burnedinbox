import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

const RBLS = [
  { name: "Spamhaus ZEN",   zone: "zen.spamhaus.org",       severity: "critical" },
  { name: "Spamhaus DBL",   zone: "dbl.spamhaus.org",       severity: "critical" },
  { name: "SURBL",          zone: "multi.surbl.org",         severity: "critical" },
  { name: "Barracuda",      zone: "b.barracudacentral.org",  severity: "critical" },
  { name: "SpamCop",        zone: "bl.spamcop.net",          severity: "high" },
  { name: "UCEPROTECT L1",  zone: "dnsbl-1.uceprotect.net", severity: "high" },
  { name: "UCEPROTECT L2",  zone: "dnsbl-2.uceprotect.net", severity: "medium" },
  { name: "UCEPROTECT L3",  zone: "dnsbl-3.uceprotect.net", severity: "medium" },
  { name: "SorteMail",      zone: "bl.0spam.org",            severity: "medium" },
  { name: "NordSpam",       zone: "bl.nordspam.com",         severity: "medium" },
  { name: "Mailspike BL",   zone: "bl.mailspike.net",        severity: "high" },
  { name: "Mailspike Z",    zone: "z.mailspike.net",         severity: "high" },
  { name: "Truncate",       zone: "truncate.gbudb.net",      severity: "medium" },
  { name: "JustSpam",       zone: "dnsbl.justspam.org",      severity: "low" },
  { name: "Sectoor",        zone: "tor.dnsbl.sectoor.de",    severity: "low" },
  { name: "Abusix ABI",     zone: "abuse.dnsbl.abusix.zone", severity: "high" },
];

function ipToRbl(ip: string, zone: string): string {
  const parts = ip.split(".");
  return `${parts[3]}.${parts[2]}.${parts[1]}.${parts[0]}.${zone}`;
}

function domainToRbl(domain: string, zone: string): string {
  return `${domain}.${zone}`;
}

async function checkRbl(query: string): Promise<boolean> {
  try {
    await dns.resolve4(query);
    return true; // Listed
  } catch { return false; }
}

function isIPv4(s: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(s);
}

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const { query: raw } = await req.json();
    if (!raw) return NextResponse.json({ error: "Domain or IP required" }, { status: 400 });

    const query = clean(raw);
    const isIp = isIPv4(query);

    // Resolve domain to IP if needed
    let ip: string | null = null;
    if (!isIp) {
      try {
        const ips = await dns.resolve4(query);
        ip = ips[0] || null;
      } catch { ip = null; }
    } else {
      ip = query;
    }

    // Run all RBL checks in parallel
    const checks = await Promise.all(RBLS.map(async (rbl) => {
      const lookupQuery = isIp
        ? ipToRbl(query, rbl.zone)
        : domainToRbl(query, rbl.zone);

      // Also check IP if we resolved one
      let listed = await checkRbl(lookupQuery);
      if (!listed && ip && !isIp) {
        listed = await checkRbl(ipToRbl(ip, rbl.zone));
      }

      return { ...rbl, listed };
    }));

    const listed = checks.filter(c => c.listed);
    const clean_ = checks.filter(c => !c.listed);

    const criticalHits = listed.filter(c => c.severity === "critical").length;
    const highHits     = listed.filter(c => c.severity === "high").length;

    let score = 100;
    score -= criticalHits * 30;
    score -= highHits * 15;
    score -= listed.filter(c => c.severity === "medium").length * 8;
    score -= listed.filter(c => c.severity === "low").length * 3;
    score = Math.max(0, score);

    const verdict = listed.length === 0 ? "clean" : criticalHits > 0 ? "critical" : highHits > 0 ? "warning" : "minor";

    return NextResponse.json({
      query, isIp, ip,
      total: RBLS.length,
      listed: listed.length,
      clean: clean_.length,
      checks,
      score,
      verdict,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Check failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

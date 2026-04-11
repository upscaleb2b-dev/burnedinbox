import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

function isValidIPv4(s: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(s) && s.split(".").every(n => +n >= 0 && +n <= 255);
}

function isValidIPv6(s: string) {
  return /^[0-9a-fA-F:]+$/.test(s) && s.includes(":");
}

async function resolveForward(hostname: string): Promise<string[]> {
  try {
    const v4 = await dns.resolve4(hostname);
    return v4;
  } catch {
    try {
      const v6 = await dns.resolve6(hostname);
      return v6;
    } catch { return []; }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { ip: raw } = await req.json();
    if (!raw) return NextResponse.json({ error: "IP address required" }, { status: 400 });

    const ip = raw.trim();
    const isV4 = isValidIPv4(ip);
    const isV6 = isValidIPv6(ip);

    if (!isV4 && !isV6) {
      return NextResponse.json({ error: "Invalid IP address format" }, { status: 400 });
    }

    // PTR lookup
    let ptrs: string[] = [];
    let found = false;
    try {
      ptrs = await dns.reverse(ip);
      found = ptrs.length > 0;
    } catch { found = false; }

    if (!found) {
      return NextResponse.json({
        ip, found: false, ptrs: [],
        message: `No PTR record found for ${ip}. This IP has no reverse DNS configured.`,
        forwardConfirmed: false, issues: ["No PTR record — some strict mail servers will reject email from IPs without rDNS"], tips: [], score: 10,
      });
    }

    // Forward-confirm each PTR (FCrDNS)
    const verified = await Promise.all(ptrs.map(async (ptr) => {
      const forwardIps = await resolveForward(ptr);
      const confirmed = forwardIps.includes(ip);
      return { ptr, forwardIps, confirmed };
    }));

    const allConfirmed = verified.every(v => v.confirmed);
    const anyConfirmed = verified.some(v => v.confirmed);

    const issues: string[] = [];
    const tips: string[] = [];
    let score = 40;

    if (found) score += 30;

    if (allConfirmed) {
      score += 30;
    } else if (anyConfirmed) {
      score += 15;
      tips.push("Some PTR records don't forward-confirm — ensure all PTR hostnames resolve back to this IP");
    } else {
      issues.push("Forward-confirmed rDNS (FCrDNS) failed — PTR hostname doesn't resolve back to this IP. Many enterprise mail servers require FCrDNS.");
    }

    // Check if PTR looks like a generic/ISP hostname (bad for email)
    const genericPatterns = [/\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}/, /static\./, /dynamic\./, /pool\./, /dhcp\./, /cable\./, /dsl\./, /broadband\./];
    const genericPtrs = verified.filter(v => genericPatterns.some(p => p.test(v.ptr)));
    if (genericPtrs.length > 0) {
      tips.push(`PTR hostname looks like a generic ISP address (${genericPtrs[0].ptr}) — a branded hostname is preferred for mail sending`);
      score -= 10;
    }

    // Multiple PTR records is unusual
    if (ptrs.length > 1) {
      tips.push(`${ptrs.length} PTR records found — multiple PTR records for one IP is unusual and may cause issues with some filters`);
    }

    score = Math.max(0, Math.min(100, score));

    return NextResponse.json({
      ip, found, ptrs,
      verified,
      forwardConfirmed: allConfirmed,
      anyConfirmed,
      issues, tips, score,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Lookup failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

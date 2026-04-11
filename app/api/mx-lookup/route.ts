import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

function detectProvider(exchange: string): string {
  const e = exchange.toLowerCase();
  if (e.includes("google") || e.includes("googlemail") || e.includes("aspmx")) return "Google Workspace";
  if (e.includes("outlook") || e.includes("hotmail") || e.includes("protection.microsoft")) return "Microsoft 365";
  if (e.includes("mimecast")) return "Mimecast";
  if (e.includes("proofpoint")) return "Proofpoint";
  if (e.includes("barracuda")) return "Barracuda";
  if (e.includes("messagelabs") || e.includes("symantec")) return "Symantec";
  if (e.includes("mailgun")) return "Mailgun";
  if (e.includes("sendgrid")) return "SendGrid";
  if (e.includes("amazonses") || e.includes("amazonaws")) return "Amazon SES";
  if (e.includes("zoho")) return "Zoho Mail";
  if (e.includes("fastmail")) return "Fastmail";
  if (e.includes("yahoo")) return "Yahoo Mail";
  if (e.includes("mailchimp") || e.includes("mandrill")) return "Mandrill";
  return "Custom / Unknown";
}

async function checkSmtpConnectivity(host: string): Promise<"reachable" | "timeout" | "unknown"> {
  // Node.js DNS can't do TCP checks — we verify the A record exists as a proxy
  try {
    await dns.resolve4(host);
    return "reachable";
  } catch {
    try {
      await dns.resolve6(host);
      return "reachable";
    } catch {
      return "timeout";
    }
  }
}

async function checkPTR(ip: string): Promise<string | null> {
  try {
    const ptrs = await dns.reverse(ip);
    return ptrs[0] || null;
  } catch { return null; }
}

async function resolveIp(host: string): Promise<string | null> {
  try {
    const ips = await dns.resolve4(host);
    return ips[0] || null;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { domain: raw } = await req.json();
    if (!raw) return NextResponse.json({ error: "Domain required" }, { status: 400 });

    const domain = clean(raw);

    let mxRecords: { priority: number; exchange: string }[] = [];
    let found = false;

    try {
      mxRecords = await dns.resolveMx(domain);
      mxRecords.sort((a, b) => a.priority - b.priority);
      found = mxRecords.length > 0;
    } catch {
      found = false;
    }

    if (!found) {
      return NextResponse.json({
        domain, found: false,
        message: `No MX records found for ${domain}. This domain cannot receive email.`,
        records: [], issues: [], tips: [], score: 0,
      });
    }

    // Enrich each record
    const records = await Promise.all(mxRecords.slice(0, 8).map(async (mx) => {
      const [ip, connectivity] = await Promise.all([
        resolveIp(mx.exchange),
        checkSmtpConnectivity(mx.exchange),
      ]);
      const ptr = ip ? await checkPTR(ip) : null;
      const ptrMatch = ptr ? ptr.includes(mx.exchange.split(".")[0]) || mx.exchange.includes(ptr.split(".")[0]) : false;

      return {
        priority: mx.priority,
        exchange: mx.exchange,
        provider: detectProvider(mx.exchange),
        ip,
        ptr,
        ptrMatch,
        connectivity,
      };
    }));

    // Analysis
    const issues: string[] = [];
    const tips: string[] = [];
    let score = 40; // base for having MX

    // Multiple MX for redundancy
    if (records.length === 1) {
      tips.push("Only one MX record — add a backup MX with higher priority number for redundancy");
      score += 10;
    } else {
      score += 20;
    }

    // Priority ordering
    const priorities = records.map(r => r.priority);
    const uniquePriorities = new Set(priorities);
    if (uniquePriorities.size < priorities.length) {
      issues.push("Duplicate priority values detected — each MX record should have a unique priority");
    } else {
      score += 10;
    }

    // Connectivity
    const unreachable = records.filter(r => r.connectivity === "timeout");
    if (unreachable.length > 0) {
      issues.push(`${unreachable.length} MX host(s) did not resolve — may indicate misconfiguration`);
    } else {
      score += 15;
    }

    // PTR records
    const missingPtr = records.filter(r => r.ip && !r.ptr);
    if (missingPtr.length > 0) {
      tips.push(`${missingPtr.length} mail server(s) missing reverse DNS (PTR) — some strict servers reject email without rDNS`);
    } else if (records.some(r => r.ptr)) {
      score += 15;
    }

    // Mixed providers warning
    const providers = [...new Set(records.map(r => r.provider).filter(p => p !== "Custom / Unknown"))];
    if (providers.length > 1) {
      tips.push(`Multiple mail providers detected (${providers.join(", ")}) — ensure routing is intentional`);
    }

    score = Math.min(100, Math.max(0, score));

    return NextResponse.json({
      domain,
      found: true,
      records,
      providers: [...new Set(records.map(r => r.provider))],
      issues,
      tips,
      score,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Lookup failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

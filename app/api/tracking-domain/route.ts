import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

async function getCNAME(domain: string): Promise<string | null> {
  try {
    const cnames = await dns.resolveCname(domain);
    return cnames[0] || null;
  } catch { return null; }
}

async function getA(domain: string): Promise<string[]> {
  try { return await dns.resolve4(domain); }
  catch { return []; }
}

async function getMX(domain: string): Promise<boolean> {
  try { const mx = await dns.resolveMx(domain); return mx.length > 0; }
  catch { return false; }
}

async function getTXT(domain: string): Promise<string[]> {
  try {
    const txts = await dns.resolveTxt(domain);
    return txts.map(chunks => chunks.join(""));
  } catch { return []; }
}

async function checkSSL(domain: string): Promise<{ ok: boolean; target?: string; error?: string }> {
  try {
    const res = await fetch(`https://${domain}`, {
      method: "HEAD", redirect: "manual",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BurnedInbox/1.0)" },
    });
    const location = res.headers.get("location");
    return { ok: true, target: location || undefined };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "SSL check failed" };
  }
}

function detectCNAMETarget(cname: string): string {
  const c = cname.toLowerCase();
  if (c.includes("clickmeter") || c.includes("trk.")) return "ClickMeter";
  if (c.includes("sendgrid")) return "SendGrid";
  if (c.includes("mailgun")) return "Mailgun";
  if (c.includes("mailchimp") || c.includes("list-manage")) return "Mailchimp";
  if (c.includes("hubspot")) return "HubSpot";
  if (c.includes("marketo")) return "Marketo";
  if (c.includes("salesforce") || c.includes("pardot")) return "Salesforce/Pardot";
  if (c.includes("postmark")) return "Postmark";
  if (c.includes("klaviyo")) return "Klaviyo";
  if (c.includes("instantly")) return "Instantly";
  if (c.includes("smartlead")) return "Smartlead";
  if (c.includes("lemlist")) return "Lemlist";
  if (c.includes("outreach")) return "Outreach";
  if (c.includes("salesloft")) return "Salesloft";
  if (c.includes("cloudflare")) return "Cloudflare";
  if (c.includes("amazonaws") || c.includes("aws")) return "AWS";
  if (c.includes("fastly")) return "Fastly";
  if (c.includes("cloudfront")) return "CloudFront";
  return "Custom / Unknown";
}

function isCloudflareProxied(ips: string[]): boolean {
  // Cloudflare IP ranges (partial — key /16s)
  const cfRanges = ["104.16.", "104.17.", "104.18.", "104.19.", "104.20.", "104.21.", "104.22.", "104.23.", "104.24.", "104.25.", "104.26.", "104.27.", "104.28.", "104.29.", "104.30.", "104.31.", "172.64.", "172.65.", "172.66.", "172.67.", "162.158.", "198.41.", "190.93.", "188.114.", "197.234."];
  return ips.some(ip => cfRanges.some(r => ip.startsWith(r)));
}

export async function POST(req: NextRequest) {
  try {
    const { domain: raw, primaryDomain: primaryRaw } = await req.json();
    if (!raw) return NextResponse.json({ error: "Tracking domain required" }, { status: 400 });

    const domain = clean(raw);
    const primaryDomain = primaryRaw ? clean(primaryRaw) : null;

    const [cname, ips, hasMX, txts, sslResult] = await Promise.all([
      getCNAME(domain),
      getA(domain),
      getMX(domain),
      getTXT(domain),
      checkSSL(domain),
    ]);

    const issues: string[] = [];
    const tips: string[] = [];
    let score = 30;

    // CNAME check
    const cnameTarget = cname ? detectCNAMETarget(cname) : null;
    if (cname) {
      score += 25;
    } else if (ips.length > 0) {
      tips.push("Tracking domain uses A records instead of a CNAME — most ESPs recommend using a CNAME for tracking domains");
    } else {
      issues.push("No CNAME or A record found — tracking domain is not pointed anywhere");
    }

    // Cloudflare proxy detection
    const cloudflareProxied = isCloudflareProxied(ips);
    if (cloudflareProxied) {
      issues.push("Tracking domain appears to be proxied through Cloudflare (orange cloud) — this often breaks click tracking. Set to DNS Only (grey cloud).");
    } else if (ips.length > 0) {
      score += 15;
    }

    // SSL check
    if (sslResult.ok) {
      score += 20;
    } else {
      issues.push(`SSL/HTTPS check failed: ${sslResult.error || "Could not connect"} — tracking links must be served over HTTPS`);
    }

    // MX records on tracking domain is a red flag
    if (hasMX) {
      tips.push("Tracking domain has MX records — tracking domains usually shouldn't receive email. This may indicate the tracking domain is also used as a sending domain.");
    } else {
      score += 5;
    }

    // SPF on tracking domain
    const hasSPF = txts.some(t => t.startsWith("v=spf1"));
    if (hasSPF) {
      tips.push("Tracking domain has an SPF record — if this domain is only for tracking links (not sending email), SPF isn't needed here");
    }

    // Primary domain isolation check
    let isolationIssues: string[] = [];
    if (primaryDomain) {
      // Check if tracking domain is a subdomain of primary
      if (domain.endsWith(`.${primaryDomain}`) || domain === primaryDomain) {
        tips.push(`Tracking domain (${domain}) is a subdomain of your primary domain (${primaryDomain}) — consider using a completely separate domain to protect your primary domain's reputation`);
      } else {
        score += 5;
        isolationIssues = [];
      }
    }

    // Check if CNAME leaks branding from primary
    if (cname && primaryDomain && cname.includes(primaryDomain)) {
      issues.push("CNAME target contains your primary domain name — this could reveal your primary brand to recipients");
    }

    score = Math.max(0, Math.min(100, score));

    return NextResponse.json({
      domain,
      primaryDomain,
      cname,
      cnameTarget,
      ips,
      hasMX,
      hasSPF,
      cloudflareProxied,
      ssl: sslResult,
      issues: [...issues, ...isolationIssues],
      tips,
      score,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Check failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

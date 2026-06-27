import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

async function getBimiRecord(domain: string): Promise<string | null> {
  // Check default._bimi.domain
  try {
    const txts = await dns.resolveTxt(`default._bimi.${domain}`);
    const rec = txts.map(c => c.join("")).find(t => t.startsWith("v=BIMI1"));
    return rec ?? null;
  } catch { return null; }
}

async function checkUrl(url: string): Promise<{ ok: boolean; status?: number; contentType?: string; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(7000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BurnedInBox/1.0)" },
    });
    const contentType = res.headers.get("content-type") ?? "";
    return { ok: res.ok, status: res.status, contentType };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "fetch failed" };
  }
}

async function getDmarcPolicy(domain: string): Promise<string | null> {
  try {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(`_dmarc.${domain}`)}&type=TXT`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    const rec = data.Answer?.map((a: { data: string }) => a.data.replace(/^"|"$/g, ""))
      .find((d: string) => d.startsWith("v=DMARC1"));
    if (!rec) return null;
    const tags: Record<string, string> = {};
    rec.split(";").forEach((p: string) => {
      const [k, ...v] = p.trim().split("=");
      if (k) tags[k.trim().toLowerCase()] = v.join("=").trim();
    });
    return tags.p ?? null;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { domain: raw } = await req.json();
    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "Domain required" }, { status: 400 });
    }
    const domain = clean(raw);

    const [bimiRecord, dmarcPolicy] = await Promise.all([
      getBimiRecord(domain),
      getDmarcPolicy(domain),
    ]);

    if (!bimiRecord) {
      return NextResponse.json({
        domain, found: false, record: null, tags: {},
        dmarcPolicy, score: 0,
        analysis: [],
        message: `No BIMI record found at default._bimi.${domain}`,
      });
    }

    // Parse BIMI tags
    const tags: Record<string, string> = {};
    bimiRecord.split(";").forEach(part => {
      const [k, ...v] = part.trim().split("=");
      if (k && v.length) tags[k.trim().toLowerCase()] = v.join("=").trim();
    });

    const analysis: { tag: string; label: string; value: string; status: string; note: string }[] = [];
    const issues: string[] = [];
    const tips: string[] = [];
    let score = 0;

    // v= version
    if (tags.v === "BIMI1") {
      score += 10;
      analysis.push({ tag: "v", label: "Version", value: "BIMI1", status: "pass", note: "Valid BIMI version" });
    } else {
      issues.push("Missing or invalid BIMI version tag (v=BIMI1)");
      analysis.push({ tag: "v", label: "Version", value: tags.v || "missing", status: "fail", note: "Must be v=BIMI1" });
    }

    // l= logo URL
    const logoUrl = tags.l || "";
    if (logoUrl) {
      const logoCheck = await checkUrl(logoUrl);
      const isSvg = logoUrl.endsWith(".svg") || (logoCheck.contentType?.includes("svg") ?? false);
      if (logoCheck.ok && isSvg) {
        score += 30;
        analysis.push({ tag: "l", label: "Logo URL", value: logoUrl, status: "pass", note: "Logo URL is reachable and is an SVG" });
      } else if (logoCheck.ok && !isSvg) {
        score += 15;
        tips.push("Logo URL is reachable but may not be an SVG — BIMI requires a Scaled Vector Graphic (SVG Tiny 1.2)");
        analysis.push({ tag: "l", label: "Logo URL", value: logoUrl, status: "warn", note: "Reachable but ensure it's SVG Tiny 1.2 format" });
      } else {
        issues.push(`Logo URL is unreachable (${logoCheck.error || `HTTP ${logoCheck.status}`}) — fix URL or server`);
        analysis.push({ tag: "l", label: "Logo URL", value: logoUrl, status: "fail", note: `Not reachable: ${logoCheck.error || `HTTP ${logoCheck.status}`}` });
      }
    } else {
      issues.push("No logo URL (l=) in BIMI record — required for logo display");
      analysis.push({ tag: "l", label: "Logo URL", value: "not set", status: "fail", note: "Logo URL is required" });
    }

    // a= authority evidence (VMC certificate)
    const vmcUrl = tags.a || "";
    if (vmcUrl) {
      const vmcCheck = await checkUrl(vmcUrl);
      if (vmcCheck.ok) {
        score += 40;
        analysis.push({ tag: "a", label: "VMC Certificate", value: vmcUrl, status: "pass", note: "Verified Mark Certificate URL is reachable — enables logo display in Gmail, Apple Mail" });
      } else {
        issues.push(`VMC certificate URL unreachable (${vmcCheck.error || `HTTP ${vmcCheck.status}`})`);
        analysis.push({ tag: "a", label: "VMC Certificate", value: vmcUrl, status: "fail", note: `Not reachable: ${vmcCheck.error || `HTTP ${vmcCheck.status}`}` });
      }
    } else {
      tips.push("No VMC certificate (a=) — without one, BIMI logos only display in a few mail clients. A VMC from DigiCert or Entrust enables Gmail logo display.");
      analysis.push({ tag: "a", label: "VMC Certificate", value: "not set", status: "warn", note: "Optional but required by Gmail and Yahoo for logo display" });
      score += 5; // Partial credit for having BIMI at all
    }

    // DMARC requirement
    if (dmarcPolicy === "reject") {
      score += 20;
      analysis.push({ tag: "dmarc", label: "DMARC Policy", value: "p=reject", status: "pass", note: "DMARC p=reject is set — required for BIMI to be honored" });
    } else if (dmarcPolicy === "quarantine") {
      score += 10;
      tips.push("DMARC is p=quarantine — some mail clients require p=reject for BIMI. Upgrade for full BIMI support.");
      analysis.push({ tag: "dmarc", label: "DMARC Policy", value: "p=quarantine", status: "warn", note: "Upgrade to p=reject for full BIMI support" });
    } else {
      issues.push(`DMARC policy is ${dmarcPolicy || "missing"} — BIMI requires DMARC p=reject (or p=quarantine for some providers)`);
      analysis.push({ tag: "dmarc", label: "DMARC Policy", value: dmarcPolicy || "missing", status: "fail", note: "BIMI requires DMARC p=reject" });
    }

    score = Math.min(100, score);
    const verdict = score >= 80 ? "strong" : score >= 50 ? "partial" : score >= 20 ? "weak" : "none";

    return NextResponse.json({
      domain, found: true, record: bimiRecord, tags,
      logoUrl: logoUrl || null,
      vmcUrl: vmcUrl || null,
      dmarcPolicy,
      analysis, issues, tips, score, verdict,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Lookup failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

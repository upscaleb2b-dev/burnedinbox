import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

async function getMtaStsRecord(domain: string): Promise<string | null> {
  try {
    const txts = await dns.resolveTxt(`_mta-sts.${domain}`);
    const rec = txts.map(c => c.join("")).find(t => t.startsWith("v=STSv1"));
    return rec ?? null;
  } catch { return null; }
}

async function getTlsRptRecord(domain: string): Promise<string | null> {
  try {
    const txts = await dns.resolveTxt(`_smtp._tls.${domain}`);
    const rec = txts.map(c => c.join("")).find(t => t.startsWith("v=TLSRPTv1"));
    return rec ?? null;
  } catch { return null; }
}

async function fetchPolicyFile(domain: string): Promise<{ ok: boolean; body?: string; status?: number; error?: string }> {
  try {
    const res = await fetch(`https://mta-sts.${domain}/.well-known/mta-sts.txt`, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BurnedInBox/1.0)" },
    });
    if (!res.ok) return { ok: false, status: res.status };
    const body = await res.text();
    return { ok: true, body, status: res.status };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "fetch failed" };
  }
}

function parsePolicyFile(body: string): Record<string, string | string[]> {
  const tags: Record<string, string | string[]> = {};
  const mxList: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const [k, ...v] = line.split(":");
    if (!k || !v.length) continue;
    const key = k.trim().toLowerCase();
    const val = v.join(":").trim();
    if (key === "mx") {
      mxList.push(val);
    } else {
      tags[key] = val;
    }
  }
  if (mxList.length) tags.mx = mxList;
  return tags;
}

export async function POST(req: NextRequest) {
  try {
    const { domain: raw } = await req.json();
    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "Domain required" }, { status: 400 });
    }
    const domain = clean(raw);

    const [stsRecord, tlsRptRecord, policyFile] = await Promise.all([
      getMtaStsRecord(domain),
      getTlsRptRecord(domain),
      fetchPolicyFile(domain),
    ]);

    const analysis: { label: string; value: string; status: string; note: string }[] = [];
    const issues: string[] = [];
    const tips: string[] = [];
    let score = 0;

    // MTA-STS DNS record
    let stsTags: Record<string, string> = {};
    if (stsRecord) {
      score += 20;
      stsRecord.split(";").forEach(p => {
        const [k, ...v] = p.trim().split("=");
        if (k) stsTags[k.trim().toLowerCase()] = v.join("=").trim();
      });
      analysis.push({ label: "_mta-sts DNS record", value: stsRecord, status: "pass", note: "MTA-STS DNS record found" });
      if (stsTags.id) {
        analysis.push({ label: "Policy ID", value: stsTags.id, status: "pass", note: "Policy ID allows senders to cache and invalidate the policy" });
      }
    } else {
      issues.push(`No MTA-STS DNS record found at _mta-sts.${domain} — add v=STSv1; id=<timestamp> TXT record`);
      analysis.push({ label: "_mta-sts DNS record", value: "not found", status: "fail", note: `Add a TXT record at _mta-sts.${domain}` });
    }

    // Policy file
    let policyTags: Record<string, string | string[]> = {};
    if (policyFile.ok && policyFile.body) {
      policyTags = parsePolicyFile(policyFile.body);
      const mode = (policyTags.version_check || policyTags.mode || "") as string;
      const policyMode = (policyTags.mode || "") as string;
      const maxAge = (policyTags.max_age || "") as string;
      const mxEntries = (policyTags.mx || []) as string[];

      if ((policyTags.version as string)?.toLowerCase() === "sts1" || policyFile.body.includes("version: STSv1")) {
        score += 10;
        analysis.push({ label: "Policy version", value: "STSv1", status: "pass", note: "Valid policy file version" });
      }

      if (policyMode === "enforce") {
        score += 30;
        analysis.push({ label: "Policy mode", value: "enforce", status: "pass", note: "Enforce mode — TLS is required for delivery. Emails rejected if TLS fails." });
      } else if (policyMode === "testing") {
        score += 15;
        tips.push("MTA-STS is in 'testing' mode — TLS failures are reported but not enforced. Upgrade to 'enforce' once testing is complete.");
        analysis.push({ label: "Policy mode", value: "testing", status: "warn", note: "Testing mode — upgrade to enforce for full protection" });
      } else if (policyMode === "none") {
        issues.push("MTA-STS policy mode is 'none' — no TLS enforcement. Set mode to 'enforce' or 'testing'.");
        analysis.push({ label: "Policy mode", value: "none", status: "fail", note: "Mode 'none' disables enforcement" });
      } else {
        issues.push(`Unknown or missing policy mode: '${policyMode}'`);
        analysis.push({ label: "Policy mode", value: policyMode || "missing", status: "fail", note: "Must be enforce, testing, or none" });
      }

      if (mxEntries.length > 0) {
        score += 15;
        analysis.push({ label: "MX entries", value: mxEntries.join(", "), status: "pass", note: `${mxEntries.length} MX pattern(s) authorized for TLS connections` });
      } else {
        issues.push("No MX entries in policy file — add mx: lines for each of your mail servers");
        analysis.push({ label: "MX entries", value: "none", status: "fail", note: "Policy file must list authorized MX hosts" });
      }

      const maxAgeNum = parseInt(maxAge, 10);
      if (maxAgeNum >= 86400) {
        score += 10;
        const days = Math.floor(maxAgeNum / 86400);
        analysis.push({ label: "max_age", value: `${maxAge}s (${days} days)`, status: "pass", note: "Policy cache duration" });
      } else if (maxAge) {
        tips.push(`max_age is ${maxAge}s — recommended minimum is 86400 (1 day), ideal is 604800 (1 week)`);
        analysis.push({ label: "max_age", value: `${maxAge}s`, status: "warn", note: "Low max_age — increase to 604800 for better caching" });
        score += 5;
      } else {
        issues.push("Missing max_age in policy file");
        analysis.push({ label: "max_age", value: "missing", status: "fail", note: "Required field — set to 86400 minimum" });
      }

      analysis.push({ label: "Policy file URL", value: `https://mta-sts.${domain}/.well-known/mta-sts.txt`, status: "pass", note: `Reachable — HTTP ${policyFile.status}` });
    } else {
      const errMsg = policyFile.error || `HTTP ${policyFile.status}`;
      issues.push(`Policy file not reachable at https://mta-sts.${domain}/.well-known/mta-sts.txt — ${errMsg}`);
      analysis.push({ label: "Policy file", value: `Not reachable: ${errMsg}`, status: "fail", note: `Host mta-sts.${domain} must serve the policy file over HTTPS` });
    }

    // TLS-RPT record
    if (tlsRptRecord) {
      const rptTags: Record<string, string> = {};
      tlsRptRecord.split(";").forEach(p => {
        const [k, ...v] = p.trim().split("=");
        if (k) rptTags[k.trim().toLowerCase()] = v.join("=").trim();
      });
      score += 15;
      analysis.push({ label: "TLS-RPT record", value: tlsRptRecord, status: "pass", note: "TLS failure reports will be sent to the configured address" });
      if (rptTags.rua) {
        analysis.push({ label: "Report address", value: rptTags.rua, status: "pass", note: "TLS failure reports delivered here" });
      }
    } else {
      tips.push(`No TLS-RPT record at _smtp._tls.${domain} — add v=TLSRPTv1; rua=mailto:tls-reports@${domain} to receive delivery failure reports`);
      analysis.push({ label: "TLS-RPT record", value: "not found", status: "warn", note: "Optional but recommended — receive TLS failure notifications" });
    }

    score = Math.min(100, score);
    const policyMode = (policyTags.mode || "none") as string;
    const verdict = !stsRecord && !policyFile.ok ? "not-configured"
      : policyMode === "enforce" && score >= 70 ? "enforcing"
      : policyMode === "testing" ? "testing"
      : "partial";

    return NextResponse.json({
      domain,
      stsRecord,
      stsTags,
      policyFile: policyFile.ok ? {
        url: `https://mta-sts.${domain}/.well-known/mta-sts.txt`,
        body: policyFile.body,
        tags: policyTags,
      } : null,
      tlsRptRecord,
      analysis, issues, tips, score, verdict,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Lookup failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

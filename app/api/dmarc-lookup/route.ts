import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { domain: raw } = await req.json();
    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "Missing domain field" }, { status: 400 });
    }

    const cleanDomain = raw.trim().toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");

    const lookupDomain = `_dmarc.${cleanDomain}`;

    const url = `https://dns.google/resolve?name=${encodeURIComponent(lookupDomain)}&type=TXT`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Status === 3 || !data.Answer || data.Answer.length === 0) {
      return NextResponse.json({
        domain: cleanDomain, found: false, record: null, tags: {}, analysis: [], score: 0,
        verdict: "missing",
        message: "No DMARC record found. Your domain has no DMARC policy.",
      });
    }

    const dmarcRecord = data.Answer
      .map((a: { data: string }) => a.data.replace(/^"|"$/g, "").replace(/"\s*"/g, ""))
      .find((d: string) => d.startsWith("v=DMARC1"));

    if (!dmarcRecord) {
      return NextResponse.json({
        domain: cleanDomain, found: false, record: null, tags: {}, analysis: [], score: 0,
        verdict: "missing",
        message: "TXT records exist but no valid DMARC record found (must start with v=DMARC1).",
      });
    }

    const tags: Record<string, string> = {};
    dmarcRecord.split(";").forEach((part: string) => {
      const [key, ...rest] = part.trim().split("=");
      if (key && rest.length > 0) tags[key.trim().toLowerCase()] = rest.join("=").trim();
    });

    const analysis: { tag: string; label: string; value: string; status: string; note: string }[] = [];
    let score = 0;

    if (tags.v === "DMARC1") {
      analysis.push({ tag: "v", label: "Version", value: tags.v, status: "pass", note: "Valid DMARC version" });
      score += 10;
    } else {
      analysis.push({ tag: "v", label: "Version", value: tags.v || "missing", status: "fail", note: "Invalid or missing version tag" });
    }

    const policy = tags.p || "none";
    if (policy === "reject") {
      analysis.push({ tag: "p", label: "Policy", value: policy, status: "pass", note: "Strongest policy — unauthorized emails are rejected" });
      score += 40;
    } else if (policy === "quarantine") {
      analysis.push({ tag: "p", label: "Policy", value: policy, status: "warn", note: "Good policy — unauthorized emails go to spam" });
      score += 25;
    } else {
      analysis.push({ tag: "p", label: "Policy", value: policy, status: "fail", note: "Weakest policy — monitoring only, no protection" });
      score += 5;
    }

    if (tags.sp) {
      const sp = tags.sp;
      const spStatus = sp === "reject" ? "pass" : sp === "quarantine" ? "warn" : "info";
      analysis.push({ tag: "sp", label: "Subdomain policy", value: sp, status: spStatus, note: `Subdomains will use '${sp}' policy` });
      if (sp === "reject") score += 10;
      else if (sp === "quarantine") score += 5;
    } else {
      analysis.push({ tag: "sp", label: "Subdomain policy", value: "not set", status: "info", note: "Subdomains will inherit the main policy" });
    }

    if (tags.pct) {
      const pct = parseInt(tags.pct, 10);
      if (pct === 100) {
        analysis.push({ tag: "pct", label: "Percentage", value: `${pct}%`, status: "pass", note: "Policy applies to 100% of emails" });
        score += 10;
      } else {
        analysis.push({ tag: "pct", label: "Percentage", value: `${pct}%`, status: "warn", note: `Policy only applies to ${pct}% — increase to 100% for full protection` });
        score += 3;
      }
    } else {
      analysis.push({ tag: "pct", label: "Percentage", value: "100% (default)", status: "pass", note: "Defaults to 100% — policy applies to all emails" });
      score += 10;
    }

    if (tags.rua) {
      analysis.push({ tag: "rua", label: "Aggregate reports", value: tags.rua, status: "pass", note: "Aggregate reports will be sent to this address" });
      score += 15;
    } else {
      analysis.push({ tag: "rua", label: "Aggregate reports", value: "not set", status: "warn", note: "No aggregate report address — you won't receive DMARC reports" });
    }

    if (tags.ruf) {
      analysis.push({ tag: "ruf", label: "Forensic reports", value: tags.ruf, status: "pass", note: "Forensic reports will be sent to this address" });
      score += 5;
    } else {
      analysis.push({ tag: "ruf", label: "Forensic reports", value: "not set", status: "info", note: "No forensic report address — optional but useful for debugging" });
    }

    if (tags.adkim) {
      const mode = tags.adkim === "s" ? "strict" : "relaxed";
      analysis.push({ tag: "adkim", label: "DKIM alignment", value: `${tags.adkim} (${mode})`, status: tags.adkim === "s" ? "pass" : "info", note: `DKIM alignment is ${mode}` });
      if (tags.adkim === "s") score += 5;
    } else {
      analysis.push({ tag: "adkim", label: "DKIM alignment", value: "r (relaxed, default)", status: "info", note: "Defaults to relaxed alignment" });
    }

    if (tags.aspf) {
      const mode = tags.aspf === "s" ? "strict" : "relaxed";
      analysis.push({ tag: "aspf", label: "SPF alignment", value: `${tags.aspf} (${mode})`, status: tags.aspf === "s" ? "pass" : "info", note: `SPF alignment is ${mode}` });
      if (tags.aspf === "s") score += 5;
    } else {
      analysis.push({ tag: "aspf", label: "SPF alignment", value: "r (relaxed, default)", status: "info", note: "Defaults to relaxed alignment" });
    }

    score = Math.min(100, score);
    const verdict = score >= 80 ? "strong" : score >= 50 ? "moderate" : score >= 20 ? "weak" : "missing";

    return NextResponse.json({ domain: cleanDomain, found: true, record: dmarcRecord, tags, analysis, score, verdict });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Lookup failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

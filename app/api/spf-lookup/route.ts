import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
}

function parseSpf(record: string) {
  const parts = record.split(/\s+/).filter(Boolean);
  const mechanisms: { type: string; value: string; qualifier: string }[] = [];
  let all = "";

  for (const p of parts) {
    if (p === "v=spf1") continue;
    const qualifier = ["+", "-", "~", "?"].includes(p[0]) ? p[0] : "+";
    const mech = qualifier === p[0] ? p.slice(1) : p;

    if (mech === "all" || mech === "+all" || mech === "-all" || mech === "~all" || mech === "?all") {
      all = p; continue;
    }
    const [type, ...rest] = mech.split(":");
    mechanisms.push({ type, value: rest.join(":") || "", qualifier });
  }
  return { mechanisms, all, raw: record };
}

function gradeSpf(parsed: ReturnType<typeof parseSpf>) {
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 100;

  if (!parsed.all) {
    issues.push("SPF record has no default policy (all) — add -all to reject unauthorized senders");
    score -= 30;
  } else if (parsed.all === "+all" || parsed.all === "all") {
    issues.push("SPF uses +all or bare all — any server can send as your domain. Change to -all immediately.");
    score -= 40;
  } else if (parsed.all === "?all") {
    issues.push("SPF uses ?all (neutral) — provides no protection. Use -all to reject unauthorized senders.");
    score -= 25;
  } else if (parsed.all === "~all") {
    tips.push("Consider upgrading ~all (softfail) to -all (hardfail) for stricter enforcement");
    score -= 10;
  }

  const includes = parsed.mechanisms.filter(m => m.type === "include");
  if (includes.length > 8) {
    issues.push(`Too many includes (${includes.length}) — SPF has a 10 DNS lookup limit`);
    score -= 20;
  }

  if (parsed.mechanisms.length === 0 && !parsed.all) {
    issues.push("SPF record appears empty or malformed");
    score -= 50;
  }

  return { score: Math.max(0, score), issues, tips };
}

export async function POST(req: NextRequest) {
  try {
    const { domain: raw } = await req.json();
    if (!raw) return NextResponse.json({ error: "Domain required" }, { status: 400 });
    const domain = clean(raw);

    let spfRecord = "";
    let found = false;

    try {
      const txts = await dns.resolveTxt(domain);
      const spfTxt = txts.find(chunks => chunks.join("").startsWith("v=spf1"));
      if (spfTxt) { spfRecord = spfTxt.join(""); found = true; }
    } catch { found = false; }

    if (!found) {
      return NextResponse.json({ domain, found: false, message: `No SPF record found for ${domain}` });
    }

    const parsed = parseSpf(spfRecord);
    const grade = gradeSpf(parsed);

    return NextResponse.json({ domain, found: true, record: spfRecord, parsed, grade });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

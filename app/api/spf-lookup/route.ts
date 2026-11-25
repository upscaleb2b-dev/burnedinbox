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

async function spfRecordsAt(domain: string): Promise<string[]> {
  try {
    const txts = await dns.resolveTxt(domain);
    return txts.map(chunks => chunks.join("")).filter(t => /^v=spf1(\s|$)/i.test(t));
  } catch { return []; }
}

// RFC 7208: include, a, mx, ptr, exists and redirect each cost one DNS lookup,
// counted recursively through includes and redirects; more than 10 is a permerror.
async function countLookups(record: string, depth = 0, seen = new Set<string>()): Promise<number> {
  if (depth > 10) return 0;
  let count = 0;
  for (const term of record.split(/\s+/).slice(1)) {
    const t = term.replace(/^[+\-~?]/, "").toLowerCase();
    const [rawMech, arg] = t.split(/[:=]/, 2);
    const mech = rawMech.split("/")[0];
    if (["a", "mx", "ptr", "exists"].includes(mech)) count++;
    if ((mech === "include" || mech === "redirect") && arg) {
      count++;
      if (seen.has(arg)) continue;
      seen.add(arg);
      const [child] = await spfRecordsAt(arg);
      if (child) count += await countLookups(child, depth + 1, seen);
    }
  }
  return count;
}

function gradeSpf(parsed: ReturnType<typeof parseSpf>, lookupCount: number, recordCount: number) {
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 100;

  if (recordCount > 1) {
    issues.push(`${recordCount} SPF records published. Receivers treat more than one as a permanent error, so SPF fails until they're merged into one`);
    score -= 50;
  }
  if (!parsed.all) {
    issues.push("SPF record has no default policy (all). Add ~all or -all so unlisted senders are flagged");
    score -= 30;
  } else if (parsed.all === "+all" || parsed.all === "all") {
    issues.push("SPF uses +all, which lets any server send as your domain. Change it to ~all or -all");
    score -= 40;
  } else if (parsed.all === "?all") {
    issues.push("SPF uses ?all (neutral), which gives no protection. Use ~all or -all");
    score -= 25;
  } else if (parsed.all === "~all") {
    tips.push("Consider upgrading ~all to -all for stricter enforcement once you're confident all senders are listed");
    score -= 8;
  }

  if (lookupCount > 10) {
    issues.push(`SPF needs ${lookupCount} DNS lookups; the limit is 10, so receivers return a permanent error and SPF fails`);
    score -= 40;
  } else if (lookupCount >= 9) {
    tips.push(`SPF uses ${lookupCount} of its 10 allowed DNS lookups. One more include will break it`);
    score -= 5;
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

    const records = await spfRecordsAt(domain);
    if (records.length === 0) {
      return NextResponse.json({ domain, found: false, message: `No SPF record found for ${domain}` });
    }
    const spfRecord = records[0];

    const parsed = parseSpf(spfRecord);
    const lookupCount = await countLookups(spfRecord);
    const grade = gradeSpf(parsed, lookupCount, records.length);

    return NextResponse.json({ domain, found: true, record: spfRecord, recordCount: records.length, lookupCount, lookupLimit: 10, parsed, grade });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

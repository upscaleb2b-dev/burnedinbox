import dns from "dns/promises";
import { DnsCheck } from "./types";

// ── SPF ───────────────────────────────────────────────────────────────────────

async function checkSpf(domain: string): Promise<{ check: DnsCheck; pts: number }> {
  try {
    const txts = await dns.resolveTxt(domain);
    const spfTxt = txts.find(chunks => chunks.join("").startsWith("v=spf1"));

    if (!spfTxt) {
      return {
        check: {
          label: "SPF Record",
          status: "fail",
          value: "No SPF record found",
          detail: "No SPF record exists for this domain. Any server can send email claiming to be you. Add v=spf1 ... -all to your DNS.",
        },
        pts: 0,
      };
    }

    const record = spfTxt.join("");
    const parts = record.split(/\s+/);
    const allTag = parts.find(p => /^[+~?-]?all$/.test(p)) || "";
    const includes = parts.filter(p => p.startsWith("include:")).length;

    let status: DnsCheck["status"];
    let pts: number;
    let detail: string;

    if (allTag === "-all") {
      status = "pass"; pts = 25;
      detail = "SPF hardfail (-all) active. Only your authorized servers can send as this domain.";
    } else if (allTag === "~all") {
      status = "warn"; pts = 15;
      detail = "SPF softfail (~all) — unauthorized senders aren't rejected outright. Upgrade to -all for stricter enforcement.";
    } else if (allTag === "+all" || allTag === "all") {
      status = "fail"; pts = 3;
      detail = "SPF uses +all, which allows any server to send as your domain. This provides zero protection — change to -all immediately.";
    } else {
      status = "warn"; pts = 10;
      detail = "SPF record found but missing an 'all' qualifier. Add -all to complete the policy.";
    }

    if (includes > 8) {
      pts = Math.max(0, pts - 10);
      detail += ` Note: ${includes} includes detected — SPF allows a maximum of 10 DNS lookups before PermError.`;
    }

    return { check: { label: "SPF Record", status, value: record, detail }, pts };
  } catch {
    return {
      check: {
        label: "SPF Record",
        status: "fail",
        value: "DNS lookup failed",
        detail: "Could not resolve SPF record. Verify your domain's DNS is accessible.",
      },
      pts: 0,
    };
  }
}

// ── DKIM ──────────────────────────────────────────────────────────────────────

const SELECTORS = [
  "default", "google", "mail", "k1", "k2",
  "selector1", "selector2", "dkim", "email",
  "s1", "s2", "sig1", "mimecast", "sendgrid",
];

async function probeSelector(selector: string, domain: string) {
  const name = `${selector}._domainkey.${domain}`;
  const txts = await dns.resolveTxt(name);
  const raw = txts.map(c => c.join("")).find(t => t.includes("v=DKIM1") || t.includes("k=") || t.includes("p="));
  if (!raw) throw new Error("no record");
  return { selector, record: raw, name };
}

async function checkDkim(domain: string): Promise<{ check: DnsCheck; pts: number }> {
  const settled = await Promise.allSettled(SELECTORS.map(s => probeSelector(s, domain)));
  const found = settled
    .filter((r): r is PromiseFulfilledResult<{ selector: string; record: string; name: string }> => r.status === "fulfilled")
    .map(r => r.value);

  if (found.length === 0) {
    return {
      check: {
        label: "DKIM Signature",
        status: "fail",
        value: "No DKIM record found",
        detail: "DKIM signing not detected across common selectors. Emails cannot prove they haven't been tampered with. Configure DKIM with your email provider.",
      },
      pts: 0,
    };
  }

  const best = found[0];
  const tags: Record<string, string> = {};
  best.record.split(";").forEach(part => {
    const [k, ...v] = part.trim().split("=");
    if (k) tags[k.trim().toLowerCase()] = v.join("=").trim();
  });

  const pubkey = tags.p || "";
  let pts = 18;
  let keyLabel = "";

  if (pubkey) {
    const bin = Buffer.from(pubkey.replace(/\s/g, ""), "base64");
    if (bin.length > 200) { pts = 25; keyLabel = "2048-bit"; }
    else if (bin.length > 100) { pts = 18; keyLabel = "1024-bit"; }
    else { pts = 10; keyLabel = "512-bit"; }
  }

  const selectorList = found.map(f => f.selector).join(", ");
  const status: DnsCheck["status"] = pts >= 25 ? "pass" : "warn";
  const detail = pts >= 25
    ? `DKIM active on selector${found.length > 1 ? "s" : ""}: ${selectorList}. 2048-bit RSA — strong authentication.`
    : `DKIM found (${selectorList})${keyLabel ? ` with ${keyLabel} key` : ""}. ${keyLabel === "1024-bit" ? "Upgrade to 2048-bit RSA for better security." : "Key length unclear — verify with your provider."}`;

  return {
    check: {
      label: "DKIM Signature",
      status,
      value: `${best.selector}._domainkey.${domain}${keyLabel ? ` — ${keyLabel}` : ""}`,
      detail,
    },
    pts,
  };
}

// ── DMARC ─────────────────────────────────────────────────────────────────────

async function checkDmarc(domain: string): Promise<{ check: DnsCheck; pts: number }> {
  try {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(`_dmarc.${domain}`)}&type=TXT`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();

    if (data.Status === 3 || !data.Answer?.length) {
      return {
        check: {
          label: "DMARC Policy",
          status: "fail",
          value: "No DMARC record found",
          detail: "No DMARC policy set. Your domain has no protection against spoofing or phishing. Add a _dmarc TXT record — start with p=none to monitor, then move to p=quarantine or p=reject.",
        },
        pts: 0,
      };
    }

    const record: string | undefined = data.Answer
      .map((a: { data: string }) => a.data.replace(/^"|"$/g, "").replace(/"\s*"/g, ""))
      .find((d: string) => d.startsWith("v=DMARC1"));

    if (!record) {
      return {
        check: {
          label: "DMARC Policy",
          status: "fail",
          value: "Invalid DMARC record",
          detail: "TXT records exist at _dmarc but none are valid DMARC (must start with v=DMARC1).",
        },
        pts: 0,
      };
    }

    const tags: Record<string, string> = {};
    record.split(";").forEach((part: string) => {
      const [k, ...v] = part.trim().split("=");
      if (k) tags[k.trim().toLowerCase()] = v.join("=").trim();
    });

    const policy = tags.p || "none";
    let status: DnsCheck["status"];
    let pts: number;
    let detail: string;

    if (policy === "reject") {
      status = "pass"; pts = 30;
      detail = "DMARC p=reject — unauthorized emails are blocked outright. Maximum domain protection.";
    } else if (policy === "quarantine") {
      status = "warn"; pts = 20;
      detail = "DMARC p=quarantine — unauthorized emails go to spam. Good, but consider upgrading to p=reject for full enforcement.";
    } else {
      status = "warn"; pts = 8;
      detail = "DMARC p=none — monitoring only, no enforcement. Upgrade to p=quarantine or p=reject to actually protect your domain.";
    }

    if (!tags.rua) {
      detail += " No aggregate report address (rua=) set — add one to receive DMARC reports.";
    }

    return { check: { label: "DMARC Policy", status, value: record, detail }, pts };
  } catch {
    return {
      check: {
        label: "DMARC Policy",
        status: "fail",
        value: "Lookup failed",
        detail: "Could not resolve DMARC record via DNS.",
      },
      pts: 0,
    };
  }
}

// ── Blacklist ─────────────────────────────────────────────────────────────────

const RBLS = [
  { name: "Spamhaus ZEN",   zone: "zen.spamhaus.org",        severity: "critical" },
  { name: "Spamhaus DBL",   zone: "dbl.spamhaus.org",        severity: "critical" },
  { name: "SURBL",          zone: "multi.surbl.org",          severity: "critical" },
  { name: "Barracuda",      zone: "b.barracudacentral.org",   severity: "critical" },
  { name: "SpamCop",        zone: "bl.spamcop.net",           severity: "high" },
  { name: "UCEPROTECT L1",  zone: "dnsbl-1.uceprotect.net",  severity: "high" },
  { name: "Mailspike BL",   zone: "bl.mailspike.net",         severity: "high" },
  { name: "Abusix ABI",     zone: "abuse.dnsbl.abusix.zone",  severity: "high" },
  { name: "NordSpam",       zone: "bl.nordspam.com",          severity: "medium" },
  { name: "Truncate",       zone: "truncate.gbudb.net",       severity: "medium" },
  { name: "UCEPROTECT L2",  zone: "dnsbl-2.uceprotect.net",  severity: "medium" },
  { name: "JustSpam",       zone: "dnsbl.justspam.org",       severity: "low" },
] as const;

async function rblLookup(query: string): Promise<boolean> {
  try { await dns.resolve4(query); return true; } catch { return false; }
}

async function checkBlacklist(domain: string): Promise<{ check: DnsCheck; pts: number }> {
  let ip: string | null = null;
  try { ip = (await dns.resolve4(domain))[0] ?? null; } catch { /* no A record */ }

  const results = await Promise.allSettled(
    RBLS.map(async rbl => {
      let listed = await rblLookup(`${domain}.${rbl.zone}`);
      if (!listed && ip) {
        const rev = ip.split(".").reverse().join(".");
        listed = await rblLookup(`${rev}.${rbl.zone}`);
      }
      return { name: rbl.name, severity: rbl.severity, listed };
    })
  );

  const checks = results
    .filter(r => r.status === "fulfilled")
    .map(r => (r as PromiseFulfilledResult<{ name: string; severity: string; listed: boolean }>).value);

  const hits = checks.filter(c => c.listed);
  const critical = hits.filter(c => c.severity === "critical").length;
  const high = hits.filter(c => c.severity === "high").length;

  let pts: number;
  let status: DnsCheck["status"];
  let value: string;
  let detail: string;

  if (hits.length === 0) {
    pts = 20; status = "pass";
    value = `Clean across ${RBLS.length} blacklists`;
    detail = "Not listed on any major IP or domain blacklist databases. Reputation is clean.";
  } else if (critical > 0) {
    pts = 0; status = "fail";
    value = hits.map(h => h.name).join(", ");
    const critNames = hits.filter(h => h.severity === "critical").map(h => h.name).join(", ");
    detail = `Listed on ${hits.length} blacklist(s) including critical databases (${critNames}). This is a primary driver of spam folder delivery — request delisting immediately.`;
  } else if (high > 0) {
    pts = 4; status = "fail";
    value = hits.map(h => h.name).join(", ");
    detail = `Listed on ${hits.length} high-severity blacklist(s): ${hits.map(h => h.name).join(", ")}. Significant impact on deliverability — request delisting.`;
  } else {
    pts = 12; status = "warn";
    value = hits.map(h => h.name).join(", ");
    detail = `Listed on ${hits.length} low/medium blacklist(s): ${hits.map(h => h.name).join(", ")}. Minor impact — monitor and request delisting when possible.`;
  }

  return { check: { label: "Blacklist Status", status, value, detail }, pts };
}

// ── Exported runner ───────────────────────────────────────────────────────────

export async function runDeliverabilityChecks(domain: string): Promise<{ score: number; checks: DnsCheck[] }> {
  const [spf, dkim, dmarc, bl] = await Promise.all([
    checkSpf(domain),
    checkDkim(domain),
    checkDmarc(domain),
    checkBlacklist(domain),
  ]);

  const score = Math.min(100, spf.pts + dkim.pts + dmarc.pts + bl.pts);

  return {
    score,
    checks: [spf.check, dkim.check, dmarc.check, bl.check],
  };
}

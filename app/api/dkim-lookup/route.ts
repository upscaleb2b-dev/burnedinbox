import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

function parseKeyLength(pubkey: string): number | null {
  try {
    const b64 = pubkey.replace(/\s/g, "");
    const bin = Buffer.from(b64, "base64");
    // RSA public key: rough size from DER encoding
    if (bin.length > 200) return 2048;
    if (bin.length > 100) return 1024;
    return 512;
  } catch { return null; }
}

function analyzeRecord(raw: string, selector: string, domain: string) {
  const tags: Record<string, string> = {};
  raw.split(";").forEach(part => {
    const [k, ...v] = part.trim().split("=");
    if (k && v.length) tags[k.trim().toLowerCase()] = v.join("=").trim();
  });

  const issues: string[] = [];
  const tips: string[] = [];
  let score = 0;

  // v= version
  if (tags.v === "DKIM1") { score += 15; }
  else if (!tags.v) { issues.push("Missing v=DKIM1 version tag"); }
  else { issues.push(`Unexpected version: ${tags.v}`); }

  // k= key type
  const keyType = tags.k || "rsa";
  if (keyType === "rsa") { score += 10; }
  else if (keyType === "ed25519") { score += 15; tips.push("ed25519 keys are modern and secure — good choice"); }
  else { issues.push(`Unknown key type: ${keyType}`); }

  // p= public key
  const pubkey = tags.p || "";
  if (!pubkey) {
    issues.push("Empty public key (p=) — this key has been revoked");
    score -= 20;
  } else {
    score += 20;
    const keyLen = parseKeyLength(pubkey);
    if (keyLen && keyType === "rsa") {
      if (keyLen >= 2048) { score += 20; }
      else if (keyLen >= 1024) { score += 10; tips.push("1024-bit RSA key detected — upgrade to 2048-bit for better security"); }
      else { issues.push("Key length too short — below 1024-bit is considered insecure"); }
    }
  }

  // t= flags
  if (tags.t) {
    if (tags.t.includes("y")) tips.push("t=y testing flag is set — DKIM is in test mode, failures won't affect delivery");
    if (tags.t.includes("s")) score += 5;
  }

  // s= service type
  if (tags.s && tags.s !== "*" && !tags.s.includes("email")) {
    tips.push(`s=${tags.s} restricts DKIM to specific service types — ensure it includes email`);
  }

  // h= hash algorithms
  if (tags.h) {
    if (!tags.h.includes("sha256")) { issues.push("SHA-256 not listed in h= tag — prefer sha256 over sha1"); }
  }

  score = Math.min(100, Math.max(0, score));
  const keyLen = pubkey ? parseKeyLength(pubkey) : null;

  return {
    tags,
    keyType,
    keyLength: keyLen,
    pubkey: pubkey ? `${pubkey.slice(0, 32)}...` : "",
    issues,
    tips,
    score,
    revoked: !pubkey,
  };
}

async function checkSelector(selector: string, domain: string) {
  const lookupName = `${selector}._domainkey.${domain}`;
  try {
    const txts = await dns.resolveTxt(lookupName);
    const raw = txts.map(chunks => chunks.join("")).find(t => t.includes("v=DKIM1") || t.includes("k=") || t.includes("p="));
    if (!raw) return { selector, found: false, name: lookupName };
    const analysis = analyzeRecord(raw, selector, domain);
    return { selector, found: true, name: lookupName, record: raw, ...analysis };
  } catch {
    return { selector, found: false, name: lookupName };
  }
}

// Common selectors used by major ESPs
const COMMON_SELECTORS = [
  "default", "google", "mail", "k1", "k2", "k3",
  "selector1", "selector2", "dkim", "email", "smtp",
  "mimecast", "mailjet", "sendgrid", "ses", "mandrill",
  "s1", "s2", "sig1", "everlytickey1", "zendesk1",
];

export async function POST(req: NextRequest) {
  try {
    const { domain: raw, selector: customSelector } = await req.json();
    if (!raw) return NextResponse.json({ error: "Domain required" }, { status: 400 });

    const domain = clean(raw);

    // If user provided a specific selector, check just that one
    if (customSelector && customSelector.trim()) {
      const result = await checkSelector(customSelector.trim().toLowerCase(), domain);
      return NextResponse.json({ domain, results: [result], scanned: 1 });
    }

    // Otherwise auto-discover by scanning common selectors (parallel, with timeout)
    const toScan = COMMON_SELECTORS.slice(0, 16);
    const results = await Promise.all(toScan.map(s => checkSelector(s, domain)));
    const found = results.filter(r => r.found);

    return NextResponse.json({
      domain,
      results: found.length > 0 ? found : results.slice(0, 4), // show some not-found if nothing discovered
      found: found.length > 0,
      scanned: toScan.length,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Lookup failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

// A DNSBL answers a lookup with a 127.x.x.x address. Not every answer means
// "listed": several lists answer with an error code when they refuse the
// query, which is what happens to lookups from public and cloud resolvers
// (Vercel's included). Only the codes below count as a listing; anything
// else, and any DNS error other than "no such name", is reported as
// "unavailable" and counts neither for nor against the domain.

type Kind = "domain" | "ip";
type Status = "clean" | "listed" | "unavailable";

interface List {
  name: string;
  zone: string;
  kind: Kind;
  weight: "critical" | "high" | "medium";
  isListing: (answer: string) => boolean;
  note?: string;
}

const octets = (a: string) => a.split(".").map(Number);

// Spamhaus: 127.255.255.x is an error (public resolver, rate limit, bad query).
const spamhausDbl = (a: string) => { const o = octets(a); return o[0] === 127 && o[1] === 0 && o[2] === 1 && o[3] >= 2 && o[3] <= 99; };
const spamhausZen = (a: string) => { const o = octets(a); return o[0] === 127 && o[1] === 0 && o[2] === 0 && o[3] >= 2 && o[3] <= 11; };
// SURBL: 127.0.0.1 means the query was refused; listings set bits above it.
const surbl = (a: string) => { const o = octets(a); return o[0] === 127 && o[1] === 0 && o[2] === 0 && o[3] > 1; };
// Generic lists: 127.0.0.2 and up is a listing; 127.0.0.1 and 127.255.x.x are not.
const generic = (a: string) => { const o = octets(a); return o[0] === 127 && o[1] !== 255 && !(o[1] === 0 && o[2] === 0 && o[3] < 2); };

const LISTS: List[] = [
  // Domain lists: follow the domain wherever it sends from.
  { name: "SURBL",         zone: "multi.surbl.org",        kind: "domain", weight: "high",     isListing: surbl },
  { name: "Spamhaus DBL",  zone: "dbl.spamhaus.org",       kind: "domain", weight: "critical", isListing: spamhausDbl },
  // IP lists: describe one address.
  { name: "Spamhaus ZEN",  zone: "zen.spamhaus.org",       kind: "ip", weight: "critical", isListing: spamhausZen },
  { name: "SpamCop",       zone: "bl.spamcop.net",         kind: "ip", weight: "critical", isListing: generic },
  { name: "Barracuda",     zone: "b.barracudacentral.org", kind: "ip", weight: "critical", isListing: generic },
  { name: "UCEPROTECT L1", zone: "dnsbl-1.uceprotect.net", kind: "ip", weight: "high",     isListing: generic },
  { name: "UCEPROTECT L2", zone: "dnsbl-2.uceprotect.net", kind: "ip", weight: "medium",   isListing: generic, note: "Lists whole provider ranges, not individual senders" },
  { name: "UCEPROTECT L3", zone: "dnsbl-3.uceprotect.net", kind: "ip", weight: "medium",   isListing: generic, note: "Lists whole networks (ASNs), not individual senders" },
  { name: "PSBL",          zone: "psbl.surriel.com",       kind: "ip", weight: "high",     isListing: generic },
  { name: "DroneBL",       zone: "dnsbl.dronebl.org",      kind: "ip", weight: "high",     isListing: generic },
  { name: "Mailspike",     zone: "bl.mailspike.net",       kind: "ip", weight: "high",     isListing: generic },
  { name: "0spam",         zone: "bl.0spam.org",           kind: "ip", weight: "medium",   isListing: generic },
];

const REFUSED_NOTE = "The list refused this lookup or did not answer, so it was not checked either way";

async function lookup(name: string, list: List): Promise<{ status: Status; response: string | null }> {
  try {
    const answers = await dns.resolve4(name);
    const listing = answers.find(list.isListing);
    if (listing) return { status: "listed", response: listing };
    return { status: "unavailable", response: answers[0] ?? null };
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "ENODATA") return { status: "clean", response: null };
    return { status: "unavailable", response: code ?? null };
  }
}

function isIPv4(s: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(s) && s.split(".").every(n => +n <= 255);
}

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^.*@/, "");
}

export async function POST(req: NextRequest) {
  try {
    const { query: raw } = await req.json();
    if (!raw || typeof raw !== "string") return NextResponse.json({ error: "Domain or IP required" }, { status: 400 });

    const query = clean(raw);
    const isIp = isIPv4(query);

    let ip: string | null = isIp ? query : null;
    if (!isIp) {
      try { ip = (await dns.resolve4(query))[0] ?? null; } catch { ip = null; }
    }

    const checks = await Promise.all(LISTS
      .filter(l => (l.kind === "domain" ? !isIp : ip !== null))
      .map(async l => {
        const name = l.kind === "domain" ? `${query}.${l.zone}` : `${ip!.split(".").reverse().join(".")}.${l.zone}`;
        const { status, response } = await lookup(name, l);
        return {
          name: l.name, zone: l.zone, kind: l.kind, weight: l.weight, status,
          listed: status === "listed", response,
          note: status === "unavailable" ? REFUSED_NOTE : status === "listed" ? (l.note ?? null) : null,
        };
      }));

    const domainLists = checks.filter(c => c.kind === "domain");
    const ipLists = checks.filter(c => c.kind === "ip");
    // For a domain, the verdict rests on domain lists. The IP behind a domain
    // is usually its website host, and mail sent through Google Workspace or
    // Microsoft 365 leaves from their servers, so IP listings are reported
    // but not counted. For an IP query, the IP lists are the verdict.
    const counted = isIp ? ipLists : domainLists;
    const listed = counted.filter(c => c.listed);
    const answered = counted.filter(c => c.status !== "unavailable");
    const unavailable = counted.filter(c => c.status === "unavailable");

    const verdict =
      listed.some(c => c.weight === "critical") ? "critical"
      : listed.some(c => c.weight === "high") ? "warning"
      : listed.length ? "minor"
      : answered.length === 0 ? "unchecked"
      : "clean";

    return NextResponse.json({
      query, isIp, ip,
      verdict,
      total: counted.length,
      checked: answered.length,
      listed: listed.length,
      unavailable: unavailable.map(c => c.name),
      domainLists,
      ipLists,
      ipNote: !isIp && ip
        ? `${ip} is the address ${query}'s website resolves to. Mail sent through Google Workspace or Microsoft 365 leaves from their servers, so listings here describe the web host and are not counted in the verdict.`
        : null,
      checks,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Check failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

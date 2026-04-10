import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

type RecordType = "A" | "AAAA" | "MX" | "TXT" | "CNAME" | "NS" | "SOA" | "SRV" | "PTR" | "CAA";

function clean(domain: string) {
  return domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
}

export async function POST(req: NextRequest) {
  try {
    const { domain: raw, type } = await req.json();
    if (!raw || !type) return NextResponse.json({ error: "Missing domain or type" }, { status: 400 });

    const domain = clean(raw);
    let records: unknown[] = [];
    let found = false;

    try {
      switch (type as RecordType) {
        case "A": {
          const res = await dns.resolve4(domain, { ttl: true });
          records = res.map((r) => ({ name: domain, value: r.address, ttl: r.ttl }));
          break;
        }
        case "AAAA": {
          const res = await dns.resolve6(domain, { ttl: true });
          records = res.map((r) => ({ name: domain, value: r.address, ttl: r.ttl }));
          break;
        }
        case "MX": {
          const res = await dns.resolveMx(domain);
          records = res.map((r) => ({ name: domain, value: `${r.priority} ${r.exchange}`, ttl: 300, parsed: { priority: r.priority, exchange: r.exchange } }));
          break;
        }
        case "TXT": {
          const res = await dns.resolveTxt(domain);
          records = res.map((chunks) => ({ name: domain, value: chunks.join(""), ttl: 300 }));
          break;
        }
        case "CNAME": {
          const res = await dns.resolveCname(domain);
          records = res.map((r) => ({ name: domain, value: r, ttl: 300 }));
          break;
        }
        case "NS": {
          const res = await dns.resolveNs(domain);
          records = res.map((r) => ({ name: domain, value: r, ttl: 300 }));
          break;
        }
        case "SOA": {
          const r = await dns.resolveSoa(domain);
          records = [{
            name: domain, value: `${r.nsname} ${r.hostmaster}`, ttl: r.minttl,
            parsed: { nsname: r.nsname, hostmaster: r.hostmaster, serial: r.serial, refresh: r.refresh, retry: r.retry, expire: r.expire, minttl: r.minttl }
          }];
          break;
        }
        case "SRV": {
          const res = await dns.resolveSrv(domain);
          records = res.map((r) => ({ name: domain, value: `${r.priority} ${r.weight} ${r.port} ${r.name}`, ttl: 300, parsed: { priority: r.priority, weight: r.weight, port: r.port, target: r.name } }));
          break;
        }
        case "PTR": {
          const res = await dns.resolvePtr(domain);
          records = res.map((r) => ({ name: domain, value: r, ttl: 300 }));
          break;
        }
        case "CAA": {
          const res = await dns.resolveCaa(domain);
          records = res.map((r) => ({ name: domain, value: `${r.critical} ${r.issue ?? r.issuewild ?? ""}`, ttl: 300, parsed: { flags: r.critical, tag: r.issue ? "issue" : "issuewild", value: r.issue ?? r.issuewild ?? "" } }));
          break;
        }
      }
      found = records.length > 0;
    } catch {
      found = false;
      records = [];
    }

    return NextResponse.json({ domain, type, found, records, status: found ? "NOERROR" : "NXDOMAIN", message: found ? undefined : `No ${type} records found for ${domain}` });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

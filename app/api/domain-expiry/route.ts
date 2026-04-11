import { NextRequest, NextResponse } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new NextResponse("", { status: 200, headers: CORS });
}

function getUrgency(daysRemaining: number | null): string {
  if (daysRemaining === null) return "unknown";
  if (daysRemaining < 0)  return "expired";
  if (daysRemaining < 15) return "critical";
  if (daysRemaining < 30) return "critical";
  if (daysRemaining < 60) return "warning";
  if (daysRemaining < 90) return "notice";
  return "safe";
}

export async function POST(req: NextRequest) {
  try {
    const { domain: raw } = await req.json();
    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "Missing domain field" }, { status: 400, headers: CORS });
    }

    const domain = raw.trim().toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");

    const apiKey = process.env.WHOIS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "WHOIS API key not configured" }, { status: 500, headers: CORS });
    }

    // WhoisXML API
    const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.ErrorMessage || !data.WhoisRecord) {
      return NextResponse.json({ error: data.ErrorMessage?.msg || "WHOIS lookup failed" }, { status: 502, headers: CORS });
    }

    const record = data.WhoisRecord;
    const registryData = record.registryData || record;

    // Extract expiry date - try multiple fields
    const expiryRaw =
      registryData.expiresDate ||
      record.expiresDate ||
      registryData.expiresDateNormalized ||
      record.expiresDateNormalized ||
      null;

    const createdRaw =
      registryData.createdDate ||
      record.createdDate ||
      registryData.createdDateNormalized ||
      record.createdDateNormalized ||
      null;

    const updatedRaw =
      registryData.updatedDate ||
      record.updatedDate ||
      registryData.updatedDateNormalized ||
      record.updatedDateNormalized ||
      null;

    let daysRemaining: number | null = null;
    let expiryIso: string | null = null;

    if (expiryRaw) {
      try {
        const expDate = new Date(expiryRaw);
        expiryIso = expDate.toISOString();
        daysRemaining = Math.floor((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      } catch { /* invalid date */ }
    }

    const urgency = getUrgency(daysRemaining);

    // Nameservers
    const nameservers: string[] = [];
    const nsRaw = registryData.nameServers || record.nameServers;
    if (nsRaw) {
      if (Array.isArray(nsRaw.hostNames)) nameservers.push(...nsRaw.hostNames);
      else if (Array.isArray(nsRaw)) nameservers.push(...nsRaw.map((n: { name?: string } | string) => typeof n === "string" ? n : n.name || ""));
      else if (typeof nsRaw.hostName === "string") nameservers.push(nsRaw.hostName);
    }

    // Status
    const statusRaw = registryData.status || record.status || "";
    const status: string[] = Array.isArray(statusRaw)
      ? statusRaw
      : typeof statusRaw === "string"
        ? statusRaw.split(/[\n,]/).map((s: string) => s.trim()).filter(Boolean)
        : [];

    return NextResponse.json({
      domain,
      registrar: registryData.registrarName || record.registrarName || null,
      created: createdRaw ? new Date(createdRaw).toISOString() : null,
      updated: updatedRaw ? new Date(updatedRaw).toISOString() : null,
      expiry: {
        date: expiryIso,
        daysRemaining,
        urgency,
      },
      nameservers: nameservers.filter(Boolean).slice(0, 6),
      status: status.slice(0, 6),
    }, { headers: CORS });

  } catch (e: unknown) {
    return NextResponse.json(
      { error: `Lookup failed: ${e instanceof Error ? e.message : "unknown error"}` },
      { status: 500, headers: CORS }
    );
  }
}

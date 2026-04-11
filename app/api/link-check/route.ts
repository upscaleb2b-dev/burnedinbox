import { NextRequest, NextResponse } from "next/server";

function extractLinks(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>)\]]+/gi;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches)].slice(0, 30);
}

async function checkLink(url: string) {
  try {
    const res = await fetch(url, {
      method: "HEAD", redirect: "manual",
      signal: AbortSignal.timeout(7000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BurnedInbox/1.0)" },
    });

    const finalLocation = res.headers.get("location");
    const isRedirect = res.status >= 300 && res.status < 400;
    const isBroken   = res.status >= 400;
    const isHttp     = url.startsWith("http://");

    const issues: string[] = [];
    if (isHttp)    issues.push("Not HTTPS — http:// links may trigger security warnings");
    if (isBroken)  issues.push(`Returns ${res.status} — link is broken`);
    if (isRedirect && finalLocation) {
      if (!finalLocation.startsWith("https")) issues.push("Redirects to a non-HTTPS destination");
      // Check for URL shorteners
      const shorteners = ["bit.ly", "tinyurl", "t.co", "ow.ly", "rebrand.ly", "short.io", "goo.gl"];
      if (shorteners.some(s => url.includes(s) || (finalLocation && finalLocation.includes(s)))) {
        issues.push("URL shortener detected — shorteners often trigger spam filters");
      }
    }

    // Check for excessive params
    try {
      const u = new URL(url);
      if (u.searchParams.size > 6) issues.push(`${u.searchParams.size} URL parameters — excessive tracking params can look suspicious`);
    } catch { /* invalid url */ }

    // Mismatched anchor domain check would require HTML parsing — skip for API
    return {
      url, status: res.status,
      isRedirect, isBroken, isHttp,
      finalLocation: isRedirect ? finalLocation : null,
      issues,
      ok: issues.length === 0 && !isBroken,
    };
  } catch (e: unknown) {
    return {
      url, status: null,
      isRedirect: false, isBroken: true, isHttp: url.startsWith("http://"),
      finalLocation: null,
      issues: [`Connection failed: ${e instanceof Error ? e.message : "timeout"}`],
      ok: false,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: "Email content required" }, { status: 400 });

    const links = extractLinks(content);
    if (links.length === 0) return NextResponse.json({ links: [], message: "No URLs found in the provided content" });

    const results = await Promise.all(links.map(checkLink));
    const issues  = results.filter(r => !r.ok);
    const clean   = results.filter(r => r.ok);

    return NextResponse.json({ links: results, total: results.length, issues: issues.length, clean: clean.length });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Check failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

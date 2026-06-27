import { NextRequest, NextResponse } from "next/server";

function clean(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

interface HopResult {
  url: string;
  status: number | null;
  location: string | null;
  ssl: boolean;
  error?: string;
}

async function followRedirects(startUrl: string, maxHops = 10): Promise<HopResult[]> {
  const hops: HopResult[] = [];
  let url = startUrl;

  for (let i = 0; i < maxHops; i++) {
    try {
      let res = await fetch(url, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(6000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; BurnedInbox/1.0)" },
      });
      if (res.status === 405 || res.status === 501) {
        res = await fetch(url, {
          method: "GET",
          redirect: "manual",
          signal: AbortSignal.timeout(6000),
          headers: { "User-Agent": "Mozilla/5.0 (compatible; BurnedInbox/1.0)", "Range": "bytes=0-0" },
        });
      }

      const location = res.headers.get("location");
      const status = res.status;
      const ssl = url.startsWith("https://");

      hops.push({ url, status, location, ssl });

      if (status >= 300 && status < 400 && location) {
        url = location.startsWith("http") ? location : new URL(location, url).href;
      } else {
        break;
      }
    } catch (e: unknown) {
      hops.push({ url, status: null, location: null, ssl: url.startsWith("https://"), error: e instanceof Error ? e.message : "fetch failed" });
      break;
    }
  }
  return hops;
}

export async function POST(req: NextRequest) {
  try {
    const { domain: raw } = await req.json();
    if (!raw) return NextResponse.json({ error: "Domain required" }, { status: 400 });

    const domain = clean(raw);

    // Check four variants in parallel
    const [rootHttp, rootHttps, wwwHttp, wwwHttps] = await Promise.all([
      followRedirects(`http://${domain}`),
      followRedirects(`https://${domain}`),
      followRedirects(`http://www.${domain}`),
      followRedirects(`https://www.${domain}`),
    ]);

    const analyze = (hops: HopResult[], label: string) => {
      const issues: string[] = [];
      const tips: string[] = [];
      const final = hops[hops.length - 1];
      const finalUrl = final?.url || "";
      const finalStatus = final?.status;
      const hasSsl = hops.some(h => h.ssl);
      const chainLength = hops.length;
      const hasError = hops.some(h => h.error);

      // Check for redirect chains (>2 hops is a problem)
      if (chainLength > 2) {
        issues.push(`Redirect chain is ${chainLength} hops — chains longer than 2 hurt performance and can confuse some ESPs`);
      }

      // Check for HTTP → HTTPS upgrade
      if (label.startsWith("http://") && hops.length > 1) {
        const upgradesTo = hops.find(h => h.url.startsWith("https://"));
        if (!upgradesTo) {
          issues.push("No HTTPS upgrade — stays on HTTP");
        }
      }

      // Check final destination SSL
      if (!finalUrl.startsWith("https://") && finalStatus !== null) {
        tips.push("Final destination is not HTTPS — links in emails to HTTP pages may trigger warnings");
      }

      // Broken / error
      if (hasError) {
        issues.push("Connection failed or timed out — this variant may be broken");
      }

      // Check if final lands somewhere suspicious (placeholder pages)
      if (finalUrl.includes("parked") || finalUrl.includes("sedo.com") || finalUrl.includes("godaddy.com/domain")) {
        issues.push("Final destination appears to be a parked domain page — redirect may be broken");
      }

      // 404 / 5xx at final
      if (finalStatus && finalStatus >= 400) {
        issues.push(`Final destination returns ${finalStatus} — the redirect target is broken`);
      }

      return { hops, issues, tips, finalUrl, finalStatus, ssl: hasSsl };
    };

    const results = {
      domain,
      root:    { http: analyze(rootHttp,  `http://${domain}`),  https: analyze(rootHttps, `https://${domain}`) },
      www:     { http: analyze(wwwHttp,   `http://www.${domain}`), https: analyze(wwwHttps, `https://www.${domain}`) },
    };

    // Overall issues + tips
    const allIssues: string[] = [];
    const allTips: string[] = [];

    // Does root http redirect to https?
    const rootUpgradesHttps = rootHttp.some(h => h.url.startsWith("https://"));
    if (!rootUpgradesHttps && !rootHttp[0]?.error) allIssues.push("http://domain.com does not redirect to HTTPS");

    // Does www redirect to root (or vice versa)?
    const rootFinal = rootHttps[rootHttps.length - 1]?.url || "";
    const wwwFinal = wwwHttps[wwwHttps.length - 1]?.url || "";
    if (rootFinal && wwwFinal && !rootFinal.includes(wwwFinal.replace("www.", "")) && !wwwFinal.includes(rootFinal)) {
      allTips.push("www and non-www may resolve to different final destinations — canonicalize to one");
    }

    // No redirect at all from root
    if (rootHttps.length === 1 && rootHttps[0]?.status === 200) {
      allTips.push("Root domain resolves directly without redirecting — confirm this is intentional");
    }

    // SSL issue
    const finalSsl = rootHttps[rootHttps.length - 1]?.ssl;
    if (!finalSsl && !rootHttps[0]?.error) allIssues.push("Final destination is not served over HTTPS");

    let score = 100;
    score -= allIssues.length * 20;
    score -= results.root.http.issues.length * 10;
    score -= results.root.https.issues.length * 10;
    score -= results.www.http.issues.length * 10;
    score = Math.max(0, Math.min(100, score));

    return NextResponse.json({ domain, results, issues: allIssues, tips: allTips, score });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Check failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ALERT_EMAIL = process.env.SCANNER_ALERT_EMAIL || '';
const ALERT_FROM = process.env.SCANNER_ALERT_FROM || 'scanner@burnedinbox.com';
const BATCH_SIZE = parseInt(process.env.SCANNER_BATCH_SIZE || '50');
const CRON_SECRET = process.env.CRON_SECRET || '';
const MIN_SCORE_FOR_ALERT = 40;

const GOOGLE_MX_PATTERNS = [
  'aspmx.l.google.com',
  'googlemail.com',
  'alt1.aspmx.l.google.com',
  'alt2.aspmx.l.google.com',
  'alt3.aspmx.l.google.com',
  'alt4.aspmx.l.google.com',
];

const LEGACY_CNAME_TARGETS = [
  'ghs.google.com',
  'ghs.googlehosted.com',
  'googlehosted.com',
];

const LEGACY_SUBDOMAINS = ['mail', 'calendar', 'docs', 'drive', 'sites', 'start'];

async function queryDNS(name: string, type: string): Promise<{ data: string }[]> {
  try {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];
    const json = await res.json() as { Answer?: { data: string }[] };
    return json.Answer || [];
  } catch {
    return [];
  }
}

async function hasGoogleMX(domain: string): Promise<boolean> {
  const answers = await queryDNS(domain, 'MX');
  return answers.some(a =>
    GOOGLE_MX_PATTERNS.some(p => a.data?.toLowerCase().includes(p))
  );
}

async function hasLegacyCNAME(domain: string): Promise<boolean> {
  const checks = await Promise.all(
    LEGACY_SUBDOMAINS.map(sub => queryDNS(`${sub}.${domain}`, 'CNAME'))
  );
  return checks.some(answers =>
    answers.some(a =>
      LEGACY_CNAME_TARGETS.some(p => a.data?.toLowerCase().includes(p))
    )
  );
}

// TXT record check: legacy Google Apps left behind google-site-verification or other TXT hints
async function hasGoogleTXT(domain: string): Promise<boolean> {
  const answers = await queryDNS(domain, 'TXT');
  return answers.some(a => {
    const d = a.data?.toLowerCase() || '';
    return d.includes('google-site-verification') || d.includes('v=spf1') && d.includes('include:_spf.google.com');
  });
}

export interface ScanResult {
  domain: string;
  googleMX: boolean;
  legacyCNAME: boolean;
  googleTXT: boolean;
  score: number;
  timestamp: string;
}

async function scanDomain(domain: string): Promise<ScanResult> {
  const [googleMX, legacyCNAME, googleTXT] = await Promise.all([
    hasGoogleMX(domain),
    hasLegacyCNAME(domain),
    hasGoogleTXT(domain),
  ]);

  let score = 0;
  if (googleMX) score += 50;
  if (legacyCNAME) score += 35;
  if (googleTXT) score += 15;

  return { domain, googleMX, legacyCNAME, googleTXT, score, timestamp: new Date().toISOString() };
}

async function sendEmailAlert(hits: ScanResult[]) {
  if (!RESEND_API_KEY || !ALERT_EMAIL || hits.length === 0) return;
  const resend = new Resend(RESEND_API_KEY);

  const rows = hits
    .slice(0, 50)
    .map(h =>
      `<tr style="border-bottom:1px solid #333">
        <td style="padding:8px;font-family:monospace;color:#60a5fa">${h.domain}</td>
        <td style="padding:8px;text-align:center;font-weight:bold;color:${h.score >= 80 ? '#4ade80' : '#facc15'}">${h.score}/100</td>
        <td style="padding:8px;text-align:center">${h.googleMX ? '✅' : '❌'}</td>
        <td style="padding:8px;text-align:center">${h.legacyCNAME ? '✅' : '❌'}</td>
        <td style="padding:8px;text-align:center">${h.googleTXT ? '✅' : '❌'}</td>
      </tr>`
    )
    .join('');

  await resend.emails.send({
    from: ALERT_FROM,
    to: ALERT_EMAIL,
    subject: `🎯 Legacy Google Scanner: ${hits.length} hit${hits.length > 1 ? 's' : ''} found`,
    html: `
      <div style="background:#0f172a;color:#e2e8f0;padding:24px;font-family:sans-serif;max-width:700px;margin:0 auto;border-radius:8px">
        <h1 style="color:#fff;margin-top:0">🔍 Legacy Google Apps Scanner</h1>
        <p style="color:#94a3b8">Found <strong style="color:#4ade80">${hits.length}</strong> potential legacy domain${hits.length > 1 ? 's' : ''} with Google panel signals.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <thead>
            <tr style="background:#1e293b;color:#94a3b8;font-size:12px">
              <th style="padding:8px;text-align:left">Domain</th>
              <th style="padding:8px">Score</th>
              <th style="padding:8px">MX</th>
              <th style="padding:8px">CNAME</th>
              <th style="padding:8px">TXT</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="color:#64748b;font-size:12px;margin-top:24px">
          Score ≥ 80 = strong signal (Google MX + CNAME). Score ≥ 50 = Google MX present.<br>
          These domains may have legacy free Google Apps (pre-2012) still active.
        </p>
      </div>
    `,
  });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const domainList: string[] = (await kv.get('scanner:domains')) || [];
    let currentIndex: number = (await kv.get('scanner:index')) || 0;

    if (domainList.length === 0) {
      return NextResponse.json({ message: 'No domains loaded. POST to /api/scanner/domains to add domains.' });
    }

    if (currentIndex >= domainList.length) currentIndex = 0;
    const batch = domainList.slice(currentIndex, currentIndex + BATCH_SIZE);

    const results = await Promise.all(batch.map(scanDomain));
    const hits = results.filter(r => r.score >= MIN_SCORE_FOR_ALERT);

    if (hits.length > 0) {
      const existing: ScanResult[] = (await kv.get('scanner:hits')) || [];
      const existingDomains = new Set(existing.map(h => h.domain));
      const newHits = hits.filter(h => !existingDomains.has(h.domain));
      if (newHits.length > 0) {
        const updated = [...newHits, ...existing].slice(0, 1000);
        await kv.set('scanner:hits', updated);
        await sendEmailAlert(newHits);
      }
    }

    const nextIndex = currentIndex + BATCH_SIZE >= domainList.length ? 0 : currentIndex + BATCH_SIZE;
    await kv.set('scanner:index', nextIndex);
    await kv.set('scanner:last_scan', {
      timestamp: new Date().toISOString(),
      scanned: batch.length,
      hitsFound: hits.length,
      batchStart: currentIndex,
      totalDomains: domainList.length,
    });

    return NextResponse.json({
      success: true,
      scanned: batch.length,
      hits: hits.length,
      nextIndex,
      totalDomains: domainList.length,
      cycleComplete: nextIndex === 0,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Scanner error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

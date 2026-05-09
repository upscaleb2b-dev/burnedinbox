import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const CRON_SECRET = process.env.CRON_SECRET || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ALERT_EMAIL = process.env.ALERT_EMAIL || '';
const ALERT_FROM = process.env.ALERT_FROM || 'scanner@yourdomain.com';
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '60');

// ── DNS-over-HTTPS ────────────────────────────────────────────────────────────

async function dns(name: string, type: string): Promise<{ data: string }[]> {
  try {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const json = await res.json() as { Answer?: { data: string }[] };
    return json.Answer || [];
  } catch {
    return [];
  }
}

// ── Signal checks ─────────────────────────────────────────────────────────────

const GOOGLE_MX = ['aspmx.l.google.com', 'googlemail.com', 'alt1.aspmx', 'alt2.aspmx', 'alt3.aspmx', 'alt4.aspmx'];
const GHS_LEGACY = 'ghs.google.com';          // pre-2012 CNAME target
const GHS_NEWER  = 'ghs.googlehosted.com';    // post-2012 / Workspace CNAME target

// Subdomains that existed in early Google Apps
const ALL_SUBS   = ['start', 'mail', 'calendar', 'docs', 'drive', 'sites'];
const START_SUB  = 'start'; // strongest legacy signal — discontinued ~2009

interface CNAMEResult {
  sub: string;
  target: string;
}

async function checkMX(domain: string): Promise<'legacy' | 'google' | 'none'> {
  const answers = await dns(domain, 'MX');
  const data = answers.map(a => a.data?.toLowerCase() || '').join('\n');
  if (GOOGLE_MX.some(p => data.includes(p))) {
    // aspmx.l.google.com = legacy free tier pattern
    return data.includes('aspmx.l.google.com') ? 'legacy' : 'google';
  }
  return 'none';
}

async function checkCNAMEs(domain: string): Promise<CNAMEResult[]> {
  const results = await Promise.all(
    ALL_SUBS.map(async sub => {
      const answers = await dns(`${sub}.${domain}`, 'CNAME');
      const target = answers[0]?.data?.toLowerCase().replace(/\.$/, '') || '';
      return target ? { sub, target } : null;
    })
  );
  return results.filter((r): r is CNAMEResult => r !== null);
}

async function checkTXT(domain: string): Promise<boolean> {
  const answers = await dns(domain, 'TXT');
  return answers.some(a => {
    const d = a.data?.toLowerCase() || '';
    return d.includes('_spf.google.com') || d.includes('google-site-verification');
  });
}

// ── Scoring ───────────────────────────────────────────────────────────────────

export interface ScanResult {
  domain: string;
  tier: 1 | 2 | 3;
  score: number;
  signals: {
    mxType: 'legacy' | 'google' | 'none';
    startCNAME: boolean;         // strongest: ghs.google.com on start.domain
    legacyCNAMEs: string[];      // subs pointing to ghs.google.com
    newerCNAMEs: string[];       // subs pointing to ghs.googlehosted.com
    googleTXT: boolean;
  };
  timestamp: string;
}

function score(signals: ScanResult['signals']): { score: number; tier: 1 | 2 | 3 } {
  let s = 0;

  // MX
  if (signals.mxType === 'legacy') s += 40;  // aspmx.l.google.com = classic free tier
  else if (signals.mxType === 'google') s += 25;

  // start.domain CNAME to ghs.google.com = pre-2010 setup, almost certainly legacy free
  if (signals.startCNAME) s += 45;

  // Other legacy CNAMEs
  s += signals.legacyCNAMEs.length * 20;

  // Newer ghs.googlehosted.com CNAMEs (could be paid Workspace)
  s += signals.newerCNAMEs.length * 8;

  // TXT
  if (signals.googleTXT) s += 10;

  s = Math.min(100, s);

  const tier: 1 | 2 | 3 =
    s >= 80 ? 1 :
    s >= 50 ? 2 : 3;

  return { score: s, tier };
}

async function scanDomain(domain: string): Promise<ScanResult> {
  const [mxType, cnames, googleTXT] = await Promise.all([
    checkMX(domain),
    checkCNAMEs(domain),
    checkTXT(domain),
  ]);

  const startCNAME = cnames.some(c => c.sub === START_SUB && c.target.includes(GHS_LEGACY));
  const legacyCNAMEs = cnames
    .filter(c => c.sub !== START_SUB && c.target.includes(GHS_LEGACY))
    .map(c => c.sub);
  const newerCNAMEs = cnames
    .filter(c => c.target.includes(GHS_NEWER))
    .map(c => c.sub);

  const signals = { mxType, startCNAME, legacyCNAMEs, newerCNAMEs, googleTXT };
  const { score: s, tier } = score(signals);

  return { domain, tier, score: s, signals, timestamp: new Date().toISOString() };
}

// ── Email alert ───────────────────────────────────────────────────────────────

async function sendAlert(hits: ScanResult[]) {
  if (!RESEND_API_KEY || !ALERT_EMAIL || hits.length === 0) return;
  const resend = new Resend(RESEND_API_KEY);

  const tierLabel = (t: number) => t === 1 ? '🏆 Tier 1' : t === 2 ? '⭐ Tier 2' : 'Tier 3';

  const rows = hits.slice(0, 50).map(h => `
    <tr style="border-bottom:1px solid #1e293b">
      <td style="padding:8px 12px;font-family:monospace">
        <a href="https://${h.domain}" style="color:#60a5fa;text-decoration:none">${h.domain}</a>
      </td>
      <td style="padding:8px 12px;text-align:center;font-weight:bold;color:${h.score >= 80 ? '#4ade80' : h.score >= 50 ? '#facc15' : '#94a3b8'}">${h.score}</td>
      <td style="padding:8px 12px;text-align:center">${tierLabel(h.tier)}</td>
      <td style="padding:8px 12px;text-align:center">${h.signals.mxType === 'legacy' ? '✅ Legacy' : h.signals.mxType === 'google' ? '☑️ Google' : '❌'}</td>
      <td style="padding:8px 12px;text-align:center">${h.signals.startCNAME ? '✅' : '❌'}</td>
      <td style="padding:8px 12px;text-align:center">${h.signals.legacyCNAMEs.length > 0 ? `✅ ${h.signals.legacyCNAMEs.join(',')}` : '❌'}</td>
    </tr>`).join('');

  const tier1 = hits.filter(h => h.tier === 1).length;
  const tier2 = hits.filter(h => h.tier === 2).length;

  await resend.emails.send({
    from: ALERT_FROM,
    to: ALERT_EMAIL,
    subject: `🎯 Legacy Scanner: ${hits.length} new hit${hits.length > 1 ? 's' : ''} (${tier1} Tier 1, ${tier2} Tier 2)`,
    html: `
      <div style="background:#0f172a;color:#e2e8f0;padding:24px;font-family:sans-serif;max-width:750px;margin:0 auto;border-radius:8px">
        <h2 style="color:#fff;margin:0 0 8px">🔍 Legacy Google Apps Scanner</h2>
        <p style="color:#94a3b8;margin:0 0 20px">
          Found <strong style="color:#4ade80">${hits.length}</strong> new hit${hits.length > 1 ? 's' : ''} —
          ${tier1} Tier 1 (score ≥ 80) · ${tier2} Tier 2 (score 50–79)
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#1e293b;color:#64748b;text-align:left">
              <th style="padding:8px 12px">Domain</th>
              <th style="padding:8px 12px;text-align:center">Score</th>
              <th style="padding:8px 12px;text-align:center">Tier</th>
              <th style="padding:8px 12px;text-align:center">MX</th>
              <th style="padding:8px 12px;text-align:center">start.*</th>
              <th style="padding:8px 12px;text-align:center">CNAMEs</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:20px;padding:12px;background:#1e293b;border-radius:6px;font-size:12px;color:#64748b">
          <strong style="color:#94a3b8">Tier 1 (≥80):</strong> Legacy MX + start.domain CNAME — near-certain legacy free panel<br>
          <strong style="color:#94a3b8">Tier 2 (50–79):</strong> Google MX confirmed — high probability legacy<br>
          <strong style="color:#94a3b8">start.* CNAME:</strong> Strongest single signal — pre-2010 Google Apps dashboard, discontinued long ago
        </div>
      </div>`,
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const queue: string[] = (await kv.get('scan:queue')) || [];
    const scanned: string[] = (await kv.get('scan:scanned')) || [];

    if (queue.length === 0) {
      return NextResponse.json({ message: 'Queue empty — waiting for sourcing cron to populate.' });
    }

    const batch = queue.slice(0, BATCH_SIZE);
    const remaining = queue.slice(BATCH_SIZE);

    const results = await Promise.all(batch.map(scanDomain));
    const hits = results.filter(r => r.score >= 40);

    // Store hits (deduplicate by domain)
    if (hits.length > 0) {
      const existing: ScanResult[] = (await kv.get('scan:hits')) || [];
      const existingDomains = new Set(existing.map(h => h.domain));
      const newHits = hits.filter(h => !existingDomains.has(h.domain));
      if (newHits.length > 0) {
        await kv.set('scan:hits', [...newHits, ...existing].slice(0, 2000));
        await sendAlert(newHits);
      }
    }

    // Mark batch as scanned, update queue
    const updatedScanned = [...scanned, ...batch].slice(-10000); // keep last 10k for dedup
    await Promise.all([
      kv.set('scan:queue', remaining),
      kv.set('scan:scanned', updatedScanned),
      kv.set('scan:last_run', {
        timestamp: new Date().toISOString(),
        scanned: batch.length,
        hits: hits.length,
        queueRemaining: remaining.length,
        totalScanned: updatedScanned.length,
      }),
    ]);

    return NextResponse.json({
      success: true,
      scanned: batch.length,
      hits: hits.length,
      queueRemaining: remaining.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown';
    console.error('Scan cron error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

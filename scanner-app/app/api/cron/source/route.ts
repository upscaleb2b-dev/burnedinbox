import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const CRON_SECRET = process.env.CRON_SECRET || '';

// Each CDX query targets a different Google Apps URL pattern from the pre-2012 era.
// We rotate through them across cron runs so we spread the Archive.org load.
const CDX_QUERIES = [
  // Google Sites /a/domain.com — directly proves Google Apps was set up
  'sites.google.com/a/*',
  // Old-style mail login
  'mail.google.com/a/*',
  // Legacy admin panel
  'www.google.com/a/*/Dashboard',
  // Google Docs for Apps
  'docs.google.com/a/*',
];

function extractDomain(url: string): string | null {
  try {
    // Handles patterns like:
    //   https://sites.google.com/a/somedomain.com/page
    //   https://mail.google.com/a/somedomain.com/
    const match = url.match(/\/a\/([a-zA-Z0-9][a-zA-Z0-9\-\.]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,})\/?/);
    if (!match) return null;
    const domain = match[1].toLowerCase();
    // Filter obviously bad results
    if (domain.includes('google.com')) return null;
    if (domain.includes('gmail.com')) return null;
    if (domain.split('.').length < 2) return null;
    return domain;
  } catch {
    return null;
  }
}

async function fetchCDX(urlPattern: string, offset: number): Promise<string[]> {
  // CDX API: returns JSON rows [fieldname, fieldname, ...] then [value, value, ...]
  // We only request 'original' (the URL), collapse by urlkey (unique domains),
  // and restrict to pre-2013 snapshots where Google Apps was active.
  const params = new URLSearchParams({
    url: urlPattern,
    output: 'json',
    fl: 'original',
    collapse: 'urlkey',
    limit: '2000',
    from: '20060101',
    to: '20130101',
    offset: String(offset),
  });
  const res = await fetch(`https://web.archive.org/cdx/search/cdx?${params}`, {
    signal: AbortSignal.timeout(25000),
    headers: { 'User-Agent': 'legacy-google-scanner/1.0' },
  });
  if (!res.ok) return [];
  const rows = await res.json() as string[][];
  // First row is the header ["original"], skip it
  return rows.slice(1).map(r => r[0]).filter(Boolean);
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Rotate through CDX query patterns across runs
    const runCount: number = (await kv.get('source:run_count')) || 0;
    const queryIndex = runCount % CDX_QUERIES.length;
    const urlPattern = CDX_QUERIES[queryIndex];

    // Each pattern has multiple pages; track offset per pattern
    const offsetKey = `source:offset:${queryIndex}`;
    const offset: number = (await kv.get(offsetKey)) || 0;

    const urls = await fetchCDX(urlPattern, offset);

    // Extract domains, deduplicate
    const found = [...new Set(urls.map(extractDomain).filter((d): d is string => d !== null))];

    // Merge into the scan queue (domains not yet scanned)
    const existing: string[] = (await kv.get('scan:queue')) || [];
    const scanned: string[] = (await kv.get('scan:scanned')) || [];
    const scannedSet = new Set(scanned);
    const existingSet = new Set(existing);

    const newDomains = found.filter(d => !existingSet.has(d) && !scannedSet.has(d));
    const updatedQueue = [...existing, ...newDomains];

    // Advance offset; reset if we got fewer results than requested (end of data)
    const newOffset = urls.length < 2000 ? 0 : offset + 2000;

    await Promise.all([
      kv.set('scan:queue', updatedQueue),
      kv.set(offsetKey, newOffset),
      kv.set('source:run_count', runCount + 1),
      kv.set('source:last_run', {
        timestamp: new Date().toISOString(),
        pattern: urlPattern,
        urlsFetched: urls.length,
        domainsFound: found.length,
        newAdded: newDomains.length,
        queueSize: updatedQueue.length,
        offset,
      }),
    ]);

    return NextResponse.json({
      success: true,
      pattern: urlPattern,
      urlsFetched: urls.length,
      domainsFound: found.length,
      newAdded: newDomains.length,
      queueSize: updatedQueue.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown';
    console.error('Source cron error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

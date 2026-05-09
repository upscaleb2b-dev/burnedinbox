import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  const [hits, lastScan, domains, index] = await Promise.all([
    kv.get('scanner:hits'),
    kv.get('scanner:last_scan'),
    kv.get<string[]>('scanner:domains'),
    kv.get<number>('scanner:index'),
  ]);

  const totalDomains = (domains || []).length;
  const scanIndex = index || 0;

  return NextResponse.json({
    hits: hits || [],
    lastScan: lastScan || null,
    totalDomains,
    scanIndex,
    progress: totalDomains > 0 ? Math.round((scanIndex / totalDomains) * 100) : 0,
  });
}

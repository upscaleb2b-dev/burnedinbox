import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  const [hits, lastScan, lastSource, queue, scanned] = await Promise.all([
    kv.get('scan:hits'),
    kv.get('scan:last_run'),
    kv.get('source:last_run'),
    kv.get<string[]>('scan:queue'),
    kv.get<string[]>('scan:scanned'),
  ]);

  return NextResponse.json({
    hits: hits || [],
    lastScan: lastScan || null,
    lastSource: lastSource || null,
    queueSize: (queue || []).length,
    totalScanned: (scanned || []).length,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const API_KEY = process.env.SCANNER_API_KEY || '';

function auth(request: NextRequest): boolean {
  if (!API_KEY) return false;
  const key =
    request.headers.get('x-api-key') ||
    new URL(request.url).searchParams.get('key');
  return key === API_KEY;
}

function cleanDomain(d: string): string {
  return d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const domains: string[] = (await kv.get('scanner:domains')) || [];
  const index: number = (await kv.get('scanner:index')) || 0;
  return NextResponse.json({ count: domains.length, scanIndex: index, domains });
}

// POST body: { "domains": ["example.com", ...] }
export async function POST(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as { domains?: unknown };
  if (!Array.isArray(body.domains)) {
    return NextResponse.json({ error: 'Body must be { "domains": [...] }' }, { status: 400 });
  }

  const incoming = (body.domains as string[])
    .map(cleanDomain)
    .filter(d => d.length > 3 && d.includes('.'));

  const existing: string[] = (await kv.get('scanner:domains')) || [];
  const merged = [...new Set([...existing, ...incoming])];
  await kv.set('scanner:domains', merged);

  return NextResponse.json({ added: merged.length - existing.length, total: merged.length });
}

// DELETE: clear everything
export async function DELETE(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await Promise.all([
    kv.set('scanner:domains', []),
    kv.set('scanner:index', 0),
    kv.set('scanner:hits', []),
  ]);
  return NextResponse.json({ message: 'All scanner data cleared.' });
}

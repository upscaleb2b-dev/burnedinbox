'use client';

import { useEffect, useState, useCallback } from 'react';

interface ScanResult {
  domain: string;
  googleMX: boolean;
  legacyCNAME: boolean;
  googleTXT: boolean;
  score: number;
  timestamp: string;
}

interface LastScan {
  timestamp: string;
  scanned: number;
  hitsFound: number;
  batchStart: number;
  totalDomains: number;
}

interface ResultsPayload {
  hits: ScanResult[];
  lastScan: LastScan | null;
  totalDomains: number;
  scanIndex: number;
  progress: number;
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 80
      ? 'bg-green-900/60 text-green-300 border border-green-700'
      : score >= 50
      ? 'bg-yellow-900/60 text-yellow-300 border border-yellow-700'
      : 'bg-slate-700 text-slate-300 border border-slate-600';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${cls}`}>
      {score}/100
    </span>
  );
}

export default function LegacyScannerPage() {
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/scanner/results')
      .then(r => r.json())
      .then((d: ResultsPayload) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  const hits: ScanResult[] = data?.hits || [];
  const filtered = hits.filter(h => {
    if (filter === 'high' && h.score < 80) return false;
    if (filter === 'medium' && (h.score < 50 || h.score >= 80)) return false;
    if (searchTerm && !h.domain.includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const highCount = hits.filter(h => h.score >= 80).length;
  const medCount = hits.filter(h => h.score >= 50 && h.score < 80).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            🔍 Legacy Google Apps Scanner
          </h1>
          <p className="text-slate-400">
            Scans pre-2012 domains for active Google MX / CNAME panel signals.
            Runs automatically every hour via Vercel Cron.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Domains" value={data?.totalDomains ?? '—'} />
          <StatCard label="Total Hits" value={hits.length} color="text-blue-400" />
          <StatCard label="High Signal" value={highCount} color="text-green-400" />
          <StatCard label="Medium Signal" value={medCount} color="text-yellow-400" />
        </div>

        {/* Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Scan cycle progress</span>
            <span>{data?.progress ?? 0}% — index {data?.scanIndex ?? 0} / {data?.totalDomains ?? 0}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.progress ?? 0}%` }}
            />
          </div>
          {data?.lastScan && (
            <p className="text-xs text-slate-500 mt-2">
              Last scan: {new Date(data.lastScan.timestamp).toLocaleString()} —
              scanned {data.lastScan.scanned} domains, found {data.lastScan.hitsFound} hit(s)
            </p>
          )}
        </div>

        {/* Score legend */}
        <div className="flex gap-4 text-xs text-slate-400 mb-4 flex-wrap">
          <span><span className="text-green-400 font-bold">80–100</span> = Google MX + CNAME (strongest signal)</span>
          <span><span className="text-yellow-400 font-bold">50–79</span> = Google MX only</span>
          <span><span className="text-slate-300 font-bold">15–49</span> = TXT hints only</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {(['all', 'high', 'medium'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'All hits' : f === 'high' ? '≥80 score' : '50–79 score'}
            </button>
          ))}
          <input
            type="text"
            placeholder="Filter by domain…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="ml-auto bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
          />
          <button
            onClick={load}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm px-3 py-1 rounded transition-colors"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Table */}
        {loading && !data ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center text-slate-400">
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <p className="text-slate-400 text-lg mb-2">
              {hits.length === 0 ? 'No hits yet.' : 'No hits match the current filter.'}
            </p>
            {hits.length === 0 && (
              <p className="text-slate-500 text-sm">
                Add domains via the API, then wait for the next cron run.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-sm">
              <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Domain</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3 text-center">Google MX</th>
                  <th className="px-4 py-3 text-center">Legacy CNAME</th>
                  <th className="px-4 py-3 text-center">Google TXT</th>
                  <th className="px-4 py-3 text-left">Found</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((hit, i) => (
                  <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono">
                      <a
                        href={`https://${hit.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {hit.domain}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ScoreBadge score={hit.score} />
                    </td>
                    <td className="px-4 py-3 text-center">{hit.googleMX ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-center">{hit.legacyCNAME ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-center">{hit.googleTXT ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(hit.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-slate-500 text-xs mt-2 text-right">
              Showing {filtered.length} of {hits.length} hit(s) · auto-refreshes every 60s
            </p>
          </div>
        )}

        {/* API quick reference */}
        <details className="mt-8 bg-slate-900 border border-slate-800 rounded-lg">
          <summary className="px-4 py-3 cursor-pointer text-slate-300 text-sm font-medium hover:text-white">
            API reference — how to load domains
          </summary>
          <div className="px-4 pb-4 space-y-3 text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
            <p className="text-slate-300 font-sans text-sm font-medium">Add domains (POST with x-api-key header)</p>
            <pre className="bg-slate-800 rounded p-3 overflow-x-auto text-green-300">{`curl -X POST https://burnedinbox.com/api/scanner/domains \\
  -H "x-api-key: YOUR_SCANNER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"domains": ["example.com", "oldco.net"]}'`}</pre>
            <p className="text-slate-300 font-sans text-sm font-medium">Bulk load from a text file (one domain per line)</p>
            <pre className="bg-slate-800 rounded p-3 overflow-x-auto text-green-300">{`jq -Rn '[inputs | select(length>0)]' domains.txt | \\
  jq '{domains:.}' | \\
  curl -X POST https://burnedinbox.com/api/scanner/domains \\
    -H "x-api-key: YOUR_SCANNER_API_KEY" \\
    -H "Content-Type: application/json" \\
    -d @-`}</pre>
            <p className="text-slate-300 font-sans text-sm font-medium">Trigger a manual scan</p>
            <pre className="bg-slate-800 rounded p-3 overflow-x-auto text-green-300">{`curl https://burnedinbox.com/api/scanner/scan \\
  -H "Authorization: Bearer YOUR_CRON_SECRET"`}</pre>
          </div>
        </details>

      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-white' }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

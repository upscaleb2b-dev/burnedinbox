'use client';

import { useEffect, useState, useCallback } from 'react';
import type { ScanResult } from './api/cron/scan/route';

interface LastScan {
  timestamp: string;
  scanned: number;
  hits: number;
  queueRemaining: number;
  totalScanned: number;
}

interface LastSource {
  timestamp: string;
  pattern: string;
  domainsFound: number;
  newAdded: number;
  queueSize: number;
}

interface ResultsPayload {
  hits: ScanResult[];
  lastScan: LastScan | null;
  lastSource: LastSource | null;
  queueSize: number;
  totalScanned: number;
}

function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function TierBadge({ tier, score }: { tier: number; score: number }) {
  const cls =
    tier === 1 ? 'bg-green-900/60 text-green-300 border-green-700' :
    tier === 2 ? 'bg-yellow-900/60 text-yellow-300 border-yellow-700' :
                 'bg-slate-700 text-slate-300 border-slate-600';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${cls}`}>
      {tier === 1 ? '🏆' : tier === 2 ? '⭐' : '·'} {score}/100
    </span>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<'all' | '1' | '2'>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    fetch('/api/results')
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
  const tier1 = hits.filter(h => h.tier === 1);
  const tier2 = hits.filter(h => h.tier === 2);

  const filtered = hits.filter(h => {
    if (tier === '1' && h.tier !== 1) return false;
    if (tier === '2' && h.tier !== 2) return false;
    if (search && !h.domain.includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">🔍 Legacy Google Apps Scanner</h1>
            <p className="text-slate-400 text-sm">
              Auto-sources from Archive.org CDX · DNS-verifies · emails hits · runs 24/7
            </p>
          </div>
          <button
            onClick={load}
            className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded transition-colors"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Stat label="Total Hits" value={hits.length} />
          <Stat label="Tier 1 🏆" value={tier1.length} sub="score ≥ 80" />
          <Stat label="Tier 2 ⭐" value={tier2.length} sub="score 50–79" />
          <Stat label="Queue" value={data?.queueSize ?? '—'} sub="pending scan" />
          <Stat label="Scanned" value={data?.totalScanned ?? '—'} sub="all time" />
        </div>

        {/* Last run info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-xs">
            <span className="text-slate-500">Last scan: </span>
            {data?.lastScan ? (
              <>
                <span className="text-slate-300">{ago(data.lastScan.timestamp)}</span>
                <span className="text-slate-500"> · {data.lastScan.scanned} domains · {data.lastScan.hits} hit(s)</span>
              </>
            ) : <span className="text-slate-600">never</span>}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-xs">
            <span className="text-slate-500">Last source: </span>
            {data?.lastSource ? (
              <>
                <span className="text-slate-300">{ago(data.lastSource.timestamp)}</span>
                <span className="text-slate-500"> · {data.lastSource.newAdded} new from </span>
                <span className="text-slate-400 font-mono">{data.lastSource.pattern}</span>
              </>
            ) : <span className="text-slate-600">never</span>}
          </div>
        </div>

        {/* Signal legend */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 mb-6 text-xs text-slate-400 flex flex-wrap gap-x-6 gap-y-1">
          <span><span className="text-green-400 font-semibold">🏆 Tier 1 ≥80</span> — Legacy MX + start.domain CNAME, near-certain free panel</span>
          <span><span className="text-yellow-400 font-semibold">⭐ Tier 2 50–79</span> — Google MX confirmed, strong legacy signal</span>
          <span><span className="font-semibold text-slate-300">start.*</span> = strongest single indicator (pre-2010 dashboard, discontinued)</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {(['all', '1', '2'] as const).map(f => (
            <button
              key={f}
              onClick={() => setTier(f)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                tier === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'All' : f === '1' ? '🏆 Tier 1' : '⭐ Tier 2'}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search domain…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ml-auto bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
          />
        </div>

        {/* Table */}
        {loading && !data ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center text-slate-500">
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <p className="text-slate-400 text-lg mb-2">
              {hits.length === 0 ? 'No hits yet.' : 'No hits match this filter.'}
            </p>
            {hits.length === 0 && (
              <p className="text-slate-500 text-sm mt-1">
                The sourcing cron runs every 6 hours and scan runs every hour.
                First results typically appear within a few hours of deployment.
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
                  <th className="px-4 py-3 text-center">MX</th>
                  <th className="px-4 py-3 text-center">start.*</th>
                  <th className="px-4 py-3 text-center">CNAMEs</th>
                  <th className="px-4 py-3 text-center">TXT</th>
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
                      <TierBadge tier={hit.tier} score={hit.score} />
                    </td>
                    <td className="px-4 py-3 text-center text-xs">
                      {hit.signals.mxType === 'legacy' ? (
                        <span className="text-green-400 font-semibold">Legacy</span>
                      ) : hit.signals.mxType === 'google' ? (
                        <span className="text-yellow-400">Google</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hit.signals.startCNAME ? '✅' : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-mono">
                      {hit.signals.legacyCNAMEs.length > 0 ? (
                        <span className="text-green-400">{hit.signals.legacyCNAMEs.join(', ')}</span>
                      ) : hit.signals.newerCNAMEs.length > 0 ? (
                        <span className="text-yellow-600">{hit.signals.newerCNAMEs.join(', ')}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hit.signals.googleTXT ? '✅' : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(hit.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-slate-600 text-xs mt-2 text-right">
              {filtered.length} of {hits.length} hits · refreshes every 60s
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

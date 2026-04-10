"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Database } from "lucide-react";

const RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "CNAME", "NS", "SOA", "SRV", "PTR", "CAA"] as const;
type RecordType = typeof RECORD_TYPES[number];

const TYPE_DESCRIPTIONS: Record<RecordType, string> = {
  A: "IPv4 address", AAAA: "IPv6 address", MX: "Mail servers",
  TXT: "Text records / SPF / DKIM", CNAME: "Canonical name alias",
  NS: "Nameservers", SOA: "Start of authority", SRV: "Service locator",
  PTR: "Reverse DNS", CAA: "Certificate authority",
};

const TYPE_COLORS: Record<RecordType, { bg: string; border: string; text: string }> = {
  A:     { bg: "#3b82f611", border: "#3b82f633", text: "#60a5fa" },
  AAAA:  { bg: "#8b5cf611", border: "#8b5cf633", text: "#a78bfa" },
  MX:    { bg: "#10b98111", border: "#10b98133", text: "#34d399" },
  TXT:   { bg: "#f59e0b11", border: "#f59e0b33", text: "#fbbf24" },
  CNAME: { bg: "#ec489911", border: "#ec489933", text: "#f472b6" },
  NS:    { bg: "#06b6d411", border: "#06b6d433", text: "#22d3ee" },
  SOA:   { bg: "#64748b11", border: "#64748b33", text: "#94a3b8" },
  SRV:   { bg: "#f9731611", border: "#f9731633", text: "#fb923c" },
  PTR:   { bg: "#84cc1611", border: "#84cc1633", text: "#a3e635" },
  CAA:   { bg: "#ef444411", border: "#ef444433", text: "#f87171" },
};

interface DnsRecord {
  name: string;
  value: string;
  ttl: number;
  parsed?: Record<string, string | number>;
}

interface DnsResult {
  domain: string;
  type: RecordType;
  found: boolean;
  records: DnsRecord[];
  status: string;
  message?: string;
}

function TTLBadge({ ttl }: { ttl: number }) {
  const mins = Math.round(ttl / 60);
  const label = mins < 60 ? `${mins}m` : mins < 1440 ? `${Math.round(mins / 60)}h` : `${Math.round(mins / 1440)}d`;
  return <span style={{ fontSize: 10, color: "#475569", fontFamily: "'Geist Mono', monospace" }}>TTL {label}</span>;
}

function RecordCard({ record, type }: { record: DnsRecord; type: RecordType }) {
  const c = TYPE_COLORS[type];

  const renderValue = () => {
    if ((type === "MX" || type === "SRV" || type === "CAA") && record.parsed) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(record.parsed).map(([k, v]) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</span>
              <span style={{ fontSize: 13, color: "#cbd5e1", fontFamily: "'Geist Mono', monospace" }}>{String(v)}</span>
            </span>
          ))}
        </div>
      );
    }
    if (type === "SOA" && record.parsed) {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
          {Object.entries(record.parsed).map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</span>
              <span style={{ fontSize: 12, color: "#cbd5e1", fontFamily: "'Geist Mono', monospace" }}>{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    return <span style={{ fontSize: 13, color: "#cbd5e1", fontFamily: "'Geist Mono', monospace", wordBreak: "break-all", lineHeight: 1.6 }}>{record.value}</span>;
  };

  return (
    <div style={{ border: `1px solid ${c.border}`, borderRadius: 10, padding: "12px 16px", background: c.bg, animation: "fadeUp 0.3s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, border: `1px solid ${c.border}`, background: c.bg, color: c.text, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em" }}>{type}</span>
        <span style={{ fontSize: 12, color: "#475569", fontFamily: "'Geist Mono', monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{record.name}</span>
        <TTLBadge ttl={record.ttl} />
      </div>
      {renderValue()}
    </div>
  );
}

export default function DNSPage() {
  const [domain, setDomain] = useState("");
  const [selectedType, setSelectedType] = useState<RecordType>("A");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DnsResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ domain: string; type: RecordType }[]>([]);

  const lookup = async (d = domain, t = selectedType) => {
    if (!d.trim()) return;
    setLoading(true); setData(null); setError("");
    try {
      const res = await fetch("/api/dns-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: d.trim(), type: t }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lookup failed");
      setData(json);
      setHistory(prev => {
        const filtered = prev.filter(h => !(h.domain === json.domain && h.type === t));
        return [{ domain: json.domain, type: t }, ...filtered].slice(0, 6);
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f1a", fontFamily: "'Geist', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
        * { box-sizing: border-box; margin:0; padding:0; }
        input::placeholder { color: #334155; }
        input:focus { outline: none; border-color: #06b6d4 !important; box-shadow: 0 0 0 3px rgba(6,182,212,0.12); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(11,15,26,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "#c8102e", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={13} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "#f1f5f9" }}>
            burned<span style={{ color: "#c8102e" }}>inbox</span>
          </span>
        </Link>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b", textDecoration: "none" }}>
          <ArrowLeft size={13} /> Back
        </Link>
      </nav>

      {/* Page header */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #06b6d4, #0891b2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Database size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>DNS Record Checker</h1>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>Look up any DNS record for any domain instantly</p>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", marginBottom: 80 }}>

          {/* Type selector */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {RECORD_TYPES.map(t => {
              const c = TYPE_COLORS[t];
              const active = selectedType === t;
              return (
                <button key={t} onClick={() => setSelectedType(t)}
                  title={TYPE_DESCRIPTIONS[t]}
                  style={{
                    fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: active ? 700 : 500,
                    padding: "5px 11px", borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
                    border: `1px solid ${active ? c.border : "rgba(255,255,255,0.08)"}`,
                    background: active ? c.bg : "rgba(255,255,255,0.03)",
                    color: active ? c.text : "#64748b",
                  }}>
                  {t}
                </button>
              );
            })}
          </div>

          {/* Type description */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", marginBottom: 16 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            {TYPE_DESCRIPTIONS[selectedType]}
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text" value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === "Enter" && lookup()}
                placeholder="example.com or mail.example.com"
                disabled={loading}
                style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px 12px 40px", color: "#e2e8f0", fontFamily: "'Geist Mono', monospace", fontSize: 13, transition: "border-color 0.2s, box-shadow 0.2s" }}
              />
            </div>
            <button onClick={() => lookup()} disabled={loading || !domain.trim()}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#06b6d4", color: "#0c1a2e", border: "none", borderRadius: 10, padding: "12px 20px", fontFamily: "'Geist', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, opacity: loading || !domain.trim() ? 0.5 : 1, transition: "background 0.15s" }}>
              {loading
                ? <div style={{ width: 15, height: 15, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#0c1a2e", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>Lookup</>}
            </button>
          </div>

          {/* History */}
          {history.length > 0 && !data && !loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>Recent:</span>
              {history.map((h, i) => {
                const c = TYPE_COLORS[h.type];
                return (
                  <button key={i} onClick={() => { setDomain(h.domain); setSelectedType(h.type); lookup(h.domain, h.type); }}
                    style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#64748b", cursor: "pointer", fontFamily: "'Geist Mono', monospace" }}>
                    <span style={{ color: c.text, fontWeight: 700 }}>{h.type}</span> {h.domain}
                  </button>
                );
              })}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 14px", color: "#f87171", fontSize: 13, marginBottom: 12 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Skeleton */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 68, borderRadius: 10, background: "rgba(255,255,255,0.04)", animation: "shimmer 1.4s ease-in-out infinite", opacity: 1 - i * 0.2 }} />
              ))}
            </div>
          )}

          {/* Results */}
          {data && !loading && (
            <div style={{ marginTop: 4 }}>
              {/* Summary */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, padding: "11px 16px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Geist Mono', monospace", fontSize: 13 }}>
                  <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{data.domain}</span>
                  <span style={{ color: "#334155" }}>→</span>
                  <span style={{ color: TYPE_COLORS[data.type].text, fontWeight: 600 }}>{data.type}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {data.found
                    ? <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}>{data.records.length} record{data.records.length !== 1 ? "s" : ""} found</span>
                    : <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>No records found</span>
                  }
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", fontFamily: "'Geist Mono', monospace" }}>{data.status}</span>
                </div>
              </div>

              {/* No records */}
              {!data.found && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "36px 20px", textAlign: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25, color: "#94a3b8" }}><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  <p style={{ fontSize: 13, color: "#475569" }}>{data.message}</p>
                  <p style={{ fontSize: 12, color: "#334155" }}>Try a different record type or check the domain spelling</p>
                </div>
              )}

              {/* Records */}
              {data.found && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.records.map((r, i) => <RecordCard key={i} record={r} type={data.type} />)}
                </div>
              )}

              {/* Quick jump */}
              {data.found && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 11, color: "#475569" }}>Also check:</span>
                  {RECORD_TYPES.filter(t => t !== data.type).slice(0, 5).map(t => {
                    const c = TYPE_COLORS[t];
                    return (
                      <button key={t} onClick={() => { setSelectedType(t); lookup(data.domain, t); }}
                        style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: `1px solid ${c.border}`, background: c.bg, color: c.text, cursor: "pointer" }}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

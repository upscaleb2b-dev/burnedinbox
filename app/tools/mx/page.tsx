"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Mail, RefreshCw, Server } from "lucide-react";

interface MXRecord {
  priority: number;
  exchange: string;
  provider: string;
  ip: string | null;
  ptr: string | null;
  ptrMatch: boolean;
  connectivity: "reachable" | "timeout" | "unknown";
}

interface MXResult {
  domain: string;
  found: boolean;
  records: MXRecord[];
  providers: string[];
  issues: string[];
  tips: string[];
  score: number;
  message?: string;
}

const PROVIDER_COLORS: Record<string, { color: string; bg: string }> = {
  "Google Workspace": { color: "#1967d2", bg: "#e8f0fe" },
  "Microsoft 365":   { color: "#0078d4", bg: "#e3f2fd" },
  "Mimecast":        { color: "#6b21a8", bg: "#f3e8ff" },
  "Proofpoint":      { color: "#c2410c", bg: "#fff7ed" },
  "Amazon SES":      { color: "#d97706", bg: "#fef3c7" },
  "Mailgun":         { color: "#c81d25", bg: "#fee2e2" },
  "SendGrid":        { color: "#1b9fd8", bg: "#e0f2fe" },
  "Zoho Mail":       { color: "#e42527", bg: "#fee2e2" },
};

function ProviderBadge({ provider }: { provider: string }) {
  const style = PROVIDER_COLORS[provider] || { color: "var(--ink-3)", bg: "var(--paper-3)" };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, color: style.color, background: style.bg, flexShrink: 0 }}>
      {provider}
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 40, circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = score >= 75 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";
  return (
    <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-3)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off} className="score-ring"
          style={{ "--dash": off } as React.CSSProperties} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 20, fontWeight: 700, lineHeight: 1, color: col }}>{score}</span>
        <span style={{ fontSize: 9, color: "var(--ink-4)", marginTop: 1 }}>/100</span>
      </div>
    </div>
  );
}

export default function MXPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MXResult | null>(null);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/mx-lookup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        @keyframes score-ring { from{stroke-dashoffset:283} to{stroke-dashoffset:var(--dash)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .score-ring { animation: score-ring 1.1s cubic-bezier(0.4,0,0.2,1) forwards; }
        .fade-up { animation: fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .mx-row { opacity:0; animation: fade-up 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
        .mx-row:nth-child(1){animation-delay:0.04s} .mx-row:nth-child(2){animation-delay:0.09s}
        .mx-row:nth-child(3){animation-delay:0.14s} .mx-row:nth-child(4){animation-delay:0.19s}
        .mx-row:nth-child(5){animation-delay:0.24s} .mx-row:nth-child(6){animation-delay:0.29s}
        input:focus { outline:none; border-color:var(--ink) !important; box-shadow:0 0 0 3px rgba(12,12,12,0.07); }
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder { color:var(--ink-5); }
      `}</style>

      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={13} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>burned<span style={{ color: "var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
          <ArrowLeft size={13} /> Back
        </Link>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail size={18} style={{ color: "#2563eb" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>MX Record Checker</h1>
            <p style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 2 }}>Check mail routing, provider detection, priority ordering, PTR records, and connectivity</p>
          </div>
        </div>

        {/* Input */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 7 }}>Domain</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input className="input" type="text" value={domain} onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup()}
              placeholder="yourdomain.com"
              style={{ flex: 1, fontFamily: "'Geist Mono', monospace", fontSize: 13 }} />
            <button onClick={lookup} disabled={loading || !domain.trim()} className="btn btn-primary"
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", fontSize: 13, flexShrink: 0 }}>
              {loading
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <><Server size={13} /> Look up</>}
            </button>
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 10 }}>
            Returns all MX records with priority, provider, IP, PTR record, and connectivity status.
          </p>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 13, marginBottom: 14 }}>
            <XCircle size={14} /> {error}
          </div>
        )}

        {/* No records */}
        {result && !result.found && (
          <div className="card fade-up" style={{ padding: "28px 24px", textAlign: "center" }}>
            <XCircle size={28} style={{ color: "var(--red)", margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--red)", marginBottom: 8 }}>No MX records found</p>
            <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>{result.message}</p>
          </div>
        )}

        {/* Results */}
        {result && result.found && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Summary card */}
            <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <ScoreRing score={result.score} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "var(--ink-2)", marginBottom: 6 }}>{result.domain}</p>
                <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                  <div>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 22, fontWeight: 700, color: "var(--green)" }}>{result.records.length}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-4)", marginLeft: 5 }}>MX record{result.records.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                {/* Providers */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.providers.map(p => <ProviderBadge key={p} provider={p} />)}
                </div>
              </div>
            </div>

            {/* Issues & tips */}
            {result.issues.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {result.issues.map((i, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8, padding: "10px 14px", borderRadius: 10, background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
                    <XCircle size={14} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "var(--red)" }}>{i}</span>
                  </div>
                ))}
              </div>
            )}
            {result.tips.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {result.tips.map((t, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8, padding: "10px 14px", borderRadius: 10, background: "var(--yellow-dim)", border: "1px solid rgba(146,96,10,0.2)" }}>
                    <AlertTriangle size={14} style={{ color: "var(--yellow)", flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "var(--yellow)" }}>{t}</span>
                  </div>
                ))}
              </div>
            )}

            {/* MX Records table */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 16 }}>
                {["Priority", "Mail server", "Provider", "IP address", "PTR record", "Status"].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", flex: h === "Mail server" ? 2 : h === "PTR record" ? 1.5 : 1, minWidth: 0 }}>{h}</span>
                ))}
              </div>
              {result.records.map((mx, i) => (
                <div key={i} className="mx-row" style={{ display: "flex", gap: 16, padding: "13px 20px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, fontWeight: 700, color: "var(--ink)", flex: 1 }}>{mx.priority}</span>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "var(--ink-2)", flex: 2, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mx.exchange}</span>
                  <span style={{ flex: 1 }}><ProviderBadge provider={mx.provider} /></span>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "var(--ink-4)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{mx.ip || "—"}</span>
                  <div style={{ flex: 1.5, minWidth: 0, display: "flex", alignItems: "center", gap: 5 }}>
                    {mx.ptr
                      ? <><CheckCircle2 size={12} style={{ color: "var(--green)", flexShrink: 0 }} /><span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "var(--ink-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mx.ptr}</span></>
                      : <><XCircle size={12} style={{ color: "var(--ink-4)", flexShrink: 0 }} /><span style={{ fontSize: 11, color: "var(--ink-4)" }}>No PTR</span></>
                    }
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5 }}>
                    {mx.connectivity === "reachable"
                      ? <><CheckCircle2 size={12} style={{ color: "var(--green)" }} /><span style={{ fontSize: 11, color: "var(--green)" }}>Reachable</span></>
                      : <><XCircle size={12} style={{ color: "var(--red)" }} /><span style={{ fontSize: 11, color: "var(--red)" }}>Unreachable</span></>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* No issues banner */}
            {result.issues.length === 0 && result.tips.length === 0 && (
              <div className="card" style={{ padding: "18px 22px", borderLeft: "3px solid var(--green)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <CheckCircle2 size={16} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--green)", marginBottom: 4 }}>MX records look healthy</p>
                  <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65 }}>Mail routing is properly configured with correct priority ordering, reachable servers, and PTR records.</p>
                </div>
              </div>
            )}

            <button onClick={() => { setResult(null); setDomain(""); }} className="btn btn-ghost" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }}>
              <RefreshCw size={13} /> Check another domain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

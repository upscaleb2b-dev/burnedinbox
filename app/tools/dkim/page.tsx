"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Copy, Check, CheckCircle2, XCircle, AlertTriangle, Search, Lock, RefreshCw } from "lucide-react";

interface DKIMResult {
  selector: string;
  found: boolean;
  name: string;
  record?: string;
  keyType?: string;
  keyLength?: number | null;
  pubkey?: string;
  score?: number;
  revoked?: boolean;
  issues?: string[];
  tips?: string[];
  tags?: Record<string, string>;
}

interface LookupResponse {
  domain: string;
  results: DKIMResult[];
  found: boolean;
  scanned: number;
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${done ? "var(--green)" : "var(--border-2)"}`, background: done ? "var(--green-dim)" : "var(--paper-2)", color: done ? "var(--green)" : "var(--ink-3)", transition: "all 0.15s" }}>
      {done ? <Check size={11} /> : <Copy size={11} />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 36, circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = score >= 80 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";
  return (
    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-3)" strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off} className="score-ring"
          style={{ "--dash": off } as React.CSSProperties} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 19, fontWeight: 700, lineHeight: 1, color: col }}>{score}</span>
        <span style={{ fontSize: 9, color: "var(--ink-4)", marginTop: 1 }}>/100</span>
      </div>
    </div>
  );
}

function ResultCard({ r }: { r: DKIMResult }) {
  const [open, setOpen] = useState(false);
  const col = r.found ? (r.revoked ? "var(--red)" : r.score! >= 70 ? "var(--green)" : "var(--yellow)") : "var(--ink-4)";
  const bg = r.found ? (r.revoked ? "var(--red-dim)" : r.score! >= 70 ? "var(--green-dim)" : "var(--yellow-dim)") : "var(--paper-3)";
  const statusLabel = !r.found ? "Not found" : r.revoked ? "Revoked" : r.score! >= 70 ? "Valid" : "Issues";
  const StatusIc = !r.found ? XCircle : r.revoked ? XCircle : r.score! >= 70 ? CheckCircle2 : AlertTriangle;

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", cursor: r.found ? "pointer" : "default" }} onClick={() => r.found && setOpen(!open)}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "var(--paper)" }}>
        <StatusIc size={15} style={{ color: col, flexShrink: 0 }} />
        <code style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", flex: 1 }}>{r.selector}._domainkey</code>
        {r.found && r.keyType && (
          <span style={{ fontSize: 11, color: "var(--ink-4)", fontFamily: "'Geist Mono', monospace" }}>
            {r.keyType.toUpperCase()}{r.keyLength ? `-${r.keyLength}` : ""}
          </span>
        )}
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, color: col, background: bg, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{statusLabel}</span>
        {r.found && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>}
      </div>
      {open && r.found && (
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", background: "var(--paper-2)", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Score */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ScoreRing score={r.score!} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: col, marginBottom: 4 }}>
                {r.revoked ? "Key revoked" : r.score! >= 80 ? "Healthy DKIM key" : r.score! >= 50 ? "Issues detected" : "Critical issues"}
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-4)" }}>Selector: <code style={{ fontFamily: "monospace" }}>{r.selector}._domainkey</code></p>
            </div>
          </div>

          {/* Raw record */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)" }}>Record</p>
              <CopyBtn text={r.record || ""} />
            </div>
            <code style={{ display: "block", fontFamily: "'Geist Mono', monospace", fontSize: 11, padding: "10px 14px", borderRadius: 8, background: "var(--paper)", border: "1px solid var(--border)", wordBreak: "break-all", lineHeight: 1.8, color: "var(--ink)" }}>{r.record}</code>
          </div>

          {/* Tags */}
          {r.tags && Object.keys(r.tags).length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>Parsed tags</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {Object.entries(r.tags).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 10, padding: "6px 10px", borderRadius: 6, background: "var(--paper)", border: "1px solid var(--border)" }}>
                    <code style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "var(--ink-3)", minWidth: 40 }}>{k}=</code>
                    <code style={{ fontFamily: "monospace", fontSize: 11, color: "var(--ink-2)", wordBreak: "break-all", flex: 1 }}>{k === "p" && v.length > 40 ? `${v.slice(0, 40)}…` : v}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {(r.issues?.length || 0) > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {r.issues!.map((i, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, padding: "8px 12px", borderRadius: 8, background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
                  <XCircle size={13} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "var(--red)" }}>{i}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          {(r.tips?.length || 0) > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {r.tips!.map((t, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, padding: "8px 12px", borderRadius: 8, background: "var(--yellow-dim)", border: "1px solid rgba(146,96,10,0.2)" }}>
                  <AlertTriangle size={13} style={{ color: "var(--yellow)", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "var(--yellow)" }}>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DKIMPage() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/dkim-lookup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim(), selector: selector.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally { setLoading(false); }
  };

  const foundRecords = result?.results.filter(r => r.found) ?? [];
  const highestScore = foundRecords.length ? Math.max(...foundRecords.map(r => r.score ?? 0)) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        @keyframes score-ring { from{stroke-dashoffset:283} to{stroke-dashoffset:var(--dash)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .score-ring { animation: score-ring 1.1s cubic-bezier(0.4,0,0.2,1) forwards; }
        .fade-up { animation: fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .res-card { opacity:0; animation: fade-up 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
        .res-card:nth-child(1){animation-delay:0.03s} .res-card:nth-child(2){animation-delay:0.07s}
        .res-card:nth-child(3){animation-delay:0.11s} .res-card:nth-child(4){animation-delay:0.15s}
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
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--red-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={18} style={{ color: "var(--red)" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>DKIM Checker</h1>
            <p style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 2 }}>Auto-discover DKIM selectors or check a specific one — validates key strength and alignment</p>
          </div>
        </div>

        {/* Input */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 7 }}>Domain</label>
              <input className="input" type="text" value={domain} onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === "Enter" && lookup()}
                placeholder="yourdomain.com"
                style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 7 }}>
                Selector <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ink-5)" }}>(optional — auto-discovers if blank)</span>
              </label>
              <input className="input" type="text" value={selector} onChange={e => setSelector(e.target.value)}
                onKeyDown={e => e.key === "Enter" && lookup()}
                placeholder="default, google, s1…"
                style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13 }} />
            </div>
          </div>
          <button onClick={lookup} disabled={loading || !domain.trim()} className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", fontSize: 13 }}>
            {loading
              ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Scanning…</>
              : <><Search size={13} /> {selector.trim() ? "Check selector" : "Auto-discover selectors"}</>}
          </button>
          <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 10 }}>
            Auto-discovery scans 16 common selectors including Google, M365, SendGrid, Mailgun, Instantly, and more.
          </p>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 13, marginBottom: 14 }}>
            <XCircle size={14} /> {error}
          </div>
        )}

        {result && !loading && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Summary */}
            <div className="card" style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "var(--ink-2)", marginBottom: 5 }}>{result.domain}</p>
                {foundRecords.length > 0 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div>
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 22, fontWeight: 700, color: "var(--green)" }}>{foundRecords.length}</span>
                      <span style={{ fontSize: 12, color: "var(--ink-4)", marginLeft: 5 }}>selector{foundRecords.length !== 1 ? "s" : ""} found</span>
                    </div>
                    <div>
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 22, fontWeight: 700, color: "var(--ink-3)" }}>{result.scanned}</span>
                      <span style={{ fontSize: 12, color: "var(--ink-4)", marginLeft: 5 }}>scanned</span>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--red)" }}>No DKIM selectors found across {result.scanned} common selectors</p>
                )}
              </div>
              {foundRecords.length > 0 && <ScoreRing score={highestScore} />}
            </div>

            {foundRecords.length === 0 && (
              <div className="card" style={{ padding: "24px", borderLeft: "3px solid var(--red)" }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--red)", marginBottom: 8 }}>No DKIM records detected</p>
                <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 12 }}>
                  DKIM signing couldn't be detected for <strong>{result.domain}</strong>. This means emails can't be cryptographically verified as originating from your domain — which hurts deliverability and trust.
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
                  If you know your selector name, enter it above and check again. Otherwise, check your email provider's DNS setup instructions to find your selector and public key.
                </p>
              </div>
            )}

            {/* Result cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(foundRecords.length > 0 ? foundRecords : result.results.slice(0, 4)).map((r, i) => (
                <div key={r.selector} className="res-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ResultCard r={r} />
                </div>
              ))}
            </div>

            <button onClick={() => { setResult(null); setDomain(""); setSelector(""); }} className="btn btn-ghost" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }}>
              <RefreshCw size={13} /> Check another domain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

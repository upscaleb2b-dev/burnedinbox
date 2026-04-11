"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Calendar, XCircle, AlertTriangle, CheckCircle2, Clock, RefreshCw } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExpiryResult {
  domain: string;
  registrar: string | null;
  created: string | null;
  updated: string | null;
  expiry: {
    date: string | null;
    daysRemaining: number | null;
    urgency: "expired" | "critical" | "warning" | "notice" | "safe" | "unknown";
  };
  nameservers: string[];
  status: string[];
}

// ── Config ────────────────────────────────────────────────────────────────────
const URGENCY: Record<string, { color: string; bg: string; border: string; label: string; Icon: typeof CheckCircle2 }> = {
  expired:  { color: "var(--red)",    bg: "var(--red-dim)",    border: "var(--red-border)", label: "Expired",  Icon: XCircle },
  critical: { color: "var(--red)",    bg: "var(--red-dim)",    border: "var(--red-border)", label: "Critical", Icon: XCircle },
  warning:  { color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(146,96,10,0.2)", label: "Warning", Icon: AlertTriangle },
  notice:   { color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(146,96,10,0.2)", label: "Notice",  Icon: AlertTriangle },
  safe:     { color: "var(--green)",  bg: "var(--green-dim)",  border: "rgba(26,122,63,0.2)", label: "Safe",    Icon: CheckCircle2 },
  unknown:  { color: "var(--ink-4)",  bg: "var(--paper-3)",    border: "var(--border)",       label: "Unknown", Icon: Clock },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function ScoreRing({ days, urgency }: { days: number | null; urgency: string }) {
  const cfg = URGENCY[urgency] ?? URGENCY.unknown;
  const r = 44, circ = 2 * Math.PI * r;
  const capped = Math.max(0, Math.min(days ?? 0, 365));
  const offset = circ - (capped / 365) * circ;

  return (
    <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-3)" strokeWidth="7" />
        {days !== null && days > 0 && (
          <circle cx="50" cy="50" r={r} fill="none" stroke={cfg.color} strokeWidth="7"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
        )}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {days === null ? (
          <span style={{ fontSize: 20, color: "var(--ink-4)" }}>?</span>
        ) : days < 0 ? (
          <span style={{ fontSize: 16, fontWeight: 700, color: cfg.color }}>EXP</span>
        ) : (
          <>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: days > 99 ? 18 : 22, fontWeight: 700, lineHeight: 1, color: cfg.color }}>
              {days > 999 ? "999+" : days}
            </span>
            <span style={{ fontSize: 10, color: cfg.color, marginTop: 2 }}>days</span>
          </>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string | null; mono?: boolean }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 13, color: "var(--ink-4)" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--ink-2)", fontFamily: mono ? "'Geist Mono', monospace" : "inherit", textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DomainExpiryPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExpiryResult | null>(null);
  const [error, setError] = useState("");

  const check = async (d = domain) => {
    if (!d.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/domain-expiry", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: d.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally { setLoading(false); }
  };

  const cfg = result ? (URGENCY[result.expiry.urgency] ?? URGENCY.unknown) : null;
  const UrgencyIcon = cfg?.Icon ?? Clock;

  const timelinePct = result?.created && result?.expiry.date
    ? Math.max(0, Math.min(100, ((Date.now() - new Date(result.created).getTime()) / (new Date(result.expiry.date).getTime() - new Date(result.created).getTime())) * 100))
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .fade-up { animation: fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .row:last-child { border-bottom: none !important; }
        input:focus { outline:none; border-color:var(--ink) !important; box-shadow:0 0 0 3px rgba(12,12,12,0.07); }
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder { color: var(--ink-5); }
      `}</style>

      {/* Nav */}
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

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calendar size={18} style={{ color: "#d97706" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>Domain Expiry Checker</h1>
            <p style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 2 }}>Check when any domain expires — registrar, nameservers, renewal status</p>
          </div>
        </div>

        {/* Input card */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>Domain</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="input"
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === "Enter" && check()}
              placeholder="yourdomain.com"
              style={{ flex: 1, fontFamily: "'Geist Mono', monospace", fontSize: 13 }}
            />
            <button onClick={() => check()} disabled={loading || !domain.trim()} className="btn btn-primary"
              style={{ padding: "10px 22px", fontSize: 13, flexShrink: 0, display: "flex", alignItems: "center", gap: 7 }}>
              {loading
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <><Calendar size={13} /> Check</>}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 13, marginBottom: 14 }}>
            <XCircle size={14} /> {error}
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[140, 80, 100].map((h, i) => (
              <div key={i} style={{ height: h, borderRadius: 12, background: "var(--paper-3)", animation: `shimmer 1.4s ease-in-out ${i * 0.1}s infinite` }} />
            ))}
          </div>
        )}

        {/* Results */}
        {result && !loading && cfg && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Main verdict card */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", background: cfg.bg, borderBottom: `2px solid ${cfg.color}`, display: "flex", alignItems: "center", gap: 20 }}>
                <ScoreRing days={result.expiry.daysRemaining} urgency={result.expiry.urgency} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <UrgencyIcon size={16} style={{ color: cfg.color }} />
                    <span style={{ fontWeight: 700, fontSize: 16, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "var(--ink-2)", marginBottom: 8 }}>{result.domain}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 4 }}>
                    {result.expiry.urgency === "expired" ? "Expired on" : "Expires on"}
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: cfg.color, marginBottom: 4 }}>{fmt(result.expiry.date)}</p>
                  {result.expiry.daysRemaining !== null && result.expiry.daysRemaining > 0 && (
                    <p style={{ fontSize: 13, color: "var(--ink-4)" }}>{result.expiry.daysRemaining} days remaining</p>
                  )}
                  {(result.expiry.urgency === "critical" || result.expiry.urgency === "expired") && (
                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--red)", marginTop: 6 }}>⚡ Renew immediately to avoid losing this domain</p>
                  )}
                  {result.expiry.urgency === "warning" && (
                    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--yellow)", marginTop: 6 }}>Renew soon — less than 60 days left</p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {timelinePct !== null && (
                <div style={{ padding: "16px 24px", background: "var(--paper-2)", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Registered</span>
                    <span style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Expires</span>
                  </div>
                  <div style={{ position: "relative", height: 6, background: "var(--paper-3)", borderRadius: 3, marginBottom: 8 }}>
                    <div style={{ height: "100%", borderRadius: 3, background: cfg.color, width: `${timelinePct}%`, transition: "width 1s ease" }} />
                    <div style={{ position: "absolute", top: "50%", left: `${timelinePct}%`, transform: "translate(-50%, -50%)", width: 14, height: 14, borderRadius: "50%", background: "var(--paper)", border: `2px solid ${cfg.color}` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "var(--ink-4)" }}>{fmt(result.created)}</span>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "var(--ink-4)" }}>{fmt(result.expiry.date)}</span>
                  </div>
                </div>
              )}

              {/* Details */}
              <div style={{ padding: "16px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 10 }}>Registration details</p>
                <InfoRow label="Registrar"    value={result.registrar} />
                <InfoRow label="Registered"   value={fmt(result.created)} />
                <InfoRow label="Last updated" value={fmt(result.updated)} />
                <InfoRow label="Expires"      value={fmt(result.expiry.date)} />
              </div>
            </div>

            {/* Nameservers */}
            {result.nameservers.length > 0 && (
              <div className="card" style={{ padding: "16px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 12 }}>Nameservers</p>
                {result.nameservers.map((ns, i) => (
                  <div key={i} className="row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent, #378ADD)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "var(--ink-3)" }}>{ns}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Status */}
            {result.status.length > 0 && (
              <div className="card" style={{ padding: "16px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 12 }}>Domain status</p>
                {result.status.map((s, i) => (
                  <div key={i} className="row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "var(--ink-3)", wordBreak: "break-all" }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Check another */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={() => { setResult(null); setDomain(""); }} className="btn btn-ghost" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw size={13} /> Check another domain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

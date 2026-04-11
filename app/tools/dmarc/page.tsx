"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Copy, Check, CheckCircle2, XCircle, AlertTriangle, Info, Shield } from "lucide-react";

interface AnalysisItem {
  tag: string;
  label: string;
  value: string;
  status: "pass" | "warn" | "fail" | "info";
  note: string;
}

interface DMARCResult {
  domain: string;
  found: boolean;
  record?: string;
  tags?: Record<string, string>;
  analysis?: AnalysisItem[];
  score?: number;
  verdict?: "strong" | "moderate" | "weak" | "missing";
  message?: string;
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${done ? "var(--green)" : "var(--border-2)"}`, background: done ? "var(--green-dim)" : "var(--paper-2)", color: done ? "var(--green)" : "var(--ink-3)", transition: "all 0.15s" }}>
      {done ? <Check size={11} /> : <Copy size={11} />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function StatusIcon({ s }: { s: AnalysisItem["status"] }) {
  if (s === "pass") return <CheckCircle2 size={15} style={{ color: "var(--green)", flexShrink: 0 }} />;
  if (s === "fail") return <XCircle size={15} style={{ color: "var(--red)", flexShrink: 0 }} />;
  if (s === "warn") return <AlertTriangle size={15} style={{ color: "var(--yellow)", flexShrink: 0 }} />;
  return <Info size={15} style={{ color: "var(--ink-4)", flexShrink: 0 }} />;
}

function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const r = 42, circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = verdict === "strong" ? "var(--green)" : verdict === "moderate" ? "var(--yellow)" : "var(--red)";
  const label = verdict === "strong" ? "Strong" : verdict === "moderate" ? "Moderate" : verdict === "weak" ? "Weak" : "Missing";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-3)" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} className="score-ring"
            style={{ "--dash": off } as React.CSSProperties} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 22, fontWeight: 700, lineHeight: 1, color: col }}>{score}</span>
          <span style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 1 }}>/100</span>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 18, fontWeight: 700, color: col, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 13, color: "var(--ink-4)" }}>DMARC health score</p>
      </div>
    </div>
  );
}

const VERDICT_COLORS = {
  strong:   { color: "var(--green)",  bg: "var(--green-dim)",  border: "rgba(26,122,63,0.2)" },
  moderate: { color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(146,96,10,0.2)" },
  weak:     { color: "var(--red)",    bg: "var(--red-dim)",    border: "var(--red-border)" },
  missing:  { color: "var(--red)",    bg: "var(--red-dim)",    border: "var(--red-border)" },
};

const STATUS_META = {
  pass: { color: "var(--green)",  bg: "var(--green-dim)",  label: "Pass" },
  warn: { color: "var(--yellow)", bg: "var(--yellow-dim)", label: "Warn" },
  fail: { color: "var(--red)",    bg: "var(--red-dim)",    label: "Fail" },
  info: { color: "var(--ink-4)",  bg: "var(--paper-3)",    label: "Info" },
};

export default function DMARCPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DMARCResult | null>(null);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/dmarc-lookup", {
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

  const passCount  = result?.analysis?.filter(a => a.status === "pass").length ?? 0;
  const warnCount  = result?.analysis?.filter(a => a.status === "warn").length ?? 0;
  const failCount  = result?.analysis?.filter(a => a.status === "fail").length ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        @keyframes score-ring-anim { from{stroke-dashoffset:283} to{stroke-dashoffset:var(--dash)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .score-ring { animation: score-ring-anim 1.2s cubic-bezier(0.4,0,0.2,1) forwards; }
        .fade-up { animation: fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .row-card { opacity:0; animation: fade-up 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
        .row-card:nth-child(1){animation-delay:0.03s} .row-card:nth-child(2){animation-delay:0.07s}
        .row-card:nth-child(3){animation-delay:0.11s} .row-card:nth-child(4){animation-delay:0.15s}
        .row-card:nth-child(5){animation-delay:0.19s} .row-card:nth-child(6){animation-delay:0.23s}
        .row-card:nth-child(7){animation-delay:0.27s} .row-card:nth-child(8){animation-delay:0.31s}
        input:focus { outline:none; border-color:var(--ink) !important; box-shadow:0 0 0 3px rgba(12,12,12,0.07); }
        * { box-sizing:border-box; margin:0; padding:0; }
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

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--red-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={18} style={{ color: "var(--red)" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>DMARC Lookup</h1>
            <p style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 2 }}>Check DMARC policy, alignment, and reporting configuration for any domain</p>
          </div>
        </div>

        {/* Input */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>Domain</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="input"
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup()}
              placeholder="yourdomain.com"
              style={{ flex: 1, fontFamily: "'Geist Mono', monospace", fontSize: 13 }}
            />
            <button onClick={lookup} disabled={loading || !domain.trim()} className="btn btn-primary"
              style={{ padding: "10px 22px", fontSize: 13, flexShrink: 0, display: "flex", alignItems: "center", gap: 7 }}>
              {loading
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <><Shield size={13} /> Look up</>}
            </button>
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 8 }}>
            We check <code style={{ fontFamily: "monospace", fontSize: 11 }}>_dmarc.yourdomain.com</code> via Google DNS — results are live.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 13, marginBottom: 16 }}>
            <XCircle size={14} /> {error}
          </div>
        )}

        {/* No record found */}
        {result && !result.found && (
          <div className="card fade-up" style={{ padding: "36px 24px", textAlign: "center" }}>
            <XCircle size={32} style={{ color: "var(--red)", margin: "0 auto 14px", display: "block" }} />
            <p style={{ fontWeight: 700, fontSize: 16, color: "var(--red)", marginBottom: 8 }}>No DMARC record found</p>
            <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 20, lineHeight: 1.6 }}>{result.message}</p>
            <div style={{ padding: "16px 20px", borderRadius: 10, background: "var(--paper-2)", border: "1px solid var(--border)", textAlign: "left", display: "inline-block", maxWidth: 480 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 10 }}>Minimum DMARC record to add</p>
              <code style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "var(--ink)", display: "block", marginBottom: 10 }}>
                v=DMARC1; p=none; rua=mailto:dmarc@{result.domain}
              </code>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <CopyBtn text={`v=DMARC1; p=none; rua=mailto:dmarc@${result.domain}`} />
                <span style={{ fontSize: 12, color: "var(--ink-4)" }}>Add as TXT record at <code style={{ fontFamily: "monospace", fontSize: 11 }}>_dmarc.{result.domain}</code></span>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && result.found && result.analysis && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-up">

            {/* Score + verdict */}
            <div className="card" style={{ padding: "20px 24px", overflow: "hidden" }}>
              {(() => {
                const vc = VERDICT_COLORS[result.verdict as keyof typeof VERDICT_COLORS] ?? VERDICT_COLORS.weak;
                return (
                  <>
                    <div style={{ padding: "14px 18px", borderRadius: 10, background: vc.bg, border: `1px solid ${vc.border}`, marginBottom: 20 }}>
                      <ScoreRing score={result.score ?? 0} verdict={result.verdict ?? "weak"} />
                    </div>
                    <div style={{ display: "flex", gap: 20 }}>
                      {[{ n: passCount, l: "Passed", c: "var(--green)" }, { n: warnCount, l: "Warnings", c: "var(--yellow)" }, { n: failCount, l: "Failed", c: "var(--red)" }].map(({ n, l, c }) => (
                        <div key={l}>
                          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 22, fontWeight: 700, color: c, lineHeight: 1 }}>{n}</div>
                          <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>{l}</div>
                        </div>
                      ))}
                      <div style={{ marginLeft: "auto" }}>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, lineHeight: 1, color: result.verdict === "strong" ? "var(--green)" : result.verdict === "moderate" ? "var(--yellow)" : "var(--red)" }}>
                          {(result.score ?? 0) >= 80 ? "A" : (result.score ?? 0) >= 60 ? "B" : (result.score ?? 0) >= 40 ? "C" : (result.score ?? 0) >= 20 ? "D" : "F"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", textAlign: "center" }}>Grade</div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Raw record */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>DMARC record</p>
                <CopyBtn text={result.record ?? ""} />
              </div>
              <code style={{ display: "block", fontFamily: "'Geist Mono', monospace", fontSize: 12, padding: "14px 16px", borderRadius: 8, background: "var(--paper-2)", border: "1px solid var(--border)", wordBreak: "break-all", lineHeight: 1.8, color: "var(--ink)" }}>
                {result.record}
              </code>
              <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 8 }}>
                Found at <code style={{ fontFamily: "monospace", fontSize: 11 }}>_dmarc.{result.domain}</code>
              </p>
            </div>

            {/* Analysis table */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Tag analysis</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.analysis.map((a, i) => {
                  const sm = STATUS_META[a.status as keyof typeof STATUS_META] ?? STATUS_META.info;
                  const [open, setOpen] = useState(false);
                  return (
                    <div key={i} className="row-card" style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", cursor: "pointer" }} onClick={() => setOpen(!open)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "var(--paper)" }}>
                        <StatusIcon s={a.status} />
                        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "var(--paper-2)", border: "1px solid var(--border)", color: "var(--ink-3)" }}>{a.tag}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", flex: 1 }}>{a.label}</span>
                        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "var(--ink-3)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "none" }} id={`v-${i}`}>{a.value}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, color: sm.color, background: sm.bg, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{sm.label}</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      {open && (
                        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--paper-2)" }}>
                          <code style={{ display: "block", fontFamily: "'Geist Mono', monospace", fontSize: 12, padding: "8px 12px", borderRadius: 6, background: sm.bg, color: sm.color, marginBottom: 8, wordBreak: "break-all" }}>{a.value}</code>
                          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65 }}>{a.note}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What to fix */}
            {(failCount > 0 || warnCount > 0) && (
              <div className="card" style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Recommended improvements</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {result.analysis.filter(a => a.status === "fail" || a.status === "warn").map((a, i) => {
                    const sm = STATUS_META[a.status as keyof typeof STATUS_META];
                    return (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", borderRadius: 10, background: sm.bg, border: `1px solid ${a.status === "fail" ? "var(--red-border)" : "rgba(146,96,10,0.2)"}` }}>
                        <StatusIcon s={a.status} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: sm.color, marginBottom: 4 }}>{a.label} ({a.tag})</p>
                          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>{a.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All good */}
            {failCount === 0 && warnCount === 0 && (
              <div className="card" style={{ padding: "20px 24px", borderLeft: "3px solid var(--green)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <CheckCircle2 size={18} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 6 }}>DMARC is fully configured</p>
                    <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.65 }}>No issues detected. Your domain is protected against spoofing and BEC attacks. Keep monitoring regularly.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

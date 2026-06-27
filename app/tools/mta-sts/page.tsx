"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Info, Lock } from "lucide-react";

interface AnalysisItem {
  label: string;
  value: string;
  status: string;
  note: string;
}

interface MtaStsResult {
  domain: string;
  stsRecord: string | null;
  stsTags: Record<string, string>;
  policyFile: {
    url: string;
    body: string;
    tags: Record<string, string | string[]>;
  } | null;
  tlsRptRecord: string | null;
  analysis: AnalysisItem[];
  issues: string[];
  tips: string[];
  score: number;
  verdict: string;
}

function StatusIcon({ s }: { s: string }) {
  if (s === "pass") return <CheckCircle2 size={15} style={{ color: "var(--green)", flexShrink: 0 }} />;
  if (s === "fail") return <XCircle size={15} style={{ color: "var(--red)", flexShrink: 0 }} />;
  if (s === "warn") return <AlertTriangle size={15} style={{ color: "var(--yellow)", flexShrink: 0 }} />;
  return <Info size={15} style={{ color: "var(--ink-4)", flexShrink: 0 }} />;
}

function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const r = 42, circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = score >= 70 ? "var(--green)" : score >= 40 ? "var(--yellow)" : "var(--red)";
  const label = verdict === "enforcing" ? "Enforcing" : verdict === "testing" ? "Testing" : verdict === "partial" ? "Partial" : "Not Set";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-3)" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 22, fontWeight: 700, lineHeight: 1, color: col }}>{score}</span>
          <span style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 1 }}>/100</span>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 18, fontWeight: 700, color: col, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 13, color: "var(--ink-4)" }}>MTA-STS health score</p>
      </div>
    </div>
  );
}

const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  pass: { color: "var(--green)",  bg: "var(--green-dim)",  label: "Pass" },
  warn: { color: "var(--yellow)", bg: "var(--yellow-dim)", label: "Warn" },
  fail: { color: "var(--red)",    bg: "var(--red-dim)",    label: "Fail" },
  info: { color: "var(--ink-4)",  bg: "var(--paper-3)",    label: "Info" },
};

export default function MtaStsPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MtaStsResult | null>(null);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/mta-sts", {
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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none; border-color: var(--ink) !important; box-shadow: 0 0 0 3px rgba(12,12,12,0.07); }
        input::placeholder { color: var(--ink-5); }
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
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>MTA-STS Checker</h1>
            <p style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 2 }}>Verify MTA-STS policy, TLS-RPT record, and policy file for inbound TLS enforcement</p>
          </div>
        </div>

        {/* Explainer */}
        <div className="card" style={{ padding: "16px 20px", marginBottom: 14, borderLeft: "3px solid var(--red)" }}>
          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--ink)" }}>MTA-STS</strong> (Mail Transfer Agent Strict Transport Security) forces sending servers to use TLS when delivering email to your domain,
            preventing downgrade attacks. It requires a DNS record, a hosted policy file, and optionally a <strong>TLS-RPT</strong> record to receive failure reports.
          </p>
        </div>

        {/* Input */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>Domain</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input className="input" type="text" value={domain} onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup()}
              placeholder="yourdomain.com"
              style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, flex: 1 }} />
            <button onClick={lookup} disabled={loading || !domain.trim()} className="btn btn-primary"
              style={{ padding: "10px 22px", fontSize: 13, flexShrink: 0, display: "flex", alignItems: "center", gap: 7 }}>
              {loading
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : "Check MTA-STS"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 13, marginBottom: 14 }}>
            <XCircle size={14} /> {error}
          </div>
        )}

        {result && !loading && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Score */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <ScoreRing score={result.score} verdict={result.verdict} />
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "var(--ink-4)" }}>{result.domain}</div>
              </div>
            </div>

            {/* DNS Record */}
            {result.stsRecord && (
              <div className="card" style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>_mta-sts DNS record</p>
                <code style={{ display: "block", fontFamily: "'Geist Mono', monospace", fontSize: 12, padding: "12px 14px", borderRadius: 8, background: "var(--paper-2)", border: "1px solid var(--border)", wordBreak: "break-all", lineHeight: 1.8, color: "var(--ink)" }}>{result.stsRecord}</code>
              </div>
            )}

            {/* Policy file */}
            {result.policyFile && (
              <div className="card" style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>Policy file</p>
                <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>{result.policyFile.url}</p>
                <pre style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, padding: "12px 14px", borderRadius: 8, background: "var(--paper-2)", border: "1px solid var(--border)", overflowX: "auto", lineHeight: 1.8, color: "var(--ink)", margin: 0 }}>{result.policyFile.body}</pre>
              </div>
            )}

            {/* TLS-RPT */}
            {result.tlsRptRecord && (
              <div className="card" style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>TLS-RPT record</p>
                <code style={{ display: "block", fontFamily: "'Geist Mono', monospace", fontSize: 12, padding: "12px 14px", borderRadius: 8, background: "var(--paper-2)", border: "1px solid var(--border)", wordBreak: "break-all", lineHeight: 1.8, color: "var(--ink)" }}>{result.tlsRptRecord}</code>
              </div>
            )}

            {/* Analysis */}
            {result.analysis.length > 0 && (
              <div className="card" style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Analysis</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.analysis.map((item, i) => {
                    const meta = STATUS_META[item.status] || STATUS_META.info;
                    return (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)" }}>
                        <StatusIcon s={item.status} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{item.label}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 100, color: meta.color, background: meta.bg, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{meta.label}</span>
                          </div>
                          <code style={{ display: "block", fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "var(--ink-3)", marginTop: 3, wordBreak: "break-all" }}>{item.value}</code>
                          <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 3, lineHeight: 1.5 }}>{item.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="card" style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--red)", marginBottom: 12 }}>Issues to fix</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.issues.map((issue, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", borderRadius: 8, background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
                      <XCircle size={14} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 13, color: "var(--red)" }}>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="card" style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Recommendations</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.tips.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", borderRadius: 8, background: "var(--yellow-dim)", border: "1px solid rgba(146,96,10,0.2)" }}>
                      <AlertTriangle size={14} style={{ color: "var(--yellow)", flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 13, color: "var(--yellow)" }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Setup guide if not configured */}
            {result.verdict === "not-configured" && (
              <div className="card" style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Setup guide</p>
                <ol style={{ fontSize: 13, color: "var(--ink-3)", paddingLeft: 20, lineHeight: 2 }}>
                  <li>Create a subdomain <code style={{ fontFamily: "monospace", fontSize: 12 }}>mta-sts.{result.domain}</code> with an HTTPS certificate</li>
                  <li>Host a policy file at <code style={{ fontFamily: "monospace", fontSize: 12 }}>https://mta-sts.{result.domain}/.well-known/mta-sts.txt</code></li>
                  <li>Policy file contents:<br />
                    <pre style={{ fontFamily: "monospace", fontSize: 12, background: "var(--paper-2)", border: "1px solid var(--border)", padding: "10px 12px", borderRadius: 6, marginTop: 6, lineHeight: 1.8 }}>{`version: STSv1
mode: testing
mx: mail.${result.domain}
max_age: 604800`}</pre>
                  </li>
                  <li>Add DNS TXT record at <code style={{ fontFamily: "monospace", fontSize: 12 }}>_mta-sts.{result.domain}</code>:<br />
                    <code style={{ fontFamily: "monospace", fontSize: 12, background: "var(--paper-2)", border: "1px solid var(--border)", padding: "6px 10px", borderRadius: 6, display: "inline-block", marginTop: 6 }}>v=STSv1; id=20240101000000</code>
                  </li>
                  <li>Add TLS-RPT at <code style={{ fontFamily: "monospace", fontSize: 12 }}>_smtp._tls.{result.domain}</code>:<br />
                    <code style={{ fontFamily: "monospace", fontSize: 12, background: "var(--paper-2)", border: "1px solid var(--border)", padding: "6px 10px", borderRadius: 6, display: "inline-block", marginTop: 6 }}>v=TLSRPTv1; rua=mailto:tls-reports@{result.domain}</code>
                  </li>
                  <li>After verifying in testing mode, change to <code style={{ fontFamily: "monospace", fontSize: 12 }}>mode: enforce</code></li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

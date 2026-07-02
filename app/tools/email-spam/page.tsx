"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, FileText } from "lucide-react";

interface TriggerHit {
  word: string;
  weight: number;
  category: string;
  count: number;
}

interface ContentIssue {
  label: string;
  detail: string;
  severity: "high" | "medium" | "low";
  points: number;
}

interface SpamResult {
  isHtml: boolean;
  wordCount: number;
  linkCount: number;
  hasUnsubscribeLink: boolean;
  imageCount: number;
  capsRatio: number;
  exclamationCount: number;
  triggerHits: TriggerHit[];
  triggersByCategory: Record<string, TriggerHit[]>;
  issues: ContentIssue[];
  subjectIssues: string[];
  spamScore: number;
  deliverabilityScore: number;
  verdict: "clean" | "risky" | "likely-spam" | "spam";
}

const SEVERITY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  high:   { color: "var(--red)",    bg: "var(--red-dim)",    border: "var(--red-border)" },
  medium: { color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(146,96,10,0.2)" },
  low:    { color: "var(--ink-3)",  bg: "var(--paper-3)",    border: "var(--border)" },
};

const VERDICT_META = {
  clean:        { color: "var(--green)",  label: "Clean",         bg: "var(--green-dim)" },
  risky:        { color: "var(--yellow)", label: "Risky",         bg: "var(--yellow-dim)" },
  "likely-spam":{ color: "#d97706",       label: "Likely Spam",   bg: "rgba(217,119,6,0.1)" },
  spam:         { color: "var(--red)",    label: "Spam",          bg: "var(--red-dim)" },
};

function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const r = 44, circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = score >= 80 ? "var(--green)" : score >= 60 ? "var(--yellow)" : "var(--red)";
  const meta = VERDICT_META[verdict as keyof typeof VERDICT_META] || VERDICT_META.spam;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-3)" strokeWidth="7" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 24, fontWeight: 700, lineHeight: 1, color: col }}>{score}</span>
          <span style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 1 }}>/100</span>
        </div>
      </div>
      <div>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100, color: meta.color, background: meta.bg, letterSpacing: "0.05em", textTransform: "uppercase" }}>{meta.label}</span>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginTop: 8 }}>Deliverability score</p>
        <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>Higher = more likely to land in inbox</p>
      </div>
    </div>
  );
}

function StatPill({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)" }}>
      <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", fontFamily: "'Geist Mono', monospace" }}>{value}</span>
        {ok
          ? <CheckCircle2 size={13} style={{ color: "var(--green)" }} />
          : <AlertTriangle size={13} style={{ color: "var(--yellow)" }} />}
      </div>
    </div>
  );
}

const SAMPLE_EMAIL = `Hi {{first_name}},

I noticed that your company is scaling its sales team and wanted to reach out.

We help B2B companies like yours improve email deliverability and inbox placement rates by 40% in the first 30 days.

Would it make sense to hop on a quick 15-minute call this week to see if we could help?

Best,
Sarah

P.S. If this isn't the right fit, feel free to ignore this email.`;

export default function EmailSpamPage() {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpamResult | null>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!content.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/spam-analysis", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), subject: subject.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus, input:focus { outline: none; border-color: var(--ink) !important; box-shadow: 0 0 0 3px rgba(12,12,12,0.07); }
        textarea::placeholder, input::placeholder { color: var(--ink-5); }
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

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--red-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={18} style={{ color: "var(--red)" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>Email Content Spam Test</h1>
            <p style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 2 }}>Analyze email body and subject line for spam triggers, content issues, and deliverability risks</p>
          </div>
        </div>

        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 7 }}>Subject line <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ink-5)" }}>(optional)</span></label>
              <input
                className="input" type="text" value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Your email subject line…"
                style={{ fontSize: 13, width: "100%" }}
              />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)" }}>Email body (HTML or plain text)</label>
                <button onClick={() => setContent(SAMPLE_EMAIL)} style={{ fontSize: 11, color: "var(--ink-4)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 4 }}>Load sample</button>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste your email body here — HTML or plain text…"
                rows={10}
                style={{ width: "100%", fontFamily: "'Geist Mono', monospace", fontSize: 12, lineHeight: 1.7, padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink)", resize: "vertical" }}
              />
              <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 6 }}>
                Paste the full email body. Works with HTML or plain text. Content is analyzed locally and not stored.
              </p>
            </div>
          </div>

          <button onClick={analyze} disabled={loading || !content.trim()} className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", fontSize: 14, alignSelf: "flex-start" }}>
            {loading
              ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Analyzing…</>
              : "Analyze email"}
          </button>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 13, marginBottom: 14 }}>
            <XCircle size={14} /> {error}
          </div>
        )}

        {result && !loading && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Score */}
            <div className="card" style={{ padding: "24px" }}>
              <ScoreRing score={result.deliverabilityScore} verdict={result.verdict} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 20 }}>
                <StatPill label="Word count" value={`${result.wordCount}`} ok={result.wordCount >= 100} />
                <StatPill label="Links" value={`${result.linkCount}`} ok={result.linkCount <= 3} />
                <StatPill label="Images" value={`${result.imageCount}`} ok={result.imageCount <= 2} />
                <StatPill label="Caps ratio" value={`${result.capsRatio}%`} ok={result.capsRatio < 20} />
                <StatPill label="Exclamations" value={`${result.exclamationCount}`} ok={result.exclamationCount <= 2} />
                <StatPill label="Unsubscribe link" value={result.hasUnsubscribeLink ? "Present" : "Missing"} ok={result.hasUnsubscribeLink} />
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="card" style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Content issues ({result.issues.length})</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.issues.map((issue, i) => {
                    const sc = SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.low;
                    const Icon = issue.severity === "high" ? XCircle : AlertTriangle;
                    return (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 8, background: sc.bg, border: `1px solid ${sc.border}` }}>
                        <Icon size={14} style={{ color: sc.color, flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: sc.color, marginBottom: 2 }}>{issue.label}</p>
                          <p style={{ fontSize: 12, color: sc.color, opacity: 0.85 }}>{issue.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trigger words */}
            {result.triggerHits.length > 0 && (
              <div className="card" style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>Spam trigger words ({result.triggerHits.length} found)</p>
                <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 14 }}>These words and phrases are commonly flagged by spam filters. Consider rephrasing.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.triggerHits.map((hit, i) => {
                    const risk = hit.weight >= 7 ? "var(--red)" : hit.weight >= 5 ? "var(--yellow)" : "var(--ink-4)";
                    const bg = hit.weight >= 7 ? "var(--red-dim)" : hit.weight >= 5 ? "var(--yellow-dim)" : "var(--paper-3)";
                    return (
                      <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, background: bg, border: `1px solid ${hit.weight >= 7 ? "var(--red-border)" : "var(--border)"}` }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: risk }}>{hit.word}</span>
                        {hit.count > 1 && <span style={{ fontSize: 10, color: risk, opacity: 0.7 }}>×{hit.count}</span>}
                        <span style={{ fontSize: 10, color: "var(--ink-4)", marginLeft: 2 }}>{hit.category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All clear */}
            {result.issues.length === 0 && result.triggerHits.length === 0 && (
              <div className="card" style={{ padding: "20px 24px", borderLeft: "3px solid var(--green)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={18} style={{ color: "var(--green)", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--green)", marginBottom: 4 }}>Content looks clean</p>
                    <p style={{ fontSize: 13, color: "var(--ink-3)" }}>No spam triggers or content issues detected. Good deliverability signal.</p>
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

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle,
  Copy, Check, Shield, ExternalLink, ChevronDown,
  RefreshCw, Mail, Clock, Zap, Globe, Lock, BarChart3,
  Inbox, ArrowRight
} from "lucide-react";
import type { DnsCheck } from "@/lib/types";

type Stage = "form" | "waiting" | "result";
type Folder = "inbox" | "promotions" | "spam";

interface TestState {
  id: string;
  domain: string;
  seedEmail: string;
  score: number;
  checks: DnsCheck[];
}

// Checks + score come from start-test (TestState); result only carries placement
interface Result {
  verdict: "inbox" | "spam";
  folder: Folder;
}

// ── Small components ──────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
        border: `1px solid ${done ? "var(--green)" : "var(--border-2)"}`,
        background: done ? "var(--green-dim)" : "var(--paper-2)",
        color: done ? "var(--green)" : "var(--ink-3)",
        transition: "all 0.15s",
      }}
    >
      {done ? <Check size={11} /> : <Copy size={11} />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function StatusIcon({ s }: { s: DnsCheck["status"] }) {
  if (s === "pass") return <CheckCircle2 size={15} style={{ color: "var(--green)", flexShrink: 0 }} />;
  if (s === "fail") return <XCircle size={15} style={{ color: "var(--red)", flexShrink: 0 }} />;
  return <AlertTriangle size={15} style={{ color: "var(--yellow)", flexShrink: 0 }} />;
}

function CheckRow({ c }: { c: DnsCheck }) {
  const [open, setOpen] = useState(false);
  const sc = { pass: "var(--green)", fail: "var(--red)", warn: "var(--yellow)" }[c.status];
  const bg = { pass: "var(--green-dim)", fail: "var(--red-dim)", warn: "var(--yellow-dim)" }[c.status];
  const CheckIc = c.label.includes("Blacklist") ? Globe : c.label.includes("DKIM") || c.label.includes("TLS") ? Lock : c.label.includes("Reverse") ? Zap : c.label.includes("Reputation") ? BarChart3 : Shield;

  return (
    <div className="check-row" style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", cursor: "pointer" }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--paper)" }}>
        <StatusIcon s={c.status} />
        <CheckIc size={12} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: "var(--ink)" }}>{c.label}</span>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "none" }} id={`val-${c.label}`}>{c.value}</span>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, color: sc, background: bg, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{c.status}</span>
        <ChevronDown size={13} style={{ color: "var(--ink-4)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </div>
      {open && (
        <div className="fade-in" style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--paper-2)" }}>
          <code className="mono" style={{ display: "block", fontSize: 11, padding: "8px 12px", borderRadius: 6, background: bg, color: sc, marginBottom: 10, wordBreak: "break-all" }}>{c.value}</code>
          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65 }}>{c.detail}</p>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 38, circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = score >= 70 ? "var(--green)" : score >= 45 ? "var(--yellow)" : "var(--red)";
  return (
    <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-3)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          className="score-ring" style={{ "--dash": off } as React.CSSProperties} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span className="mono" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: col }}>{score}</span>
        <span style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 1 }}>/100</span>
      </div>
    </div>
  );
}

// ── Stages ────────────────────────────────────────────────────────────────────

function FormStage({ onSubmit }: { onSubmit: (domain: string) => Promise<void> }) {
  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const go = async () => {
    if (!val.trim()) return;
    setErr(""); setLoading(true);
    try { await onSubmit(val.trim()); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : "Something went wrong"); setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }} className="fade-up">
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 38, height: 38, background: "var(--red-dim)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Inbox size={17} style={{ color: "var(--red)" }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15 }}>Inbox Placement Test</p>
            <p style={{ fontSize: 12, color: "var(--ink-4)" }}>Free · No account · ~15 seconds</p>
          </div>
        </div>

        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Your domain or email address
        </label>
        <input
          className="input"
          type="text"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && go()}
          placeholder="yourcompany.com or you@company.com"
          style={{ marginBottom: 16 }}
        />

        {err && (
          <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, background: "var(--red-dim)", color: "var(--red)", fontSize: 13, marginBottom: 16 }}>
            <AlertTriangle size={13} /> {err}
          </div>
        )}

        <button onClick={go} disabled={loading || !val.trim()} className="btn btn-red" style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 14 }}>
          {loading
            ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", flexShrink: 0 }} className="spin" /> Setting up…</>
            : <><Flame size={14} /> Start free test</>
          }
        </button>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 12, background: "var(--paper-2)" }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)", marginBottom: 14 }}>What happens</p>
        {[
          { icon: Zap, t: "We generate a unique seed email address" },
          { icon: Mail, t: "You send one email from your real setup" },
          { icon: Inbox, t: "We detect which folder it lands in" },
          { icon: BarChart3, t: "Full DNS + deliverability report" },
        ].map(({ icon: I, t }) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-3)", marginBottom: 10 }}>
            <I size={13} style={{ color: "var(--red)", flexShrink: 0 }} /> {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function WaitingStage({ test, elapsed, onForce }: { test: TestState; elapsed: number; onForce: () => void }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }} className="fade-up">
      <div className="card" style={{ padding: 32 }}>
        {/* Spinning icon */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 16px" }}>
            <div style={{ width: 56, height: 56, background: "var(--red-dim)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={22} style={{ color: "var(--red)" }} />
            </div>
            <div style={{ position: "absolute", inset: -6, borderRadius: 20, border: "2px dashed var(--red)", opacity: 0.3, animation: "spin 4s linear infinite" }} />
          </div>
          <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Send your test email</p>
          <p style={{ fontSize: 13, color: "var(--ink-3)" }}>We're listening — send from your real setup to the address below</p>
        </div>

        {/* Seed address */}
        <div style={{ padding: 16, borderRadius: 10, background: "var(--paper-2)", border: "1px solid var(--border)", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Send your test email to</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <code className="mono" style={{ fontSize: 13, color: "var(--red)", flex: 1, wordBreak: "break-all", fontWeight: 500 }}>{test.seedEmail}</code>
            <CopyBtn text={test.seedEmail} />
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 24 }}>
          {[
            "Open your email client, ESP, or SMTP tool",
            `Send from your ${test.domain} address`,
            "Subject & body don't matter — any content works",
            "Result appears here within 15–30 seconds",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12, fontSize: 13, color: "var(--ink-3)" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--red)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </div>
              {t}
            </div>
          ))}
        </div>

        {/* Timer */}
        <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-4)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", display: "inline-block", animation: "blink-dot 1.5s ease-in-out infinite" }} />
              Listening for your email
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--ink-4)" }}>
              <Clock size={11} /> {Math.floor(elapsed / 1000)}s
            </div>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: "var(--paper-3)", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--red)", borderRadius: 2, width: `${Math.min(95, (elapsed / 300000) * 100)}%`, transition: "width 1s linear" }} />
          </div>
        </div>

        {elapsed > 60000 && (
          <button onClick={onForce} style={{ width: "100%", marginTop: 16, padding: "10px", borderRadius: 8, border: "1px solid var(--border-2)", background: "transparent", fontSize: 13, color: "var(--ink-4)", cursor: "pointer" }}>
            Taking too long? Show results anyway →
          </button>
        )}
      </div>

      {/* DNS preview */}
      <div className="card" style={{ padding: 20, marginTop: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)", marginBottom: 14 }}>
          DNS pre-check — {test.domain}
        </p>
        {test.checks.slice(0, 4).map(c => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <StatusIcon s={c.status} />
            <span style={{ fontSize: 13, flex: 1, color: "var(--ink-2)" }}>{c.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.status === "pass" ? "var(--green)" : c.status === "fail" ? "var(--red)" : "var(--yellow)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultStage({ result, test, onReset }: { result: Result; test: TestState; onReset: () => void }) {
  const inboxed = result.folder !== "spam";
  const folderLabel = result.folder === "inbox" ? "Likely Primary Inbox" : result.folder === "promotions" ? "Promotions Risk" : "Spam Risk";
  const folderColor = result.folder === "spam" ? "var(--red)" : result.folder === "promotions" ? "var(--yellow)" : "var(--green)";
  const folderBg = result.folder === "spam" ? "var(--red-dim)" : result.folder === "promotions" ? "var(--yellow-dim)" : "var(--green-dim)";
  const FolderIc = result.folder === "spam" ? XCircle : result.folder === "promotions" ? AlertTriangle : CheckCircle2;
  const score = test.score;
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : score >= 35 ? "D" : "F";
  const pass = test.checks.filter(c => c.status === "pass").length;
  const warn = test.checks.filter(c => c.status === "warn").length;
  const fail = test.checks.filter(c => c.status === "fail").length;
  const needsFix = test.checks.filter(c => c.status !== "pass");

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }} className="fade-up">
      {/* Main verdict */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", background: folderBg, borderBottom: `2px solid ${folderColor}`, display: "flex", alignItems: "center", gap: 14 }}>
          <FolderIc size={24} style={{ color: folderColor, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 18, color: folderColor, marginBottom: 3 }}>{folderLabel}</p>
            <p style={{ fontSize: 13, color: "var(--ink-3)" }}>
              DNS &amp; authentication analysis for <strong style={{ color: "var(--ink)" }}>{test.domain}</strong>
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ScoreRing score={score} />
            <div style={{ textAlign: "center" }}>
              <div className="serif" style={{ fontSize: 40, lineHeight: 1, color: folderColor }}>{grade}</div>
              <div style={{ fontSize: 10, color: "var(--ink-4)" }}>Grade</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)" }}>
          {[{ n: pass, l: "Passed", c: "var(--green)" }, { n: warn, l: "Warnings", c: "var(--yellow)" }, { n: fail, l: "Failed", c: "var(--red)" }].map(({ n, l, c }, i) => (
            <div key={l} style={{ flex: 1, padding: "14px 20px", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
              <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: c, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Checks */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {test.checks.map(c => <CheckRow key={c.label} c={c} />)}
        </div>
      </div>

      {/* Recommendation */}
      {(!inboxed || score < 65) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* What's happening — useful first */}
          <div className="card" style={{ padding: 24, borderLeft: `3px solid var(--red)` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <Flame size={18} style={{ color: "var(--red)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--red)", marginBottom: 8 }}>
                  {result.folder === "spam" ? "Your email landed in spam." : "Not reaching the primary inbox."}
                </p>
                {result.folder === "spam" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
                      Spam placement means recipients never see your email. Open rates collapse, replies stop, and continued sending from a burned domain makes recovery slower.
                    </p>
                    <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
                      Start with the issues flagged in the diagnostic below — fix authentication first, then check for blacklist entries. If the domain has a long history of poor sending, DNS fixes alone may not be enough to recover quickly.
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
                    Promotions tab means lower visibility and engagement. Usually caused by missing authentication records, low domain engagement history, or content triggers. Fix the flagged issues below and retest.
                  </p>
                )}
              </div>
            </div>
            <button onClick={onReset} className="btn btn-ghost" style={{ fontSize: 13 }}>
              <RefreshCw size={13} /> Test another domain
            </button>
          </div>

          {/* Fresh start option — only after confirmed spam, written as honest advice */}
          {result.folder === "spam" && (
            <div className="card" style={{ padding: "18px 22px", background: "var(--paper-2)" }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 10 }}>
                If the domain is too damaged to recover
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 12 }}>
                Recovering a burned domain can take weeks to months. Some teams find it faster to use a fresh domain with established sending history rather than waiting — especially if campaigns can't pause.
              </p>
              <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, borderBottom: "1px solid var(--border-2)", paddingBottom: 1 }}>
                WarmInboxes — pre-warmed domains and inboxes <ExternalLink size={11} />
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: 24, borderLeft: "3px solid var(--green)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
            <CheckCircle2 size={18} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "var(--green)", marginBottom: 6 }}>Inbox confirmed.</p>
              <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
                Your email reached the primary inbox. Deliverability can shift quietly — test again before major campaigns and keep authentication records up to date.
              </p>
            </div>
          </div>
          <button onClick={onReset} className="btn btn-ghost" style={{ fontSize: 13 }}>
            <RefreshCw size={13} /> Test another domain
          </button>
        </div>
      )}

      {/* What to fix */}
      {needsFix.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>What to fix first</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {needsFix.sort(a => a.status === "fail" ? -1 : 1).map(c => (
              <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderRadius: 8, background: "var(--paper-2)", border: "1px solid var(--border)" }}>
                <StatusIcon s={c.status} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "var(--ink)" }}>{c.label}</p>
                  <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6 }}>{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TestPage() {
  const [stage, setStage] = useState<Stage>("form");
  const [test, setTest] = useState<TestState | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  const stop = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const getResult = useCallback(async (t: TestState, el: number) => {
    const res = await fetch(`/api/check-result?id=${t.id}&domain=${encodeURIComponent(t.domain)}&elapsed=${el}&score=${t.score}`);
    const data = await res.json();
    if (data.status === "received") {
      stop();
      setResult(data);
      setStage("result");
    }
  }, [stop]);

  const startPolling = useCallback((t: TestState) => {
    startRef.current = Date.now();
    tickRef.current = setInterval(() => setElapsed(Date.now() - startRef.current), 1000);
    pollRef.current = setInterval(() => getResult(t, Date.now() - startRef.current), 3000);
  }, [getResult]);

  const handleSubmit = async (raw: string) => {
    const domain = raw.includes("@") ? raw.split("@")[1] : raw.replace(/^https?:\/\//, "").split("/")[0].toLowerCase().trim();
    const res = await fetch("/api/start-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });
    if (!res.ok) throw new Error("Failed to start test. Try again.");
    const data = await res.json();
    const t: TestState = { id: data.id, domain: data.domain, seedEmail: data.seedEmail, score: data.score, checks: data.checks };
    setTest(t);
    setElapsed(0);
    setStage("waiting");
    startPolling(t);
  };

  const handleForce = async () => {
    if (!test) return;
    stop();
    const res = await fetch(`/api/check-result?id=${test.id}&domain=${encodeURIComponent(test.domain)}&elapsed=15000&score=${test.score}`);
    const data = await res.json();
    setResult(data);
    setStage("result");
  };

  const handleReset = () => {
    stop();
    setStage("form");
    setTest(null);
    setResult(null);
    setElapsed(0);
  };

  const stageIdx = stage === "form" ? 0 : stage === "waiting" ? 1 : 2;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, background: "var(--red)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={14} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px", color: "var(--ink)" }}>
              burned<span style={{ color: "var(--red)" }}>inbox</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
              <ArrowLeft size={13} /> Back
            </Link>
            {stage !== "form" && (
              <button onClick={handleReset} className="btn btn-ghost" style={{ fontSize: 13, padding: "6px 12px" }}>
                <RefreshCw size={13} /> New test
              </button>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 2, background: "var(--border)" }}>
          <div style={{ height: "100%", background: "var(--red)", transition: "width 0.5s ease", width: stageIdx === 0 ? "10%" : stageIdx === 1 ? "50%" : "100%" }} />
        </div>
      </nav>

      {/* Step indicators */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--paper)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 8 }}>
          {[{ l: "Setup" }, { l: "Send Email" }, { l: "Results" }].map(({ l }, i) => {
            const active = stageIdx === i, done = stageIdx > i;
            return (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <div style={{ width: 24, height: 1, background: done ? "var(--red)" : "var(--border-2)" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? "var(--green)" : active ? "var(--red)" : "var(--paper-3)", color: done || active ? "#fff" : "var(--ink-4)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {done ? <Check size={10} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--ink)" : "var(--ink-4)" }}>{l}</span>
                </div>
              </div>
            );
          })}
          {stage === "waiting" && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--ink-4)" }}>
              <Clock size={11} /> {Math.floor(elapsed / 1000)}s
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}>
        {stage === "form" && <FormStage onSubmit={handleSubmit} />}
        {stage === "waiting" && test && <WaitingStage test={test} elapsed={elapsed} onForce={handleForce} />}
        {stage === "result" && result && test && <ResultStage result={result} test={test} onReset={handleReset} />}
      </main>

      <div style={{ textAlign: "center", paddingBottom: 32, fontSize: 12, color: "var(--ink-4)" }}>
        Questions? All tools on BurnedInbox are free — no account required.
      </div>
    </div>
  );
}

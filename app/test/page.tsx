"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle,
  Check, Shield, ExternalLink, ChevronDown,
  RefreshCw, Mail, Zap, Globe, Lock, BarChart3, Inbox,
} from "lucide-react";
import { track, rememberDiagnosis, type DiagnosisClass } from "@/lib/track";
import type { DnsCheck } from "@/lib/types";

type Stage = "form" | "result";

interface TestState {
  id: string;
  domain: string;
  score: number;
  checks: DnsCheck[];
}

// ── Small components ──────────────────────────────────────────────────────────

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
            <p style={{ fontWeight: 600, fontSize: 15 }}>Free Authentication + Blacklist Check</p>
            <p style={{ fontSize: 12, color: "var(--ink-4)" }}>Free · No account · Results in seconds</p>
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
            ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", flexShrink: 0 }} className="spin" /> Checking…</>
            : <><Flame size={14} /> Check my domain</>
          }
        </button>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 12, background: "var(--paper-2)" }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)", marginBottom: 14 }}>What happens</p>
        {[
          { icon: Shield, t: "SPF, DKIM and DMARC checked live against your DNS" },
          { icon: Globe, t: "Domain blacklists checked (SURBL, Spamhaus DBL)" },
          { icon: BarChart3, t: "A 0–100 health score with what to fix first" },
          { icon: Mail, t: "How to check placement yourself, in your own inbox" },
        ].map(({ icon: I, t }) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-3)", marginBottom: 10 }}>
            <I size={13} style={{ color: "var(--red)", flexShrink: 0 }} /> {t}
          </div>
        ))}
        <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>
          Free placement tests across Gmail, Outlook, Yahoo and iCloud are coming soon.
        </p>
      </div>
    </div>
  );
}

function diagnose(test: TestState): DiagnosisClass {
  const failed = (re: RegExp) => test.checks.some(c => re.test(c.label) && c.status === "fail");
  const blacklist = test.checks.find(c => /blacklist/i.test(c.label));
  if (blacklist?.status === "fail") return "consider_replacement";
  if (blacklist?.status === "warn" && / listed/.test(blacklist.value)) return "investigate_reputation";
  if (failed(/SPF|DKIM|DMARC/)) return "repair_dns";
  if (test.score >= 80) return "healthy";
  return "inconclusive";
}

const reportedTests = new Set<string>();

function reportResult(test: TestState) {
  if (reportedTests.has(test.id)) return;
  reportedTests.add(test.id);
  const diagnosis_class = diagnose(test);
  rememberDiagnosis(diagnosis_class);
  track("bi_diagnostic_complete", { tool_name: "domain_check", diagnosis_class, score_band: test.score >= 80 ? "80+" : test.score >= 45 ? "45-79" : "0-44" });
  track("bi_diagnostic_outcome", { tool_name: "domain_check", diagnosis_class });
  if (diagnosis_class === "consider_replacement") {
    track("bi_replacement_recommended", { tool_name: "domain_check", recommendation_reason: "domain_blacklisted" });
  }
}

function SelfTestCard() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Now check where your email actually lands</p>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: "var(--red-dim)", color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Free placement tests coming soon</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 14 }}>
        This check reads your DNS; it doesn&apos;t send an email. To see placement today, send a test to your own inboxes:
      </p>
      <ol style={{ margin: "0 0 14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          <>From the inbox you send campaigns with, email a <strong>personal Gmail</strong> and a <strong>personal Outlook.com</strong> address (not addresses on this domain).</>,
          <>Use your real campaign copy, links and signature, so you test what prospects will get.</>,
          <>Check where it lands: Gmail <strong>Primary, Promotions or Spam</strong>; Outlook <strong>Focused, Other or Junk</strong>.</>,
          <>In Gmail, open the message, choose <strong>Show original</strong>, and confirm SPF, DKIM and DMARC all say <strong>PASS</strong>.</>,
        ].map((t, i) => (
          <li key={i} style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65 }}>{t}</li>
        ))}
      </ol>
      <p style={{ fontSize: 12, color: "var(--ink-4)", lineHeight: 1.6 }}>
        One inbox is one data point: your own mailbox already knows you, so a prospect&apos;s may filter differently. Free placement tests across Gmail, Outlook, Yahoo and iCloud seed inboxes are coming soon.
      </p>
    </div>
  );
}

function ResultStage({ test, onReset, onRetest }: { test: TestState; onReset: () => void; onRetest: () => void }) {
  const failCount = test.checks.filter(c => c.status === "fail").length;
  const level = failCount > 0 || test.score < 45 ? "risk" : test.score < 80 ? "attention" : "healthy";
  const verdictLabel = level === "healthy" ? "Domain looks healthy" : level === "attention" ? "Needs attention" : "Domain at risk";
  const folderColor = level === "risk" ? "var(--red)" : level === "attention" ? "var(--yellow)" : "var(--green)";
  const folderBg = level === "risk" ? "var(--red-dim)" : level === "attention" ? "var(--yellow-dim)" : "var(--green-dim)";
  const FolderIc = level === "risk" ? XCircle : level === "attention" ? AlertTriangle : CheckCircle2;
  const diagnosis = diagnose(test);
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
            <p style={{ fontWeight: 700, fontSize: 18, color: folderColor, marginBottom: 3 }}>{verdictLabel}</p>
            <p style={{ fontSize: 13, color: "var(--ink-3)" }}>
              Authentication &amp; blacklist check for <strong style={{ color: "var(--ink)" }}>{test.domain}</strong>
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

      <p style={{ fontSize: 12, color: "var(--ink-4)", lineHeight: 1.6, padding: "0 4px" }}>
        <strong style={{ color: "var(--ink-3)" }}>What this checks:</strong> live DNS lookups of your SPF, DKIM and DMARC records and domain blacklists. It doesn&apos;t send an email or measure where yours lands, so it isn&apos;t a placement result.
      </p>

      {/* Recommendation */}
      {level !== "healthy" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="card" style={{ padding: 24, borderLeft: `3px solid ${folderColor}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <Flame size={18} style={{ color: folderColor, flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: folderColor, marginBottom: 8 }}>
                  {level === "risk" ? "Fix this before you send more." : "A few things to tighten."}
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
                  {level === "risk"
                    ? "At least one check failed. Authentication failures and domain blacklist listings are the most common reasons cold email goes to spam. Work through the list below, then check again."
                    : "Nothing failed, but some checks could be stronger. See the list below, then check again."}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={onRetest} className="btn btn-primary" style={{ fontSize: 13 }}>
                <RefreshCw size={13} /> Check {test.domain} again
              </button>
              <button onClick={onReset} className="btn btn-ghost" style={{ fontSize: 13 }}>
                Check another domain
              </button>
            </div>
          </div>

          {diagnosis === "consider_replacement" && (
          <div className="card" style={{ padding: "20px 24px", background: "var(--ink)", border: "none" }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
              Need to start sending again quickly?
            </p>
            <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.65, marginBottom: 14 }}>
              This domain is on a domain blacklist. Delisting takes time, and the fastest way to keep campaigns running is fresh infrastructure. Get pre-warmed inboxes from WarmInboxes — <strong>free domains included</strong> — and keep sending while this domain recovers.
            </p>
            <a href="https://warminboxes.com" target="_blank" rel="noopener" data-cta="result-replace"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink)", background: "#fff", padding: "9px 16px", borderRadius: 8, textDecoration: "none" }}>
              Get pre-warmed inboxes <ExternalLink size={12} />
            </a>
          </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="card" style={{ padding: 24, borderLeft: "3px solid var(--green)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <CheckCircle2 size={18} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--green)", marginBottom: 6 }}>Your domain setup looks healthy.</p>
                <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
                  Authentication passes and the domain isn&apos;t on the blacklists that answered. That rules out the setup problems that most often send cold email to spam. Placement still depends on your list, content and sending volume, so check it in your own inbox below.
                </p>
              </div>
            </div>
            <button onClick={onReset} className="btn btn-ghost" style={{ fontSize: 13 }}>
              <RefreshCw size={13} /> Check another domain
            </button>
          </div>

          <div className="card" style={{ padding: "18px 22px", background: "var(--paper-2)" }}>
            <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--ink)" }}>Keep a backup ready.</strong> Healthy domains still burn — volume spikes, list issues, one bad campaign. Fresh inboxes from{" "}
              <a href="https://warminboxes.com" target="_blank" rel="noopener" data-cta="result-backup" style={{ color: "var(--ink)", fontWeight: 600 }}>WarmInboxes</a>{" "}
              on standby mean you can switch over in a day instead of pausing campaigns for weeks.
            </p>
          </div>
        </div>
      )}

      <SelfTestCard />

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

  const handleSubmit = async (raw: string) => {
    const domain = raw.includes("@") ? raw.split("@")[1] : raw.replace(/^https?:\/\//, "").split("/")[0].toLowerCase().trim();
    track("bi_diagnostic_start", { tool_name: "domain_check" });
    const res = await fetch("/api/start-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });
    if (!res.ok) throw new Error("The check failed. Try again.");
    const data = await res.json();
    const t: TestState = { id: data.id, domain: data.domain, score: data.score, checks: data.checks };
    reportResult(t);
    setTest(t);
    setStage("result");
  };

  const handleRetest = async () => {
    if (!test) return;
    await handleSubmit(test.domain);
  };

  const handleReset = () => {
    setStage("form");
    setTest(null);
  };

  const stageIdx = stage === "form" ? 0 : 1;

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
          <div style={{ height: "100%", background: "var(--red)", transition: "width 0.5s ease", width: stageIdx === 0 ? "10%" : "100%" }} />
        </div>
      </nav>

      {/* Step indicators */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--paper)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 8 }}>
          {[{ l: "Your domain" }, { l: "Results" }].map(({ l }, i) => {
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
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}>
        {stage === "form" && <FormStage onSubmit={handleSubmit} />}
        {stage === "result" && test && <ResultStage test={test} onReset={handleReset} onRetest={handleRetest} />}
      </main>

      <div style={{ textAlign: "center", paddingBottom: 32, fontSize: 12, color: "var(--ink-4)" }}>
        Questions? All tools on BurnedInbox are free — no account required.
      </div>
    </div>
  );
}

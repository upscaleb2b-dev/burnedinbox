"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

const PROVIDERS = [
  { id: "google",    name: "Google Workspace", limit: 15 },
  { id: "microsoft", name: "Microsoft 365",    limit: 10 },
  { id: "azure",     name: "Azure / Outlook",  limit: 2  },
  { id: "smtp",      name: "Custom SMTP",      limit: 50 },
  { id: "zoho",      name: "Zoho Mail",        limit: 20 },
];

function ceil(n: number) { return Math.ceil(n); }
function fmt(n: number)  { return ceil(n).toLocaleString(); }

export default function InboxCountPage() {
  const [dailySends, setDailySends]   = useState(200);
  const [providerId, setProviderId]   = useState("google");
  const [backupPct, setBackupPct]     = useState(25);
  const [warmupPct, setWarmupPct]     = useState(20);

  const provider     = PROVIDERS.find(p => p.id === providerId)!;
  const activeNeeded = ceil(dailySends / provider.limit);
  const backupNeeded = ceil(activeNeeded * backupPct / 100);
  const warmupNeeded = ceil(activeNeeded * warmupPct / 100);
  const totalInboxes = activeNeeded + backupNeeded + warmupNeeded;
  const domainsNeeded = ceil(totalInboxes / 3);
  const costPerMonthLow  = totalInboxes * 6;
  const costPerMonthHigh = totalInboxes * 15;

  const Row = ({ label, val, note, red }: { label: string; val: string; note?: string; red?: boolean }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <span style={{ fontSize: 14, color: "var(--ink-3)" }}>{label}</span>
        {note && <span style={{ fontSize: 11, color: "var(--ink-5)", marginLeft: 8 }}>{note}</span>}
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: red ? "var(--red)" : "var(--ink)" }}>{val}</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input[type=range] { accent-color: var(--red); width: 100%; } select { appearance: none; background: var(--paper); border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-size: 13px; color: var(--ink); width: 100%; cursor: pointer; }`}</style>

      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={13} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>burned<span style={{ color: "var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/tools/infra-calc" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}><ArrowLeft size={13} /> Calculators</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--red)", marginBottom: 10 }}>Calculator</p>
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.3px" }}>Inbox Count Calculator</h1>
          <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.7 }}>How many inboxes do you actually need — active, backup, and in warmup — based on your daily send target.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Inputs */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 20 }}>Your setup</p>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Daily sends target</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{dailySends.toLocaleString()}</span>
              </div>
              <input type="range" min={20} max={2000} step={20} value={dailySends} onChange={e => setDailySends(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}>
                <span>20</span><span>2,000</span>
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", display: "block", marginBottom: 8 }}>Email provider</label>
              <select value={providerId} onChange={e => setProviderId(e.target.value)}>
                {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.limit}/day)</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Backup pool</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{backupPct}%</span>
              </div>
              <input type="range" min={10} max={50} step={5} value={backupPct} onChange={e => setBackupPct(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}>
                <span>10%</span><span>50%</span>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Warmup pipeline</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{warmupPct}%</span>
              </div>
              <input type="range" min={0} max={50} step={5} value={warmupPct} onChange={e => setWarmupPct(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}>
                <span>0%</span><span>50%</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 20 }}>Your inbox count</p>
            <Row label="Active inboxes" val={fmt(activeNeeded)} note={`${provider.limit}/day each`} />
            <Row label="Backup inboxes" val={fmt(backupNeeded)} note={`${backupPct}% reserve`} />
            <Row label="In warmup" val={fmt(warmupNeeded)} note={`${warmupPct}% pipeline`} />
            <Row label="Total inboxes" val={fmt(totalInboxes)} red />
            <Row label="Domains needed" val={fmt(domainsNeeded)} note="max 3 inboxes/domain" />
            <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--paper-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, color: "var(--ink-4)", marginBottom: 4 }}>Estimated monthly cost</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", fontFamily: "'Geist Mono', monospace" }}>${costPerMonthLow.toLocaleString()} – ${costPerMonthHigh.toLocaleString()}</p>
              <p style={{ fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}>Based on $6–15/inbox/month</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: "16px 20px", background: "var(--red-dim)", border: "1px solid var(--red-border)", borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--ink)" }}>Rule of thumb:</strong> Max 3 inboxes per domain. Keep at least 25% of your active pool as pre-warmed backup. If you need inboxes ready without a warmup period, <a href="https://warminboxes.com" target="_blank" style={{ color: "var(--red)", textDecoration: "none", fontWeight: 600 }}>WarmInboxes</a> provides pre-warmed inboxes you can deploy same-day.
          </p>
        </div>
      </div>
    </div>
  );
}

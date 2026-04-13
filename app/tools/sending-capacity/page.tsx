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

function fmt(n: number) { return Math.round(n).toLocaleString(); }

export default function SendingCapacityPage() {
  const [inboxCount, setInboxCount]   = useState(20);
  const [providerId, setProviderId]   = useState("google");
  const [sendDays, setSendDays]       = useState(22);
  const [touches, setTouches]         = useState(3);
  const [safetyPct, setSafetyPct]     = useState(80); // % of limit to actually use

  const provider         = PROVIDERS.find(p => p.id === providerId)!;
  const dailyCapacity    = inboxCount * provider.limit * (safetyPct / 100);
  const monthlyCapacity  = dailyCapacity * sendDays;
  const leadsPerMonth    = Math.floor(monthlyCapacity / touches);
  const leadsPerWeek     = Math.floor(leadsPerMonth / 4);

  const Stat = ({ label, val, sub }: { label: string; val: string; sub?: string }) => (
    <div style={{ padding: "16px", background: "var(--paper-2)", border: "1px solid var(--border)", borderRadius: 10, textAlign: "center" }}>
      <p style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: "var(--red)", lineHeight: 1 }}>{val}</p>
      {sub && <p style={{ fontSize: 11, color: "var(--ink-5)", marginTop: 6 }}>{sub}</p>}
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
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.3px" }}>Sending Capacity Calculator</h1>
          <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.7 }}>See exactly how many leads your current inbox setup can work per week and per month.</p>
        </div>

        <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 20 }}>Your inbox setup</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Active inboxes</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{inboxCount}</span>
              </div>
              <input type="range" min={1} max={200} step={1} value={inboxCount} onChange={e => setInboxCount(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}><span>1</span><span>200</span></div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", display: "block", marginBottom: 8 }}>Provider</label>
              <select value={providerId} onChange={e => setProviderId(e.target.value)}>
                {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.limit}/day)</option>)}
              </select>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Sending days/month</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{sendDays}</span>
              </div>
              <input type="range" min={15} max={26} step={1} value={sendDays} onChange={e => setSendDays(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}><span>15</span><span>26</span></div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Touches per lead</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{touches}</span>
              </div>
              <input type="range" min={1} max={8} step={1} value={touches} onChange={e => setTouches(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}><span>1</span><span>8</span></div>
            </div>
          </div>
          <div style={{ marginTop: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Safety buffer (% of limit used)</label>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{safetyPct}%</span>
            </div>
            <input type="range" min={50} max={100} step={5} value={safetyPct} onChange={e => setSafetyPct(+e.target.value)} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}><span>50% (conservative)</span><span>100% (max)</span></div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <Stat label="Daily sends" val={fmt(dailyCapacity)} sub="across all inboxes" />
          <Stat label="Monthly sends" val={fmt(monthlyCapacity)} sub={`${sendDays} send days`} />
          <Stat label="Leads/month" val={fmt(leadsPerMonth)} sub={`at ${touches} touch${touches > 1 ? "es" : ""}/lead`} />
          <Stat label="Leads/week" val={fmt(leadsPerWeek)} sub="est. average" />
        </div>

        <div style={{ padding: "16px 20px", background: "var(--red-dim)", border: "1px solid var(--red-border)", borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--ink)" }}>Deliverability note:</strong> Running at 100% of provider limits is a reputation risk. Staying at 80% gives you room to absorb sends without triggering volume-based filtering. Check your <a href="/tools/send-limits" style={{ color: "var(--red)", textDecoration: "none", fontWeight: 600 }}>safe sending limits</a> before pushing to max.
          </p>
        </div>
      </div>
    </div>
  );
}

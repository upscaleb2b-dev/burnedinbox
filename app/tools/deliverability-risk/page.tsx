"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

type Level = "low" | "medium" | "high" | "critical";

const RISK_COLOR: Record<Level, string> = {
  low:      "#16a34a",
  medium:   "#d97706",
  high:     "#dc2626",
  critical: "#7c2d12",
};

const RISK_BG: Record<Level, string> = {
  low:      "#f0fdf4",
  medium:   "#fffbeb",
  high:     "#fef2f2",
  critical: "#fff7ed",
};

export default function DeliverabilityRiskPage() {
  const [domainAge, setDomainAge]         = useState(3);   // months
  const [authScore, setAuth]              = useState(3);   // 0=none, 1=spf only, 2=spf+dkim, 3=all three
  const [listQuality, setList]            = useState(2);   // 0=unknown, 1=purchased, 2=scraped/mixed, 3=opt-in
  const [dailySends, setSends]            = useState(40);
  const [inboxesPerDomain, setPerDomain]  = useState(2);
  const [warmupDone, setWarmup]           = useState(1);   // 0=no, 1=partial, 2=full
  const [trackingSetup, setTracking]      = useState(1);   // 0=shared, 1=custom
  const [recentComplaints, setComplaints] = useState(0);   // 0=none, 1=some, 2=many

  // Score each factor (higher = more risk)
  const ageRisk        = domainAge < 1 ? 4 : domainAge < 3 ? 3 : domainAge < 6 ? 2 : domainAge < 12 ? 1 : 0;
  const authRisk       = 3 - authScore;
  const listRisk       = [4, 3, 2, 0][listQuality] ?? 2;
  const volumeRisk     = dailySends > 40 ? 3 : dailySends > 20 ? 2 : dailySends > 10 ? 1 : 0;
  const densityRisk    = inboxesPerDomain > 4 ? 3 : inboxesPerDomain > 3 ? 2 : inboxesPerDomain > 2 ? 1 : 0;
  const warmupRisk     = [3, 2, 0][warmupDone] ?? 2;
  const trackingRisk   = trackingSetup === 0 ? 2 : 0;
  const complaintRisk  = [0, 3, 5][recentComplaints] ?? 0;

  const totalRisk = ageRisk + authRisk + listRisk + volumeRisk + densityRisk + warmupRisk + trackingRisk + complaintRisk;
  const maxRisk   = 24;
  const pct       = Math.round((totalRisk / maxRisk) * 100);

  const level: Level = pct < 25 ? "low" : pct < 50 ? "medium" : pct < 75 ? "high" : "critical";
  const label = { low: "Low risk", medium: "Moderate risk", high: "High risk", critical: "Critical risk" }[level];

  const factors = [
    { label: "Domain age", risk: ageRisk, tip: domainAge < 6 ? "Young domain — expect stricter filtering" : "Good" },
    { label: "Authentication", risk: authRisk, tip: authScore < 3 ? "Set up SPF + DKIM + DMARC" : "All three configured ✓" },
    { label: "List quality", risk: listRisk, tip: listQuality < 3 ? "Opt-in lists dramatically reduce complaints" : "Good" },
    { label: "Send volume", risk: volumeRisk, tip: dailySends > 20 ? "Above safe limit per inbox" : "Within safe range" },
    { label: "Inbox density", risk: densityRisk, tip: inboxesPerDomain > 3 ? "Max 3 inboxes per domain" : "Good" },
    { label: "Warmup", risk: warmupRisk, tip: warmupDone < 2 ? "Incomplete warmup raises risk significantly" : "Fully warmed ✓" },
    { label: "Tracking domain", risk: trackingRisk, tip: trackingSetup === 0 ? "Use a custom tracking domain" : "Custom domain ✓" },
    { label: "Complaint history", risk: complaintRisk, tip: recentComplaints > 0 ? "Past complaints compound quickly" : "Clean ✓" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input[type=range]{accent-color:var(--red);width:100%} select{appearance:none;background:var(--paper);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-size:13px;color:var(--ink);width:100%;cursor:pointer}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Calculators</Link>
      </nav>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"48px 24px 80px" }}>
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.08em", color:"var(--red)", marginBottom:8 }}>Calculator</p>
          <h1 style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", color:"var(--ink)", marginBottom:10, letterSpacing:"-0.3px" }}>Deliverability Risk Planner</h1>
          <p style={{ fontSize:15, color:"var(--ink-3)", lineHeight:1.7 }}>Score your current setup across 8 risk factors to see where you're exposed — before campaigns start burning.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          {/* Inputs */}
          <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
            <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:20 }}>Your setup</p>

            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>Domain age (months)</label>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{domainAge}mo</span>
              </div>
              <input type="range" min={0} max={24} value={domainAge} onChange={e => setDomainAge(+e.target.value)} />
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)", display:"block", marginBottom:8 }}>Authentication setup</label>
              <select value={authScore} onChange={e => setAuth(+e.target.value)}>
                <option value={0}>None configured</option>
                <option value={1}>SPF only</option>
                <option value={2}>SPF + DKIM</option>
                <option value={3}>SPF + DKIM + DMARC ✓</option>
              </select>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)", display:"block", marginBottom:8 }}>List quality</label>
              <select value={listQuality} onChange={e => setList(+e.target.value)}>
                <option value={0}>Unknown / no idea</option>
                <option value={1}>Purchased list</option>
                <option value={2}>Scraped / mixed quality</option>
                <option value={3}>Opted-in / verified</option>
              </select>
            </div>

            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>Daily sends per inbox</label>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{dailySends}</span>
              </div>
              <input type="range" min={1} max={60} value={dailySends} onChange={e => setSends(+e.target.value)} />
            </div>

            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>Inboxes per domain</label>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{inboxesPerDomain}</span>
              </div>
              <input type="range" min={1} max={6} value={inboxesPerDomain} onChange={e => setPerDomain(+e.target.value)} />
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)", display:"block", marginBottom:8 }}>Warmup status</label>
              <select value={warmupDone} onChange={e => setWarmup(+e.target.value)}>
                <option value={0}>No warmup done</option>
                <option value={1}>Partial warmup (1–2 weeks)</option>
                <option value={2}>Full warmup (3+ weeks)</option>
              </select>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)", display:"block", marginBottom:8 }}>Tracking domain</label>
              <select value={trackingSetup} onChange={e => setTracking(+e.target.value)}>
                <option value={0}>Shared (tool default)</option>
                <option value={1}>Custom domain</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)", display:"block", marginBottom:8 }}>Recent spam complaints</label>
              <select value={recentComplaints} onChange={e => setComplaints(+e.target.value)}>
                <option value={0}>None that I know of</option>
                <option value={1}>A few complaints</option>
                <option value={2}>Frequent complaints</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Risk gauge */}
            <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24, marginBottom:16, textAlign:"center" }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:16 }}>Risk score</p>
              <div style={{ position:"relative", height:12, background:"var(--border)", borderRadius:6, marginBottom:16, overflow:"hidden" }}>
                <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background: pct < 25 ? "#16a34a" : pct < 50 ? "#d97706" : pct < 75 ? "#dc2626" : "#7c2d12", transition:"width 0.4s ease", borderRadius:6 }} />
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"10px 20px", borderRadius:10, background:RISK_BG[level], border:`1px solid ${RISK_COLOR[level]}30` }}>
                <span style={{ fontSize:32, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:RISK_COLOR[level] }}>{pct}</span>
                <div style={{ textAlign:"left" }}>
                  <p style={{ fontSize:13, fontWeight:700, color:RISK_COLOR[level] }}>{label}</p>
                  <p style={{ fontSize:11, color:"var(--ink-4)" }}>out of 100</p>
                </div>
              </div>
            </div>

            {/* Factor breakdown */}
            <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:16 }}>Risk factors</p>
              {factors.map(({ label, risk, tip }) => (
                <div key={label} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>{label}</span>
                    <span style={{ fontSize:11, color: risk === 0 ? "#16a34a" : risk <= 2 ? "#d97706" : "#dc2626", fontWeight:700 }}>
                      {risk === 0 ? "✓ OK" : risk <= 2 ? "⚠ Medium" : "✕ High"}
                    </span>
                  </div>
                  <p style={{ fontSize:11, color:"var(--ink-4)" }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop:20, padding:"16px 20px", background:"var(--red-dim)", border:"1px solid var(--red-border)", borderRadius:10 }}>
          <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7 }}>
            {level === "critical" || level === "high"
              ? <><strong style={{ color:"var(--ink)" }}>Action needed:</strong> Run a <a href="/test" style={{ color:"var(--red)", fontWeight:600, textDecoration:"none" }}>placement test</a> now and fix your highest-risk factors. If you need clean infrastructure fast, <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ color:"var(--red)", fontWeight:600, textDecoration:"none" }}>WarmInboxes</a> can get you pre-warmed inboxes same-day.</>
              : <><strong style={{ color:"var(--ink)" }}>Looking good</strong> — keep monitoring with weekly <a href="/test" style={{ color:"var(--red)", fontWeight:600, textDecoration:"none" }}>placement tests</a> to catch drift before it becomes a crisis.</>
            }
          </p>
        </div>
      </div>
    </div>
  );
}

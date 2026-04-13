"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString();

export default function BackupBudgetPage() {
  const [activeInboxes, setActive]     = useState(30);
  const [backupPct, setBackupPct]      = useState(25);
  const [inboxCost, setInboxCost]      = useState(10);
  const [domainCost, setDomainCost]    = useState(12);
  const [warmupTool, setWarmupTool]    = useState(97);   // monthly warmup tool cost
  const [incidentsPerYear, setIncidents] = useState(2);
  const [costPerIncident, setCostPer]  = useState(5000);

  const backupInboxes    = Math.ceil(activeInboxes * backupPct / 100);
  const backupDomains    = Math.ceil(backupInboxes / 3);
  const monthlyInboxCost = backupInboxes * inboxCost;
  const annualDomainCost = backupDomains * domainCost;
  const annualWarmup     = warmupTool * 12;
  const annualInboxCost  = monthlyInboxCost * 12;
  const totalAnnualCost  = annualInboxCost + annualDomainCost + annualWarmup;
  const annualRiskCost   = incidentsPerYear * costPerIncident;
  const netProtection    = annualRiskCost - totalAnnualCost;
  const roi              = ((netProtection / totalAnnualCost) * 100);

  const Row = ({ label, val, sub }: { label: string; val: string; sub?: string }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
      <div>
        <span style={{ fontSize:14, color:"var(--ink-3)" }}>{label}</span>
        {sub && <span style={{ fontSize:11, color:"var(--ink-5)", display:"block" }}>{sub}</span>}
      </div>
      <span style={{ fontSize:16, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--ink)" }}>{val}</span>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input[type=range]{accent-color:var(--red);width:100%}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Calculators</Link>
      </nav>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"48px 24px 80px" }}>
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.08em", color:"var(--red)", marginBottom:8 }}>Calculator · Agency</p>
          <h1 style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", color:"var(--ink)", marginBottom:10, letterSpacing:"-0.3px" }}>Backup Infra Budget Calculator</h1>
          <p style={{ fontSize:15, color:"var(--ink-3)", lineHeight:1.7 }}>What should you spend on backup infrastructure — and is it worth it? Compare the cost of maintaining a backup pool vs the cost of being caught without one.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
            <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:20 }}>Your operation</p>
            {([
              { label:"Active inboxes", val:activeInboxes, set:setActive, min:5, max:200 },
              { label:"Backup pool size", val:backupPct, set:setBackupPct, min:10, max:50, suffix:"%" },
              { label:"Cost per inbox / month", val:inboxCost, set:setInboxCost, min:5, max:20, prefix:"$" },
              { label:"Domain cost / year", val:domainCost, set:setDomainCost, min:8, max:25, prefix:"$" },
              { label:"Warmup tool / month", val:warmupTool, set:setWarmupTool, min:0, max:300, prefix:"$" },
              { label:"Incidents per year (est.)", val:incidentsPerYear, set:setIncidents, min:0, max:12 },
              { label:"Avg cost per incident", val:costPerIncident, set:setCostPer, min:500, max:50000, step:500, prefix:"$" },
            ] as { label:string; val:number; set:(v:number)=>void; min:number; max:number; step?:number; prefix?:string; suffix?:string }[]).map(({ label, val, set, min, max, step, prefix, suffix }) => (
              <div key={label} style={{ marginBottom:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>{label}</label>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{prefix||""}{val.toLocaleString()}{suffix||""}</span>
                </div>
                <input type="range" min={min} max={max} step={step||1} value={val} onChange={e => set(+e.target.value)} />
              </div>
            ))}
          </div>

          <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
            <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:20 }}>Annual budget breakdown</p>
            <Row label="Backup inboxes" val={`${fmt(backupInboxes)} inboxes`} sub={`${backupPct}% of ${activeInboxes} active`} />
            <Row label="Backup domains" val={`${fmt(backupDomains)} domains`} sub="max 3 inboxes each" />
            <Row label="Annual inbox cost" val={`$${fmt(annualInboxCost)}`} sub={`$${inboxCost}/inbox × 12 months`} />
            <Row label="Annual domain cost" val={`$${fmt(annualDomainCost)}`} sub="registration / renewal" />
            <Row label="Warmup tool (annual)" val={`$${fmt(annualWarmup)}`} sub="keeping backup warmed" />
            <div style={{ margin:"12px 0", padding:"12px 14px", background:"var(--paper-2)", borderRadius:8, border:"1px solid var(--border)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                <span style={{ fontSize:14, fontWeight:600, color:"var(--ink)" }}>Total annual cost</span>
                <span style={{ fontSize:20, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--ink)" }}>${fmt(totalAnnualCost)}</span>
              </div>
            </div>
            <Row label="Risk without backup (annual)" val={`$${fmt(annualRiskCost)}`} sub={`${incidentsPerYear} incidents × $${costPerIncident.toLocaleString()}`} />
            <div style={{ marginTop:12, padding:"16px", background: netProtection > 0 ? "var(--red-dim)" : "var(--paper-2)", border: netProtection > 0 ? "1px solid var(--red-border)" : "1px solid var(--border)", borderRadius:10, textAlign:"center" }}>
              <p style={{ fontSize:11, color:"var(--ink-4)", marginBottom:4 }}>Net value of backup infra</p>
              <p style={{ fontSize:28, fontWeight:700, fontFamily:"'Geist Mono',monospace", color: netProtection > 0 ? "var(--red)" : "var(--ink)" }}>${fmt(Math.abs(netProtection))}</p>
              <p style={{ fontSize:12, color:"var(--ink-4)", marginTop:4 }}>{netProtection > 0 ? `${fmt(roi)}% ROI on backup spend` : "incidents are infrequent — backup is discretionary"}</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop:20, padding:"16px 20px", background:"var(--red-dim)", border:"1px solid var(--red-border)", borderRadius:10 }}>
          <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7 }}>
            <strong style={{ color:"var(--ink)" }}>Alternative:</strong> Instead of maintaining your own backup pool, <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ color:"var(--red)", fontWeight:600, textDecoration:"none" }}>WarmInboxes</a> gives you on-demand access to pre-warmed inboxes when you need them — no ongoing warmup maintenance required.
          </p>
        </div>
      </div>
    </div>
  );
}

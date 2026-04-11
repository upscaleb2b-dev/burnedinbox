"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, ExternalLink, Zap } from "lucide-react";

function fmt(n: number) { return Math.ceil(n).toLocaleString(); }

export default function EmergencyPage() {
  const [liveCount,    setLiveCount]    = useState(5);
  const [lostInboxes, setLostInboxes]  = useState(10);
  const [dailySends,  setDailySends]   = useState(500);
  const [provider,    setProvider]     = useState("google");
  const [timeline,    setTimeline]     = useState("days");

  const limits: Record<string, number> = { google:15, microsoft:10, azure:2, smtp:50 };
  const sendsPerInbox = limits[provider] || 15;
  const inboxesForVolume = Math.ceil(dailySends / sendsPerInbox);
  const currentCapacity  = liveCount * sendsPerInbox;
  const deficit          = Math.max(0, dailySends - currentCapacity);
  const inboxesNeeded    = Math.ceil(deficit / sendsPerInbox);
  const domainsNeeded    = Math.ceil(inboxesNeeded / 3);
  const backupBuffer     = Math.ceil(inboxesNeeded * 0.3);

  const timeLabel = timeline === "days" ? "within 48 hours" : timeline === "week" ? "within a week" : "within 2 weeks";

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input[type=range]{accent-color:var(--red)} select{appearance:none;background:var(--paper);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-size:13px;color:var(--ink);width:100%;cursor:pointer}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <Zap size={18} style={{ color:"var(--red)" }}/>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px" }}>Emergency Launch Calculator</h1>
        </div>
        <p style={{ fontSize:13, color:"var(--ink-4)", marginBottom:28 }}>Your infra burned. Here's exactly what you need to replace it — right now.</p>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div className="card" style={{ padding:"20px 24px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {[
                { label:"Campaigns still live", value:liveCount, set:setLiveCount, max:50 },
                { label:"Inboxes lost / burned", value:lostInboxes, set:setLostInboxes, max:200 },
                { label:"Daily sends needed", value:dailySends, set:setDailySends, max:10000, step:50 },
              ].map(({ label, value, set, max, step=1 }) => (
                <div key={label}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)" }}>{label}</label>
                    <span style={{ fontSize:15, fontWeight:700, color:"var(--ink)", fontFamily:"monospace" }}>{value.toLocaleString()}</span>
                  </div>
                  <input type="range" min={1} max={max} step={step} value={value} onChange={e => set(+e.target.value)} style={{ width:"100%" }}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)", display:"block", marginBottom:8 }}>Replacement provider</label>
                <select value={provider} onChange={e => setProvider(e.target.value)}>
                  <option value="google">Google Workspace (15/day)</option>
                  <option value="microsoft">Microsoft 365 (10/day)</option>
                  <option value="azure">Azure / Outlook (2/day)</option>
                  <option value="smtp">Custom SMTP (50/day)</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop:20 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)", display:"block", marginBottom:10 }}>How fast do you need to be back up?</label>
              <div style={{ display:"flex", gap:8 }}>
                {[{v:"days",l:"48 hours"},{v:"week",l:"1 week"},{v:"twoweeks",l:"2 weeks"}].map(({v,l}) => (
                  <label key={v} onClick={() => setTimeline(v)} style={{ flex:1, textAlign:"center", padding:"10px", borderRadius:8, border:`1px solid ${timeline===v ? "var(--red)" : "var(--border)"}`, background:timeline===v ? "var(--red-dim)" : "var(--paper)", cursor:"pointer", fontSize:13, fontWeight:timeline===v ? 600 : 400, color:timeline===v ? "var(--red)" : "var(--ink-3)" }}>
                    <input type="radio" name="timeline" checked={timeline===v} onChange={() => setTimeline(v)} style={{ display:"none" }}/>{l}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[
              { label:"Inboxes to replace", value:fmt(inboxesNeeded), color:"var(--red)", sub:`To cover ${fmt(dailySends)} daily sends` },
              { label:"Backup buffer (30%)", value:fmt(backupBuffer), color:"var(--yellow)", sub:"Keep in reserve" },
              { label:"Domains needed", value:fmt(domainsNeeded), color:"var(--ink)", sub:"Max 3 inboxes/domain" },
            ].map(({ label, value, color, sub }) => (
              <div key={label} className="card" style={{ padding:"14px 16px" }}>
                <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:5 }}>{label}</p>
                <p style={{ fontFamily:"monospace", fontSize:24, fontWeight:700, color, lineHeight:1, marginBottom:3 }}>{value}</p>
                <p style={{ fontSize:11, color:"var(--ink-4)" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Current vs needed */}
          <div className="card" style={{ padding:"18px 22px" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:12 }}>Current vs required capacity</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                <span style={{ color:"var(--ink-3)" }}>Current capacity ({liveCount} inboxes)</span>
                <span style={{ fontFamily:"monospace", fontWeight:700, color: currentCapacity >= dailySends ? "var(--green)" : "var(--red)" }}>{fmt(currentCapacity)}/day</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                <span style={{ color:"var(--ink-3)" }}>Volume needed</span>
                <span style={{ fontFamily:"monospace", fontWeight:700, color:"var(--ink)" }}>{fmt(dailySends)}/day</span>
              </div>
              <div style={{ height:1, background:"var(--border)", margin:"4px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                <span style={{ color: deficit > 0 ? "var(--red)" : "var(--green)", fontWeight:600 }}>{deficit > 0 ? "Daily deficit" : "Surplus capacity"}</span>
                <span style={{ fontFamily:"monospace", fontWeight:700, color: deficit > 0 ? "var(--red)" : "var(--green)" }}>{deficit > 0 ? `-${fmt(deficit)}` : `+${fmt(currentCapacity - dailySends)}`}/day</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="card" style={{ padding:"20px 24px", borderLeft:"3px solid var(--red)", background:"var(--red-dim)" }}>
            <p style={{ fontSize:14, fontWeight:700, color:"var(--red)", marginBottom:8 }}>You need {fmt(inboxesNeeded)} inboxes {timeLabel}</p>
            <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7, marginBottom:14 }}>
              Warming {fmt(inboxesNeeded)} inboxes from scratch takes {provider === "google" ? "4–6" : "6–8"} weeks minimum. Pre-warmed inboxes from WarmInboxes can be deployed in under a day — no warmup period, no waiting.
            </p>
            <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" className="btn btn-red" style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 20px", fontSize:13, textDecoration:"none", borderRadius:8 }}>
              Get {fmt(inboxesNeeded)} pre-warmed inboxes now <ExternalLink size={13}/>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

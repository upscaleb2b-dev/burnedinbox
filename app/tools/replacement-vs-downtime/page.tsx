"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString();

export default function ReplacementVsDowntimePage() {
  const [inboxCount, setInboxes]         = useState(15);
  const [monthlyRetainer, setRetainer]   = useState(4000);
  const [clientCount, setClients]        = useState(3);
  const [recoveryWeeks, setRecovery]     = useState(6);
  const [teamHours, setTeamHours]        = useState(25);
  const [hourlyRate, setHourly]          = useState(70);

  // Repair path
  const repairTeamCost    = teamHours * hourlyRate;
  const repairRevLost     = (monthlyRetainer * clientCount) * (recoveryWeeks / 4);
  const repairTotal       = repairTeamCost + repairRevLost;

  // Replace path (pre-warmed)
  const prewarmedCost     = inboxCount * 50;  // ~$50/inbox pre-warmed est.
  const replaceDomains    = Math.ceil(inboxCount / 3) * 15;
  const replaceSetupHours = inboxCount * 0.5;  // 30min setup per inbox
  const replaceTeamCost   = replaceSetupHours * hourlyRate;
  const replaceRevLost    = (monthlyRetainer * clientCount) * (2 / 4); // 2 weeks of config
  const replaceTotal      = prewarmedCost + replaceDomains + replaceTeamCost + replaceRevLost;

  const saving            = repairTotal - replaceTotal;
  const repairing         = saving < 0;

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

      <div style={{ maxWidth:860, margin:"0 auto", padding:"48px 24px 80px" }}>
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.08em", color:"var(--red)", marginBottom:8 }}>Calculator</p>
          <h1 style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", color:"var(--ink)", marginBottom:10, letterSpacing:"-0.3px" }}>Replacement vs Downtime Cost</h1>
          <p style={{ fontSize:15, color:"var(--ink-3)", lineHeight:1.7 }}>Should you repair burned inboxes or replace them with pre-warmed infrastructure? This calculator does the maths so you can make the call confidently.</p>
        </div>

        {/* Inputs */}
        <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24, marginBottom:24 }}>
          <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:20 }}>Your situation</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
            {([
              { label:"Inboxes burned", val:inboxCount, set:setInboxes, min:1, max:100 },
              { label:"Clients affected", val:clientCount, set:setClients, min:1, max:20 },
              { label:"Monthly retainer / client ($)", val:monthlyRetainer, set:setRetainer, min:500, max:20000, step:500 },
              { label:"Repair timeline (weeks)", val:recoveryWeeks, set:setRecovery, min:1, max:16 },
              { label:"Team hours on recovery", val:teamHours, set:setTeamHours, min:1, max:100 },
              { label:"Team hourly rate ($)", val:hourlyRate, set:setHourly, min:20, max:300, step:10 },
            ] as { label:string; val:number; set:(v:number)=>void; min:number; max:number; step?:number }[]).map(({ label, val, set, min, max, step }) => (
              <div key={label}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>{label}</label>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{val.toLocaleString()}</span>
                </div>
                <input type="range" min={min} max={max} step={step||1} value={val} onChange={e => set(+e.target.value)} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--ink-5)", marginTop:4 }}><span>{min}</span><span>{max.toLocaleString()}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
          {/* Repair path */}
          <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
            <p style={{ fontSize:13, fontWeight:700, color:"var(--ink)", marginBottom:4 }}>Path A: Repair</p>
            <p style={{ fontSize:12, color:"var(--ink-4)", marginBottom:20 }}>Rest, warm up, wait {recoveryWeeks} weeks</p>
            {[
              { label:"Revenue lost", val:repairRevLost, note:`${recoveryWeeks} weeks at reduced capacity` },
              { label:"Team recovery time", val:repairTeamCost, note:`${teamHours}hrs × $${hourlyRate}` },
            ].map(({ label, val, note }) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                <div>
                  <span style={{ fontSize:13, color:"var(--ink-3)" }}>{label}</span>
                  <span style={{ fontSize:11, color:"var(--ink-5)", display:"block" }}>{note}</span>
                </div>
                <span style={{ fontSize:15, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--ink)" }}>${fmt(val)}</span>
              </div>
            ))}
            <div style={{ marginTop:16, padding:"14px", background:"var(--paper-2)", borderRadius:8, border:"1px solid var(--border)", textAlign:"center" }}>
              <p style={{ fontSize:11, color:"var(--ink-4)", marginBottom:4 }}>Total cost to repair</p>
              <p style={{ fontSize:28, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--ink)" }}>${fmt(repairTotal)}</p>
            </div>
          </div>

          {/* Replace path */}
          <div style={{ background:"var(--paper)", border:`2px solid ${!repairing ? "var(--red)" : "var(--border)"}`, borderRadius:12, padding:24, position:"relative" }}>
            {!repairing && <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"var(--red)", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:100, whiteSpace:"nowrap" }}>✓ Cheaper option</div>}
            <p style={{ fontSize:13, fontWeight:700, color:"var(--ink)", marginBottom:4 }}>Path B: Replace</p>
            <p style={{ fontSize:12, color:"var(--ink-4)", marginBottom:20 }}>Pre-warmed inboxes, live in days</p>
            {[
              { label:"Pre-warmed inboxes", val:prewarmedCost, note:`${inboxCount} inboxes × ~$50 est.` },
              { label:"New domain registration", val:replaceDomains, note:`${Math.ceil(inboxCount/3)} domains × $15` },
              { label:"Setup & config time", val:replaceTeamCost, note:`${replaceSetupHours}hrs × $${hourlyRate}` },
              { label:"2-week transition revenue", val:replaceRevLost, note:"While migrating campaigns" },
            ].map(({ label, val, note }) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                <div>
                  <span style={{ fontSize:13, color:"var(--ink-3)" }}>{label}</span>
                  <span style={{ fontSize:11, color:"var(--ink-5)", display:"block" }}>{note}</span>
                </div>
                <span style={{ fontSize:15, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--ink)" }}>${fmt(val)}</span>
              </div>
            ))}
            <div style={{ marginTop:16, padding:"14px", background: !repairing ? "var(--red-dim)" : "var(--paper-2)", border: !repairing ? "1px solid var(--red-border)" : "1px solid var(--border)", borderRadius:8, textAlign:"center" }}>
              <p style={{ fontSize:11, color: !repairing ? "var(--red)" : "var(--ink-4)", marginBottom:4 }}>Total cost to replace</p>
              <p style={{ fontSize:28, fontWeight:700, fontFamily:"'Geist Mono',monospace", color: !repairing ? "var(--red)" : "var(--ink)" }}>${fmt(replaceTotal)}</p>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div style={{ padding:"20px 24px", background: !repairing ? "var(--red-dim)" : "var(--paper)", border: !repairing ? "1px solid var(--red-border)" : "1px solid var(--border)", borderRadius:12, textAlign:"center" }}>
          <p style={{ fontSize:15, fontWeight:700, color:"var(--ink)", marginBottom:8 }}>
            {!repairing
              ? `Replacing saves $${fmt(Math.abs(saving))} vs waiting for repair`
              : `Repairing saves $${fmt(Math.abs(saving))} vs replacing — if timeline is acceptable`
            }
          </p>
          <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7 }}>
            {!repairing
              ? <>Replace with pre-warmed inboxes. Keep campaigns live. Start repairs in background. <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ color:"var(--red)", fontWeight:600, textDecoration:"none" }}>WarmInboxes</a> has GWS and M365 options deployable same-day.</>
              : <>Repair path is cheaper here — but only if you can absorb {recoveryWeeks} weeks of reduced campaign performance. If clients are at risk, replacing is still worth considering.</>
            }
          </p>
        </div>
      </div>
    </div>
  );
}

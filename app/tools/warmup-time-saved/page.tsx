"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString();

export default function WarmupTimeSavedPage() {
  const [inboxes, setInboxes]         = useState(20);
  const [warmupWeeks, setWeeks]       = useState(4);
  const [dailyLimit, setDailyLimit]   = useState(15);
  const [monthlyValue, setMonthly]    = useState(3000); // campaign value per month
  const [teamHours, setTeamHours]     = useState(2);    // hours/inbox to setup & monitor warmup
  const [hourlyRate, setHourly]       = useState(60);

  const sendDaysInWarmup       = warmupWeeks * 5;
  const sendsLostPerInbox      = (dailyLimit * sendDaysInWarmup) / 2; // avg ramp = half capacity
  const totalSendsLost         = sendsLostPerInbox * inboxes;
  const revenueLost            = monthlyValue * (warmupWeeks / 4);
  const teamTimeCost            = inboxes * teamHours * hourlyRate;
  const totalSaved             = revenueLost + teamTimeCost;
  const prewarmedCostPerInbox  = 45; // rough estimate
  const prewarmedTotal         = inboxes * prewarmedCostPerInbox;
  const netSaving              = totalSaved - prewarmedTotal;

  const Stat = ({ label, val, sub, red }: { label: string; val: string; sub?: string; red?: boolean }) => (
    <div style={{ padding:16, background:"var(--paper-2)", border:"1px solid var(--border)", borderRadius:10, textAlign:"center" }}>
      <p style={{ fontSize:11, color:"var(--ink-4)", textTransform:"uppercase" as const, letterSpacing:"0.07em", marginBottom:4 }}>{label}</p>
      <p style={{ fontSize:22, fontWeight:700, fontFamily:"'Geist Mono',monospace", color: red ? "var(--red)" : "var(--ink)" }}>{val}</p>
      {sub && <p style={{ fontSize:11, color:"var(--ink-5)", marginTop:4 }}>{sub}</p>}
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
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.08em", color:"var(--red)", marginBottom:8 }}>Calculator</p>
          <h1 style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", color:"var(--ink)", marginBottom:10, letterSpacing:"-0.3px" }}>Warm-Up Time Saved Calculator</h1>
          <p style={{ fontSize:15, color:"var(--ink-3)", lineHeight:1.7 }}>Skipping warmup with pre-warmed inboxes doesn't just save time — it saves revenue. See the real value of buying warmed vs doing it yourself.</p>
        </div>

        <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24, marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:20 }}>Your setup</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
            {([
              { label:"Inboxes to warm", val:inboxes, set:setInboxes, min:1, max:100 },
              { label:"Warmup weeks needed", val:warmupWeeks, set:setWeeks, min:2, max:8 },
              { label:"Daily sends at full capacity", val:dailyLimit, set:setDailyLimit, min:5, max:50 },
              { label:"Monthly campaign value ($)", val:monthlyValue, set:setMonthly, min:500, max:50000, step:500 },
              { label:"Setup hours per inbox", val:teamHours, set:setTeamHours, min:1, max:10 },
              { label:"Team hourly rate ($)", val:hourlyRate, set:setHourly, min:20, max:200, step:10 },
            ] as { label:string; val:number; set:(v:number)=>void; min:number; max:number; step?:number }[]).map(({ label, val, set, min, max, step }) => (
              <div key={label}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>{label}</label>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{val.toLocaleString()}</span>
                </div>
                <input type="range" min={min} max={max} step={step||1} value={val} onChange={e => set(+e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
          <Stat label="Sends lost to warmup" val={fmt(totalSendsLost)} sub="below full capacity" />
          <Stat label="Revenue delayed" val={`$${fmt(revenueLost)}`} sub={`${warmupWeeks} weeks off full speed`} red />
          <Stat label="Team time cost" val={`$${fmt(teamTimeCost)}`} sub={`${inboxes} inboxes × ${teamHours}hrs`} />
        </div>

        <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
          <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:16 }}>Pre-warmed vs DIY warmup</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <div style={{ padding:16, background:"var(--paper-2)", borderRadius:10, textAlign:"center" }}>
              <p style={{ fontSize:11, color:"var(--ink-4)", marginBottom:6 }}>Cost of DIY warmup</p>
              <p style={{ fontSize:22, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--ink)" }}>${fmt(revenueLost + teamTimeCost)}</p>
              <p style={{ fontSize:11, color:"var(--ink-5)", marginTop:4 }}>Revenue + team time</p>
            </div>
            <div style={{ padding:16, background:"var(--paper-2)", borderRadius:10, textAlign:"center" }}>
              <p style={{ fontSize:11, color:"var(--ink-4)", marginBottom:6 }}>Cost of pre-warmed</p>
              <p style={{ fontSize:22, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--ink)" }}>${fmt(prewarmedTotal)}</p>
              <p style={{ fontSize:11, color:"var(--ink-5)", marginTop:4 }}>~${prewarmedCostPerInbox}/inbox est.</p>
            </div>
            <div style={{ padding:16, background: netSaving > 0 ? "var(--red-dim)" : "var(--paper-2)", border: netSaving > 0 ? "1px solid var(--red-border)" : "1px solid var(--border)", borderRadius:10, textAlign:"center" }}>
              <p style={{ fontSize:11, color: netSaving > 0 ? "var(--red)" : "var(--ink-4)", marginBottom:6 }}>Net saving</p>
              <p style={{ fontSize:22, fontWeight:700, fontFamily:"'Geist Mono',monospace", color: netSaving > 0 ? "var(--red)" : "var(--ink)" }}>${fmt(Math.abs(netSaving))}</p>
              <p style={{ fontSize:11, color:"var(--ink-5)", marginTop:4 }}>{netSaving > 0 ? "in favour of pre-warmed" : "DIY is cheaper here"}</p>
            </div>
          </div>
          <p style={{ fontSize:13, color:"var(--ink-4)", marginTop:16, lineHeight:1.7 }}>
            Pre-warmed inboxes from <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ color:"var(--red)", fontWeight:600, textDecoration:"none" }}>WarmInboxes</a> are deployable same-day. Actual pricing varies — use this as a directional comparison.
          </p>
        </div>
      </div>
    </div>
  );
}

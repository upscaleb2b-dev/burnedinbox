"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString();

export default function BurnCostPage() {
  const [inboxesBurned, setInboxes]     = useState(10);
  const [domainsLost, setDomains]       = useState(4);
  const [weeksDown, setWeeksDown]       = useState(3);
  const [monthlyRetainer, setRetainer]  = useState(3000);
  const [clientsAffected, setClients]   = useState(2);
  const [teamHours, setTeamHours]       = useState(20);
  const [hourlyRate, setHourly]         = useState(75);

  const replacementCost    = (inboxesBurned * 12) + (domainsLost * 15);
  const lostRevenue        = (monthlyRetainer * clientsAffected) * (weeksDown / 4);
  const teamTimeCost       = teamHours * hourlyRate;
  const warmupDelayCost    = inboxesBurned * 8 * 4; // avg warmup weeks × $8/inbox-week opportunity
  const totalCost          = replacementCost + lostRevenue + teamTimeCost + warmupDelayCost;

  const Row = ({ label, val, note }: { label: string; val: number; note?: string }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
      <div>
        <span style={{ fontSize:14, color:"var(--ink-3)" }}>{label}</span>
        {note && <span style={{ fontSize:11, color:"var(--ink-5)", display:"block" }}>{note}</span>}
      </div>
      <span style={{ fontSize:16, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--ink)" }}>${fmt(val)}</span>
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
          <h1 style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", color:"var(--ink)", marginBottom:10, letterSpacing:"-0.3px" }}>Burn Cost Calculator</h1>
          <p style={{ fontSize:15, color:"var(--ink-3)", lineHeight:1.7 }}>What did burning your inboxes actually cost? Most operators only count the replacement — the real number is usually 5–10× higher.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
            <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:20 }}>What burned</p>
            {([
              { label:"Inboxes burned", val:inboxesBurned, set:setInboxes, min:1, max:100 },
              { label:"Domains lost", val:domainsLost, set:setDomains, min:0, max:50 },
              { label:"Weeks of downtime", val:weeksDown, set:setWeeksDown, min:1, max:12 },
              { label:"Clients affected", val:clientsAffected, set:setClients, min:1, max:20 },
            ] as { label:string; val:number; set:(v:number)=>void; min:number; max:number }[]).map(({ label, val, set, min, max }) => (
              <div key={label} style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>{label}</label>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{val}</span>
                </div>
                <input type="range" min={min} max={max} value={val} onChange={e => set(+e.target.value)} />
              </div>
            ))}
            <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", margin:"8px 0 16px" }}>Business impact</p>
            {([
              { label:"Monthly retainer per client", val:monthlyRetainer, set:setRetainer, min:500, max:20000, step:500, prefix:"$" },
              { label:"Team hours on recovery", val:teamHours, set:setTeamHours, min:1, max:200 },
              { label:"Team hourly rate", val:hourlyRate, set:setHourly, min:20, max:300, step:5, prefix:"$" },
            ] as { label:string; val:number; set:(v:number)=>void; min:number; max:number; step?:number; prefix?:string }[]).map(({ label, val, set, min, max, step, prefix }) => (
              <div key={label} style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>{label}</label>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{prefix||""}{val.toLocaleString()}</span>
                </div>
                <input type="range" min={min} max={max} step={step||1} value={val} onChange={e => set(+e.target.value)} />
              </div>
            ))}
          </div>

          <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
            <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:20 }}>True burn cost</p>
            <Row label="Inbox & domain replacement" val={replacementCost} note="New accounts + domain reg" />
            <Row label="Lost client revenue" val={lostRevenue} note={`${weeksDown} weeks × ${clientsAffected} clients`} />
            <Row label="Team recovery time" val={teamTimeCost} note={`${teamHours}hrs @ $${hourlyRate}/hr`} />
            <Row label="Warmup delay opportunity" val={warmupDelayCost} note="Sends missed during warmup" />
            <div style={{ marginTop:16, padding:"16px", background:"var(--red-dim)", border:"1px solid var(--red-border)", borderRadius:10, textAlign:"center" }}>
              <p style={{ fontSize:11, color:"var(--red)", textTransform:"uppercase" as const, letterSpacing:"0.07em", marginBottom:6 }}>Total true cost</p>
              <p style={{ fontSize:36, fontWeight:700, fontFamily:"'Geist Mono',monospace", color:"var(--red)", lineHeight:1 }}>${fmt(totalCost)}</p>
            </div>
            <div style={{ marginTop:16, padding:"12px 14px", background:"var(--paper-2)", borderRadius:8, border:"1px solid var(--border)" }}>
              <p style={{ fontSize:12, color:"var(--ink-3)", lineHeight:1.6 }}>
                Pre-warmed inboxes from <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ color:"var(--red)", fontWeight:600, textDecoration:"none" }}>WarmInboxes</a> eliminate warmup delay and get campaigns back live same-day. At this cost, the math usually favours replacing fast over repairing slow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

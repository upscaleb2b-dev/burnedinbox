"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, ExternalLink, Clock } from "lucide-react";

export default function RecoveryTimePage() {
  const [issue, setIssue]       = useState("spam");
  const [blacklisted, setBlacklisted] = useState(false);
  const [authFixed, setAuthFixed]     = useState(false);
  const [history, setHistory]   = useState("months");
  const [urgency, setUrgency]   = useState("flexible");

  const calcTimes = () => {
    let repairMin = 2, repairMax = 4; // weeks
    let warmupMin = 6, warmupMax = 10;
    const prewarmedDays = 1;

    if (issue === "promotions") { repairMin = 1; repairMax = 3; warmupMin = 5; warmupMax = 8; }
    if (issue === "inbox") { repairMin = 0; repairMax = 1; warmupMin = 4; warmupMax = 6; }
    if (blacklisted) { repairMin += 2; repairMax += 4; }
    if (!authFixed)  { repairMin += 1; repairMax += 2; }
    if (history === "months") { repairMin += 2; repairMax += 4; }
    if (history === "years")  { repairMin += 4; repairMax += 8; }
    if (urgency === "urgent") warmupMin -= 1;

    return { repairMin, repairMax, warmupMin, warmupMax, prewarmedDays };
  };

  const t = calcTimes();
  const options = [
    { label:"Repair existing setup", min:t.repairMin, max:t.repairMax, unit:"weeks", color:"var(--yellow)", note:"Fix DNS, request delistings, reduce volume, wait for reputation to recover." },
    { label:"Warmup fresh from scratch", min:t.warmupMin, max:t.warmupMax, unit:"weeks", color:"var(--ink-3)", note:"New domains, new inboxes, manual or tool-assisted warmup before safe sending." },
    { label:"Pre-warmed replacement", min:t.prewarmedDays, max:t.prewarmedDays, unit:"day", color:"var(--green)", note:"Pre-warmed inboxes via WarmInboxes — established reputation, ready to send immediately.", cta:true },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} .opt{cursor:pointer;transition:all 0.12s;border:none;background:transparent}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:660, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Time-to-Recovery Estimator</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>See how long each recovery path takes — repair vs warmup vs pre-warmed replacement</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
          {[
            { q:"Current placement", name:"issue", opts:[{v:"spam",l:"Spam folder"},{v:"promotions",l:"Promotions tab"},{v:"inbox",l:"Inbox but declining"}], state:issue, set:setIssue },
            { q:"Blacklisted on any RBL?", name:"bl", opts:[{v:"true",l:"Yes"},{v:"false",l:"No / don't know"}], state:String(blacklisted), set:(v:string)=>setBlacklisted(v==="true") },
            { q:"Authentication fixed? (SPF/DKIM/DMARC)", name:"auth", opts:[{v:"true",l:"Yes, all set"},{v:"false",l:"Not yet"}], state:String(authFixed), set:(v:string)=>setAuthFixed(v==="true") },
            { q:"How long has this domain been sending?", name:"hist", opts:[{v:"weeks",l:"Weeks"},{v:"months",l:"Months"},{v:"years",l:"Years"}], state:history, set:setHistory },
            { q:"Can campaigns pause during recovery?", name:"urg", opts:[{v:"flexible",l:"Yes"},{v:"urgent",l:"No — must keep sending"}], state:urgency, set:setUrgency },
          ].map(({ q, name, opts, state, set }) => (
            <div key={name} className="card" style={{ padding:"16px 20px" }}>
              <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:10 }}>{q}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {opts.map(({ v, l }) => (
                  <label key={v} onClick={() => set(v)} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 14px", borderRadius:8, border:`1px solid ${state===v ? "var(--ink-3)" : "var(--border)"}`, background:state===v ? "var(--paper-3)" : "var(--paper)", cursor:"pointer", fontSize:13, color:"var(--ink)" }}>
                    <input type="radio" name={name} checked={state===v} onChange={() => set(v)} style={{ accentColor:"var(--ink)" }}/>{l}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)" }}>Your recovery options</p>
          {options.map(({ label, min, max, unit, color, note, cta }) => (
            <div key={label} className="card" style={{ padding:"18px 22px", borderLeft:`3px solid ${color}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <Clock size={15} style={{ color, flexShrink:0 }}/>
                <span style={{ fontSize:14, fontWeight:600, color:"var(--ink)", flex:1 }}>{label}</span>
                <span style={{ fontFamily:"monospace", fontSize:20, fontWeight:700, color }}>
                  {min === max ? `${min}` : `${min}–${max}`}
                  <span style={{ fontSize:13, fontWeight:400, color:"var(--ink-4)", marginLeft:4 }}>{unit}{max > 1 && unit !== "day" ? "s" : ""}</span>
                </span>
              </div>
              <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.65 }}>{note}</p>
              {cta && (
                <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ fontSize:12, fontWeight:500, color:"var(--ink-4)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:4, marginTop:10, borderBottom:"1px solid var(--border-2)", paddingBottom:1 }}>
                  WarmInboxes — pre-warmed inboxes and domains <ExternalLink size={10}/>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

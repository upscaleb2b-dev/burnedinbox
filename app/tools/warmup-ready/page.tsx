"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from "lucide-react";

export default function WarmupReadyPage() {
  const [auth,          setAuth]          = useState<boolean|null>(null);
  const [domainAge,     setDomainAge]     = useState<string|null>(null);
  const [warmupDays,    setWarmupDays]    = useState<string|null>(null);
  const [interactions,  setInteractions]  = useState<boolean|null>(null);
  const [spamSignals,   setSpamSignals]   = useState<boolean|null>(null);
  const [replyRouting,  setReplyRouting]  = useState<boolean|null>(null);
  const [volumeRamp,    setVolumeRamp]    = useState<boolean|null>(null);
  const [shown, setShown] = useState(false);

  type CheckItem = { label:string; pass:boolean|null; weight:number; note:string };
  const checks: CheckItem[] = [
    { label:"Authentication (SPF, DKIM, DMARC)", pass: auth, weight:3, note: auth ? "Auth is configured — strong foundation" : auth === false ? "Fix authentication before going live — this is the most critical prerequisite" : "" },
    { label:"Domain age", pass: domainAge === "over90" ? true : domainAge === "30to90" ? null : domainAge !== null ? false : null, weight:2, note: domainAge === "over90" ? "Domain is 90+ days old — good maturity" : domainAge === "30to90" ? "Domain is 30–90 days — usable but monitor carefully" : domainAge === "under30" ? "Domain under 30 days old — very high risk for spam filtering" : "" },
    { label:"Warmup duration", pass: warmupDays === "over21" ? true : warmupDays === "14to21" ? null : warmupDays !== null ? false : null, weight:2, note: warmupDays === "over21" ? "21+ day warmup — sufficient for most providers" : warmupDays === "14to21" ? "14–21 days — marginal, proceed carefully" : warmupDays === "under14" ? "Under 14 days is too short — extend warmup before live sends" : "" },
    { label:"Human interactions during warmup", pass: interactions, weight:2, note: interactions ? "Interactions recorded — builds trust signals" : interactions === false ? "No interactions means low engagement history — extend warmup" : "" },
    { label:"No spam signals during warmup", pass: spamSignals === false ? true : spamSignals === true ? false : null, weight:3, note: spamSignals === false ? "No spam signals detected — good" : spamSignals === true ? "Spam signals during warmup will follow the account — pause and investigate" : "" },
    { label:"Reply routing configured", pass: replyRouting, weight:1, note: replyRouting ? "Replies route correctly" : replyRouting === false ? "Ensure replies route to a monitored inbox before sending live" : "" },
    { label:"Gradual volume ramp followed", pass: volumeRamp, weight:2, note: volumeRamp ? "Volume ramp respected — healthy send history" : volumeRamp === false ? "Sudden volume increases are a key spam trigger — ramp up slowly" : "" },
  ];

  const answered = checks.filter(c => c.pass !== null);
  const passing  = checks.filter(c => c.pass === true);
  const failing  = checks.filter(c => c.pass === false);
  const warning  = checks.filter(c => c.pass === null && answered.some(a => a.label === c.label));
  const totalWeight = checks.reduce((s,c) => s + c.weight, 0);
  const passWeight  = passing.reduce((s,c) => s + c.weight, 0);
  const score = answered.length > 0 ? Math.round((passWeight / totalWeight) * 100) : 0;
  const ready = score >= 75 && failing.length === 0;
  const readyColor = ready ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";

  function Opt({ val, label, state, set, good=true }: { val: string; label:string; state:string; set:(v:string|boolean)=>void; good?:boolean }) {
    const active = state === val;
    const col = active ? (good ? "var(--green)" : "var(--red)") : "var(--border)";
    return (
      <label onClick={() => set(val)} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 14px", borderRadius:8, border:`1px solid ${active ? col : "var(--border)"}`, background:active ? (good ? "var(--green-dim)" : "var(--red-dim)") : "var(--paper)", cursor:"pointer", fontSize:13, color:"var(--ink)" }}>
        <input type="radio" checked={active} onChange={() => set(val)} style={{ accentColor:col }}/>{label}
      </label>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:660, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Warmup Readiness Checker</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Signal-based check to see if a mailbox is ready for live cold email sends</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { q:"Is SPF, DKIM, and DMARC configured?", name:"auth", opts:[{v:true,l:"Yes — all set",g:true},{v:false,l:"No / not sure",g:false}], state:auth, set:setAuth as (v:boolean|string)=>void },
            { q:"How old is the domain?", name:"age", opts:[{v:"over90",l:"90+ days",g:true},{v:"30to90",l:"30–90 days",g:true},{v:"under30",l:"Under 30 days",g:false}], state:domainAge, set:setDomainAge },
            { q:"How long has the inbox been warming?", name:"warm", opts:[{v:"over21",l:"21+ days",g:true},{v:"14to21",l:"14–21 days",g:true},{v:"under14",l:"Under 14 days",g:false}], state:warmupDays, set:setWarmupDays },
            { q:"Were there human interactions (opens/replies) during warmup?", name:"int", opts:[{v:true,l:"Yes",g:true},{v:false,l:"No / minimal",g:false}], state:interactions, set:setInteractions as (v:boolean|string)=>void },
            { q:"Any spam complaints or filters triggered during warmup?", name:"spam", opts:[{v:false,l:"No — clean warmup",g:true},{v:true,l:"Yes — some signals",g:false}], state:spamSignals, set:setSpamSignals as (v:boolean|string)=>void },
            { q:"Does reply routing work correctly?", name:"reply", opts:[{v:true,l:"Yes — tested it",g:true},{v:false,l:"Not sure / not set up",g:false}], state:replyRouting, set:setReplyRouting as (v:boolean|string)=>void },
            { q:"Was volume ramped up gradually?", name:"vol", opts:[{v:true,l:"Yes — slow ramp",g:true},{v:false,l:"No — skipped ramp",g:false}], state:volumeRamp, set:setVolumeRamp as (v:boolean|string)=>void },
          ].map(({ q, name, opts, state, set }) => (
            <div key={name} className="card" style={{ padding:"16px 20px" }}>
              <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:10 }}>{q}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {opts.map(({ v, l, g }) => {
                  const fn = set as (v:string|boolean)=>void;
                  return <Opt key={String(v)} val={v as string} label={l} state={String(state)} set={fn} good={g}/>;
                })}
              </div>
            </div>
          ))}

          <button onClick={() => setShown(true)} disabled={answered.length < 4} className="btn btn-primary" style={{ padding:"12px 24px", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
            Check readiness
          </button>

          {shown && answered.length >= 4 && (
            <div className="card" style={{ padding:"22px 24px" }}>
              <div style={{ padding:"16px 20px", borderRadius:10, background: ready ? "var(--green-dim)" : score >= 50 ? "var(--yellow-dim)" : "var(--red-dim)", marginBottom:18, display:"flex", alignItems:"center", gap:14 }}>
                {ready ? <CheckCircle2 size={24} style={{ color:"var(--green)", flexShrink:0 }}/> : <XCircle size={24} style={{ color:readyColor, flexShrink:0 }}/>}
                <div>
                  <p style={{ fontSize:17, fontWeight:700, color:readyColor, marginBottom:4 }}>
                    {ready ? "Ready to send" : score >= 50 ? "Almost ready — a few things to fix" : "Not ready yet"}
                  </p>
                  <p style={{ fontSize:13, color:"var(--ink-3)" }}>
                    {ready ? "This inbox meets the key signals for live cold email sends." : `${failing.length} issue${failing.length !== 1 ? "s" : ""} to fix before going live.`}
                  </p>
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {checks.filter(c => answered.some(a => a.label === c.label)).map((c,i) => {
                  const ic = c.pass === true ? CheckCircle2 : c.pass === false ? XCircle : AlertTriangle;
                  const col = c.pass === true ? "var(--green)" : c.pass === false ? "var(--red)" : "var(--yellow)";
                  const Ic = ic;
                  return (
                    <div key={i} style={{ display:"flex", gap:10, padding:"10px 14px", borderRadius:8, border:"1px solid var(--border)", background:"var(--paper)" }}>
                      <Ic size={14} style={{ color:col, flexShrink:0, marginTop:1 }}/>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:13, fontWeight:500, color:"var(--ink)", marginBottom:c.note ? 3 : 0 }}>{c.label}</p>
                        {c.note && <p style={{ fontSize:12, color:"var(--ink-4)", lineHeight:1.5 }}>{c.note}</p>}
                      </div>
                      <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:4, color:col, background: c.pass === true ? "var(--green-dim)" : c.pass === false ? "var(--red-dim)" : "var(--yellow-dim)", flexShrink:0, alignSelf:"flex-start", marginTop:1 }}>
                        ×{c.weight}
                      </span>
                    </div>
                  );
                })}
              </div>

              {!ready && score < 50 && (
                <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid var(--border)" }}>
                  <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7, marginBottom:10 }}>
                    If warmup is taking too long or showing poor signals, starting with pre-warmed inboxes skips the process entirely — established reputation, ready to send.
                  </p>
                  <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ fontSize:13, fontWeight:500, color:"var(--ink-3)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5, borderBottom:"1px solid var(--border-2)", paddingBottom:1 }}>
                    WarmInboxes — skip warmup with pre-warmed inboxes <ExternalLink size={11}/>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

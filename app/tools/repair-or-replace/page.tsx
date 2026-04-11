"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, ExternalLink, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

type Verdict = "repair" | "partial" | "replace";

function calc(authOk: boolean, placement: string, blacklisted: boolean, urgency: string, affected: number, total: number): { verdict: Verdict; reasons: string[]; actions: string[] } {
  const reasons: string[] = [];
  const actions: string[] = [];
  let score = 0;

  if (!authOk)         { score += 20; reasons.push("Missing or broken authentication (SPF/DKIM/DMARC)"); }
  if (blacklisted)     { score += 40; reasons.push("Domain or IP is blacklisted"); }
  if (placement === "spam")      { score += 30; reasons.push("Emails landing in spam folder"); }
  if (placement === "promotions"){ score += 10; reasons.push("Emails landing in promotions tab"); }
  if (urgency === "urgent")      { score += 20; reasons.push("Campaigns can't pause — urgent recovery needed"); }
  if (affected / total > 0.5)    { score += 15; reasons.push(`More than half of inboxes affected (${affected}/${total})`); }

  let verdict: Verdict;
  if (score >= 70) {
    verdict = "replace";
    actions.push("Stand up fresh domains and pre-warmed inboxes immediately");
    actions.push("Pause sending from burned infrastructure");
    actions.push("File blacklist removal requests while replacement is being set up");
    actions.push("Fix authentication on the burned domain to prevent future issues");
    if (urgency === "urgent") actions.unshift("Use pre-warmed inboxes to maintain campaign continuity today");
  } else if (score >= 35) {
    verdict = "partial";
    actions.push("Replace the worst-performing inboxes first");
    actions.push("Fix authentication records immediately");
    actions.push("Reduce send volume on affected accounts while monitoring");
    actions.push("Add backup inboxes to absorb volume during recovery");
  } else {
    verdict = "repair";
    actions.push("Fix any missing authentication records (SPF, DKIM, DMARC)");
    actions.push("Remove from any blacklists by requesting delisting");
    actions.push("Reduce daily send volume temporarily");
    actions.push("Monitor placement weekly and retest in 14 days");
  }

  return { verdict, reasons, actions };
}

export default function RepairOrReplacePage() {
  const [authOk, setAuthOk]         = useState(false);
  const [placement, setPlacement]   = useState("spam");
  const [blacklisted, setBlacklisted] = useState(false);
  const [urgency, setUrgency]       = useState("flexible");
  const [affected, setAffected]     = useState(5);
  const [total, setTotal]           = useState(15);
  const [shown, setShown]           = useState(false);

  const result = calc(authOk, placement, blacklisted, urgency, affected, total);
  const COLORS: Record<Verdict, string> = { repair:"var(--green)", partial:"var(--yellow)", replace:"var(--red)" };
  const LABELS: Record<Verdict, string> = { repair:"Repair your setup", partial:"Partial replacement", replace:"Replace infrastructure" };
  const col = COLORS[result.verdict];

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input[type=range]{accent-color:var(--red)} .opt{cursor:pointer;transition:all 0.12s}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Repair or Replace Calculator</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Tell us what's happening — we'll tell you whether to fix or replace your infrastructure</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Auth */}
          <div className="card" style={{ padding:"18px 22px" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:12 }}>Is your authentication set up correctly? (SPF, DKIM, DMARC)</p>
            <div style={{ display:"flex", gap:10 }}>
              {[{v:true,l:"Yes — all configured"},{v:false,l:"No — missing or broken"}].map(({v,l}) => (
                <label key={l} className="opt" style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:9, border:`1px solid ${authOk===v ? (v?"var(--green)":"var(--red)") : "var(--border)"}`, background:authOk===v ? (v?"var(--green-dim)":"var(--red-dim)") : "var(--paper)", cursor:"pointer" }}>
                  <input type="radio" name="auth" checked={authOk===v} onChange={() => setAuthOk(v)} style={{ accentColor: v ? "var(--green)" : "var(--red)" }}/>
                  <span style={{ fontSize:13, color:"var(--ink)" }}>{l}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Placement */}
          <div className="card" style={{ padding:"18px 22px" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:12 }}>Where are your emails landing?</p>
            <div style={{ display:"flex", gap:8 }}>
              {[{v:"inbox",l:"Inbox",c:"var(--green)"},{v:"promotions",l:"Promotions",c:"var(--yellow)"},{v:"spam",l:"Spam",c:"var(--red)"}].map(({v,l,c}) => (
                <label key={v} className="opt" style={{ flex:1, textAlign:"center", padding:"12px", borderRadius:9, border:`1px solid ${placement===v ? c : "var(--border)"}`, background:placement===v ? `${c.replace("var(","").replace(")","")}-dim` : "var(--paper)", cursor:"pointer" }} onClick={() => setPlacement(v)}>
                  <input type="radio" name="placement" checked={placement===v} onChange={() => setPlacement(v)} style={{ display:"none" }}/>
                  <span style={{ fontSize:13, fontWeight:600, color:placement===v ? c : "var(--ink-3)" }}>{l}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Blacklisted */}
          <div className="card" style={{ padding:"18px 22px" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:12 }}>Are you blacklisted? (Spamhaus, Barracuda, SURBL, etc.)</p>
            <div style={{ display:"flex", gap:10 }}>
              {[{v:true,l:"Yes — listed on at least one RBL"},{v:false,l:"No — clean across blacklists"}].map(({v,l}) => (
                <label key={l} className="opt" style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:9, border:`1px solid ${blacklisted===v ? (v?"var(--red)":"var(--green)") : "var(--border)"}`, background:blacklisted===v ? (v?"var(--red-dim)":"var(--green-dim)") : "var(--paper)", cursor:"pointer" }}>
                  <input type="radio" name="bl" checked={blacklisted===v} onChange={() => setBlacklisted(v)} style={{ accentColor: v ? "var(--red)" : "var(--green)" }}/>
                  <span style={{ fontSize:13, color:"var(--ink)" }}>{l}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Affected inboxes */}
          <div className="card" style={{ padding:"18px 22px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {[
                { label:"Affected inboxes", value:affected, set:setAffected, max:100 },
                { label:"Total inboxes",    value:total,    set:setTotal,    max:200 },
              ].map(({ label, value, set, max }) => (
                <div key={label}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)" }}>{label}</label>
                    <span style={{ fontSize:15, fontWeight:700, color:"var(--ink)", fontFamily:"monospace" }}>{value}</span>
                  </div>
                  <input type="range" min={1} max={max} step={1} value={value} onChange={e => set(+e.target.value)} style={{ width:"100%" }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="card" style={{ padding:"18px 22px" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:12 }}>Can campaigns pause during recovery?</p>
            <div style={{ display:"flex", gap:10 }}>
              {[{v:"flexible",l:"Yes — can pause for 2–4 weeks"},{v:"urgent",l:"No — need to keep sending"}].map(({v,l}) => (
                <label key={v} className="opt" style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:9, border:`1px solid ${urgency===v ? "var(--ink-3)" : "var(--border)"}`, background:urgency===v ? "var(--paper-3)" : "var(--paper)", cursor:"pointer" }}>
                  <input type="radio" name="urgency" checked={urgency===v} onChange={() => setUrgency(v)} style={{ accentColor:"var(--ink)" }}/>
                  <span style={{ fontSize:13, color:"var(--ink)" }}>{l}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Get verdict */}
          <button onClick={() => setShown(true)} className="btn btn-primary" style={{ padding:"12px 24px", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
            Get my recommendation
          </button>

          {shown && (
            <div className="card" style={{ padding:"22px 24px", borderLeft:`3px solid ${col}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                {result.verdict === "repair" ? <CheckCircle2 size={20} style={{ color:col }}/> : result.verdict === "partial" ? <AlertTriangle size={20} style={{ color:col }}/> : <XCircle size={20} style={{ color:col }}/>}
                <p style={{ fontSize:18, fontWeight:700, color:col }}>{LABELS[result.verdict]}</p>
              </div>

              {result.reasons.length > 0 && (
                <div style={{ marginBottom:16 }}>
                  <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:8 }}>Key factors</p>
                  {result.reasons.map((r,i) => <div key={i} style={{ fontSize:13, color:"var(--ink-3)", padding:"4px 0", display:"flex", gap:8 }}><span style={{ color:col, flexShrink:0 }}>•</span>{r}</div>)}
                </div>
              )}

              <div style={{ marginBottom:result.verdict !== "repair" ? 16 : 0 }}>
                <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:8 }}>What to do</p>
                {result.actions.map((a,i) => <div key={i} style={{ fontSize:13, color:"var(--ink-3)", padding:"5px 0", display:"flex", gap:8, borderBottom:"1px solid var(--border)" }}><span style={{ fontFamily:"monospace", fontSize:11, color:"var(--ink-4)", flexShrink:0, marginTop:1 }}>{String(i+1).padStart(2,"0")}</span>{a}</div>)}
              </div>

              {result.verdict !== "repair" && (
                <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid var(--border)" }}>
                  <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7, marginBottom:10 }}>
                    {result.verdict === "replace"
                      ? "Starting fresh with pre-warmed inboxes is the fastest path back to inbox placement — no warmup period, no waiting."
                      : "Adding pre-warmed inboxes as backup lets you maintain volume while recovering your existing accounts."}
                  </p>
                  <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ fontSize:13, fontWeight:500, color:"var(--ink-3)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5, borderBottom:"1px solid var(--border-2)", paddingBottom:1 }}>
                    WarmInboxes — pre-warmed inboxes and domains <ExternalLink size={11}/>
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

"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, ExternalLink } from "lucide-react";

type Verdict = "safe" | "watch" | "risk" | "cooked";

function calcBurnScore(placement: string, authIssues: boolean, blacklisted: boolean, bounceRate: string, volumeSpike: boolean, domainAge: string, replyRate: string): { score: number; verdict: Verdict; factors: {label:string;impact:string;bad:boolean}[] } {
  let score = 100;
  const factors: {label:string;impact:string;bad:boolean}[] = [];

  if (placement === "spam")        { score -= 40; factors.push({ label:"Spam folder placement", impact:"−40 pts", bad:true }); }
  else if (placement === "promotions") { score -= 15; factors.push({ label:"Promotions tab placement", impact:"−15 pts", bad:true }); }
  else { factors.push({ label:"Inbox placement", impact:"+0 pts", bad:false }); }

  if (blacklisted) { score -= 30; factors.push({ label:"Blacklisted on RBL(s)", impact:"−30 pts", bad:true }); }
  if (authIssues)  { score -= 20; factors.push({ label:"Missing / broken authentication", impact:"−20 pts", bad:true }); }

  if (bounceRate === "high")   { score -= 20; factors.push({ label:"High bounce rate (>5%)", impact:"−20 pts", bad:true }); }
  else if (bounceRate === "medium") { score -= 8; factors.push({ label:"Moderate bounce rate (2–5%)", impact:"−8 pts", bad:true }); }
  else { factors.push({ label:"Low bounce rate (<2%)", impact:"+0 pts", bad:false }); }

  if (volumeSpike) { score -= 15; factors.push({ label:"Recent volume spike detected", impact:"−15 pts", bad:true }); }

  if (replyRate === "low") { score -= 10; factors.push({ label:"Low reply rate (<1%)", impact:"−10 pts", bad:true }); }
  else if (replyRate === "good") { score += 5; factors.push({ label:"Healthy reply rate (>2%)", impact:"+5 pts", bad:false }); }

  if (domainAge === "new") { score -= 10; factors.push({ label:"Domain less than 3 months old", impact:"−10 pts", bad:true }); }
  else if (domainAge === "established") { score += 5; factors.push({ label:"Domain 1+ years old", impact:"+5 pts", bad:false }); }

  score = Math.max(0, Math.min(100, score));
  const verdict: Verdict = score >= 75 ? "safe" : score >= 50 ? "watch" : score >= 25 ? "risk" : "cooked";
  return { score, verdict, factors };
}

const VERDICTS: Record<Verdict, { label:string; color:string; bg:string; desc:string }> = {
  safe:   { label:"Safe",         color:"var(--green)",  bg:"var(--green-dim)",  desc:"Your inbox health looks stable. Keep monitoring and avoid sudden volume spikes." },
  watch:  { label:"Watch closely", color:"var(--yellow)", bg:"var(--yellow-dim)", desc:"Early warning signs. Address the flagged issues before they compound." },
  risk:   { label:"Burn risk",    color:"var(--red)",    bg:"var(--red-dim)",    desc:"Multiple risk factors detected. Take action now before placement gets worse." },
  cooked: { label:"Likely cooked", color:"var(--red)",   bg:"var(--red-dim)",    desc:"Severe inbox damage detected. Replacement infrastructure may be needed." },
};

export default function BurnScorePage() {
  const [placement,  setPlacement]  = useState("inbox");
  const [auth,       setAuth]       = useState(false);
  const [blacklisted,setBl]         = useState(false);
  const [bounceRate, setBounceRate] = useState("low");
  const [spike,      setSpike]      = useState(false);
  const [domainAge,  setDomainAge]  = useState("medium");
  const [replyRate,  setReplyRate]  = useState("medium");
  const [shown,      setShown]      = useState(false);

  const { score, verdict, factors } = calcBurnScore(placement, auth, blacklisted, bounceRate, spike, domainAge, replyRate);
  const v = VERDICTS[verdict];
  const r = 44, circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} .opt{cursor:pointer;transition:all 0.12s}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Burn Score</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Signal-based inbox health rating — Safe · Watch · Burn risk · Likely cooked</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { q:"Current inbox placement", name:"place", opts:[{v:"inbox",l:"Inbox"},{v:"promotions",l:"Promotions"},{v:"spam",l:"Spam"}], state:placement, set:setPlacement },
            { q:"Bounce rate", name:"bounce", opts:[{v:"low",l:"Low (<2%)"},{v:"medium",l:"Medium (2–5%)"},{v:"high",l:"High (>5%)"}], state:bounceRate, set:setBounceRate },
            { q:"Reply rate", name:"reply", opts:[{v:"good",l:"Good (>2%)"},{v:"medium",l:"Medium (1–2%)"},{v:"low",l:"Low (<1%)"}], state:replyRate, set:setReplyRate },
            { q:"Domain age", name:"age", opts:[{v:"new",l:"<3 months"},{v:"medium",l:"3–12 months"},{v:"established",l:"1+ years"}], state:domainAge, set:setDomainAge },
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

          <div className="card" style={{ padding:"16px 20px" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:12 }}>Check all that apply</p>
            {[
              { label:"Authentication issues (SPF/DKIM/DMARC missing or broken)", state:auth, set:setAuth },
              { label:"Listed on at least one blacklist (Spamhaus, Barracuda, etc.)", state:blacklisted, set:setBl },
              { label:"Recent sudden volume spike", state:spike, set:setSpike },
            ].map(({ label, state, set }) => (
              <label key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid var(--border)", cursor:"pointer" }}>
                <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} style={{ accentColor:"var(--red)", width:14, height:14 }}/>
                <span style={{ fontSize:13, color:"var(--ink-3)" }}>{label}</span>
              </label>
            ))}
          </div>

          <button onClick={() => setShown(true)} className="btn btn-primary" style={{ padding:"12px 24px", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
            Calculate burn score
          </button>

          {shown && (
            <div className="card" style={{ padding:"22px 24px", overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", gap:20, padding:"16px 20px", borderRadius:10, background:v.bg, marginBottom:18 }}>
                <div style={{ position:"relative", width:96, height:96, flexShrink:0 }}>
                  <svg viewBox="0 0 100 100" style={{ width:"100%", height:"100%", transform:"rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8"/>
                    <circle cx="50" cy="50" r={r} fill="none" stroke={v.color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ transition:"stroke-dashoffset 1s ease" }}/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"monospace", fontSize:24, fontWeight:700, color:v.color, lineHeight:1 }}>{score}</span>
                    <span style={{ fontSize:10, color:v.color, marginTop:1, opacity:0.7 }}>/100</span>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize:20, fontWeight:700, color:v.color, marginBottom:6 }}>{v.label}</p>
                  <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.65 }}>{v.desc}</p>
                </div>
              </div>

              <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:10 }}>Score breakdown</p>
              <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:16 }}>
                {factors.map((f,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                    <span style={{ fontSize:13, color: f.bad ? "var(--ink)" : "var(--ink-3)" }}>{f.label}</span>
                    <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:600, color: f.bad ? "var(--red)" : "var(--green)" }}>{f.impact}</span>
                  </div>
                ))}
              </div>

              {(verdict === "risk" || verdict === "cooked") && (
                <div style={{ paddingTop:14, borderTop:"1px solid var(--border)" }}>
                  <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7, marginBottom:10 }}>
                    {verdict === "cooked"
                      ? "At this score, recovery through repair alone is unlikely to be fast. Pre-warmed replacement infrastructure may get you back to inbox placement significantly faster."
                      : "Address the flagged issues above. If placement doesn't improve within 2 weeks, consider replacing underperforming inboxes."}
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

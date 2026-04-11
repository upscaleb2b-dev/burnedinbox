"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, ExternalLink } from "lucide-react";

const PROVIDERS = [
  { id: "google",    name: "Google Workspace",  dailyPerInbox: 15,  notes: "Gmail enforces strict sending limits. Exceeding risks suspension.", color: "#1967d2" },
  { id: "microsoft", name: "Microsoft 365",     dailyPerInbox: 10,  notes: "M365 accounts flagged more easily. Stay conservative especially when warming.", color: "#0078d4" },
  { id: "azure",     name: "Azure / Outlook",   dailyPerInbox: 2,   notes: "Azure email is highly restricted for cold outbound. Low limits are intentional.", color: "#0078d4" },
  { id: "smtp",      name: "Custom SMTP",       dailyPerInbox: 50,  notes: "Limit depends on your server and IP reputation. 50/day is a safe starting point.", color: "#6b7280" },
  { id: "zoho",      name: "Zoho Mail",         dailyPerInbox: 20,  notes: "Zoho is more permissive but monitor engagement and bounce rates closely.", color: "#e42527" },
];

function fmt(n: number) { return n.toLocaleString(); }

export default function SendLimitsPage() {
  const [providerId, setProviderId] = useState("google");
  const [inboxCount, setInboxCount] = useState(10);
  const [warmupWeek, setWarmupWeek] = useState(1);

  const provider = PROVIDERS.find(p => p.id === providerId)!;

  // Warmup ramp: week 1 = 20%, week 2 = 40%, week 3 = 70%, week 4+ = 100%
  const warmupPct = warmupWeek >= 4 ? 1 : warmupWeek === 3 ? 0.7 : warmupWeek === 2 ? 0.4 : 0.2;
  const perInboxDaily = Math.floor(provider.dailyPerInbox * warmupPct);
  const totalDaily    = perInboxDaily * inboxCount;
  const totalWeekly   = totalDaily * 5; // 5 send days
  const totalMonthly  = totalDaily * 20;

  const safeScaleWeek = Math.ceil(inboxCount * perInboxDaily * 0.8); // 80% safety buffer

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input[type=range]{accent-color:var(--red)} .prov-btn{transition:all 0.15s; cursor:pointer; border:none; background:transparent;} .prov-btn:hover{background:var(--paper-3)!important}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Sending Limit Planner</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Safe daily send limits by provider — includes warmup ramp calculator</p>
        </div>

        {/* Provider selector */}
        <div className="card" style={{ padding:"20px 24px", marginBottom:12 }}>
          <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:12 }}>Email provider</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {PROVIDERS.map(p => (
              <button key={p.id} className="prov-btn" onClick={() => setProviderId(p.id)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:10, border:`1px solid ${providerId === p.id ? p.color : "var(--border)"}`, background: providerId === p.id ? `${p.color}10` : "var(--paper)", textAlign:"left" }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background: providerId === p.id ? p.color : "var(--border)", flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"var(--ink)" }}>{p.name}</span>
                  <span style={{ fontSize:12, color:"var(--ink-4)", marginLeft:10 }}>{p.dailyPerInbox} sends/inbox/day (full warmup)</span>
                </div>
                {providerId === p.id && <span style={{ fontSize:11, fontWeight:700, color:p.color }}>Selected</span>}
              </button>
            ))}
          </div>
          <div style={{ marginTop:14, padding:"12px 14px", borderRadius:8, background:"var(--paper-2)", border:"1px solid var(--border)" }}>
            <p style={{ fontSize:12, color:"var(--ink-3)", lineHeight:1.6 }}>{provider.notes}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="card" style={{ padding:"20px 24px", marginBottom:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)" }}>Number of inboxes</label>
                <span style={{ fontSize:15, fontWeight:700, color:"var(--ink)", fontFamily:"monospace" }}>{inboxCount}</span>
              </div>
              <input type="range" min={1} max={200} step={1} value={inboxCount} onChange={e => setInboxCount(+e.target.value)} style={{ width:"100%" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--ink-4)", marginTop:4 }}>
                <span>1</span><span>200</span>
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)" }}>Warmup week</label>
                <span style={{ fontSize:15, fontWeight:700, color:"var(--ink)", fontFamily:"monospace" }}>Week {warmupWeek}{warmupWeek >= 4 ? "+" : ""}</span>
              </div>
              <input type="range" min={1} max={5} step={1} value={warmupWeek} onChange={e => setWarmupWeek(+e.target.value)} style={{ width:"100%" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--ink-4)", marginTop:4 }}>
                <span>Wk 1 (20%)</span><span>Wk 4+ (100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Output numbers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
          {[
            { label:"Per inbox / day", value:perInboxDaily, sub:`${Math.round(warmupPct*100)}% of ${provider.dailyPerInbox} max` },
            { label:"Total daily", value:fmt(totalDaily), sub:`${inboxCount} inboxes × ${perInboxDaily}` },
            { label:"Monthly capacity", value:fmt(totalMonthly), sub:"20 send days / month" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="card" style={{ padding:"16px 18px" }}>
              <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:6 }}>{label}</p>
              <p style={{ fontFamily:"monospace", fontSize:24, fontWeight:700, color:"var(--ink)", lineHeight:1, marginBottom:4 }}>{value}</p>
              <p style={{ fontSize:11, color:"var(--ink-4)" }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Warmup ramp table */}
        <div className="card" style={{ padding:"20px 24px", marginBottom:12 }}>
          <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:14 }}>Warmup ramp for {inboxCount} inboxes</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
            {[{w:"Week 1",pct:0.2},{w:"Week 2",pct:0.4},{w:"Week 3",pct:0.7},{w:"Week 4+",pct:1}].map(({ w, pct }) => {
              const perInbox = Math.floor(provider.dailyPerInbox * pct);
              const total    = perInbox * inboxCount;
              const active   = Math.round(warmupPct * 100) === Math.round(pct * 100);
              return (
                <div key={w} style={{ padding:"12px", borderRadius:8, background: active ? "var(--red-dim)" : "var(--paper-2)", border:`1px solid ${active ? "var(--red-border)" : "var(--border)"}`, textAlign:"center" }}>
                  <p style={{ fontSize:11, fontWeight:600, color: active ? "var(--red)" : "var(--ink-4)", marginBottom:6 }}>{w}</p>
                  <p style={{ fontFamily:"monospace", fontSize:16, fontWeight:700, color: active ? "var(--red)" : "var(--ink)", lineHeight:1, marginBottom:2 }}>{fmt(total)}</p>
                  <p style={{ fontSize:10, color:"var(--ink-4)" }}>{perInbox}/inbox</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* If limits are tight — WarmInboxes bridge */}
        {totalMonthly < 5000 && (
          <div className="card" style={{ padding:"18px 22px", background:"var(--paper-2)" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:6 }}>Need more volume?</p>
            <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7, marginBottom:12 }}>
              At {fmt(totalMonthly)} monthly sends, you may hit capacity before campaigns finish. Adding more inboxes — especially pre-warmed ones — is the fastest way to increase volume without burning existing accounts.
            </p>
            <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ fontSize:13, fontWeight:500, color:"var(--ink-3)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5, borderBottom:"1px solid var(--border-2)", paddingBottom:1 }}>
              WarmInboxes — pre-warmed inboxes ready to scale <ExternalLink size={11}/>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

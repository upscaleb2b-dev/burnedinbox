"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, ExternalLink } from "lucide-react";

const PROVIDERS = [
  { id:"google",    name:"Google Workspace", dailyPerInbox:15 },
  { id:"microsoft", name:"Microsoft 365",    dailyPerInbox:10 },
  { id:"azure",     name:"Azure / Outlook",  dailyPerInbox:2  },
  { id:"smtp",      name:"Custom SMTP",      dailyPerInbox:50 },
  { id:"zoho",      name:"Zoho Mail",        dailyPerInbox:20 },
];

function fmt(n: number) { return Math.ceil(n).toLocaleString(); }

export default function InfraCalcPage() {
  const [leadsPerMonth, setLeadsPerMonth] = useState(5000);
  const [touchesPerLead, setTouchesPerLead] = useState(3);
  const [campaignCount, setCampaignCount] = useState(2);
  const [clientCount, setClientCount] = useState(1);
  const [providerId, setProviderId] = useState("google");

  const provider  = PROVIDERS.find(p => p.id === providerId)!;
  const sendDays  = 20;
  const totalSends = leadsPerMonth * touchesPerLead * campaignCount * clientCount;
  const dailySends = totalSends / sendDays;
  const inboxesNeeded = Math.ceil(dailySends / provider.dailyPerInbox);
  const backupInboxes = Math.ceil(inboxesNeeded * 0.3); // 30% backup
  const domainsNeeded = Math.ceil(inboxesNeeded / 3); // 3 inboxes per domain max
  const totalInboxes  = inboxesNeeded + backupInboxes;
  const totalDomains  = Math.ceil(totalInboxes / 3);

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

      <div style={{ maxWidth:700, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Infrastructure Calculator</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Calculate exactly how many domains and inboxes you need for your send volume</p>
        </div>

        {/* Inputs */}
        <div className="card" style={{ padding:"20px 24px", marginBottom:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
            {[
              { label:"Leads per month", value:leadsPerMonth, set:setLeadsPerMonth, min:100, max:100000, step:100 },
              { label:"Touches per lead (emails)", value:touchesPerLead, set:setTouchesPerLead, min:1, max:10, step:1 },
              { label:"Active campaigns", value:campaignCount, set:setCampaignCount, min:1, max:20, step:1 },
              { label:"Number of clients", value:clientCount, set:setClientCount, min:1, max:50, step:1 },
            ].map(({ label, value, set, min, max, step }) => (
              <div key={label}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)" }}>{label}</label>
                  <span style={{ fontSize:15, fontWeight:700, color:"var(--ink)", fontFamily:"monospace" }}>{value.toLocaleString()}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value)} style={{ width:"100%" }}/>
              </div>
            ))}
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)", display:"block", marginBottom:8 }}>Email provider</label>
            <select value={providerId} onChange={e => setProviderId(e.target.value)}>
              {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name} — {p.dailyPerInbox} sends/inbox/day</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:12 }}>
          {[
            { label:"Active inboxes needed",   value:fmt(inboxesNeeded),  color:"var(--ink)", sub:`${provider.dailyPerInbox} sends/day × ${fmt(dailySends)} daily sends` },
            { label:"Backup inboxes (30%)",     value:fmt(backupInboxes),  color:"var(--yellow)", sub:"Rotate in if active inboxes show issues" },
            { label:"Domains needed",           value:fmt(domainsNeeded),  color:"var(--ink)", sub:"Max 3 inboxes per domain" },
            { label:"Total monthly sends",      value:fmt(totalSends),     color:"var(--red)", sub:`${fmt(leadsPerMonth)} leads × ${touchesPerLead} touches × ${campaignCount} campaigns` },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="card" style={{ padding:"16px 18px" }}>
              <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:6 }}>{label}</p>
              <p style={{ fontFamily:"monospace", fontSize:26, fontWeight:700, color, lineHeight:1, marginBottom:4 }}>{value}</p>
              <p style={{ fontSize:11, color:"var(--ink-4)", lineHeight:1.5 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Summary recommendation */}
        <div className="card" style={{ padding:"20px 24px", borderLeft:"3px solid var(--ink)", marginBottom:12 }}>
          <p style={{ fontSize:14, fontWeight:700, color:"var(--ink)", marginBottom:10 }}>Infrastructure summary</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {[
              `${fmt(totalDomains)} total domains (${fmt(domainsNeeded)} active + ${fmt(Math.ceil(backupInboxes/3))} backup domains)`,
              `${fmt(totalInboxes)} total inboxes (${fmt(inboxesNeeded)} active + ${fmt(backupInboxes)} backup)`,
              `${provider.dailyPerInbox} sends per inbox per day on ${provider.name}`,
              `${fmt(totalSends)} monthly sends across ${clientCount} client${clientCount > 1 ? "s" : ""}`,
            ].map(l => (
              <div key={l} style={{ display:"flex", gap:8, fontSize:13, color:"var(--ink-3)" }}>
                <span style={{ color:"var(--green)", flexShrink:0, marginTop:1 }}>→</span>{l}
              </div>
            ))}
          </div>
        </div>

        {/* WarmInboxes CTA */}
        <div className="card" style={{ padding:"18px 22px", background:"var(--paper-2)" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:6 }}>Need {fmt(totalInboxes)} inboxes?</p>
          <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7, marginBottom:12 }}>
            Setting up {fmt(inboxesNeeded)} active inboxes from scratch means weeks of warmup before you can send at full capacity. Pre-warmed inboxes skip the ramp — ready to send from day one.
          </p>
          <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ fontSize:13, fontWeight:500, color:"var(--ink-3)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5, borderBottom:"1px solid var(--border-2)", paddingBottom:1 }}>
            WarmInboxes — pre-warmed inboxes and domains <ExternalLink size={11}/>
          </a>
        </div>
      </div>
    </div>
  );
}

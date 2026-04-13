"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

const PROVIDERS = [
  { id: "google",    name: "Google Workspace", limit: 15 },
  { id: "microsoft", name: "Microsoft 365",    limit: 10 },
  { id: "smtp",      name: "Custom SMTP",      limit: 50 },
];

const ceil = (n: number) => Math.ceil(n);
const fmt  = (n: number) => Math.round(n).toLocaleString();

export default function ClientCapacityPage() {
  const [clients, setClients]       = useState(5);
  const [leads, setLeads]           = useState(1000);
  const [touches, setTouches]       = useState(3);
  const [providerId, setProvider]   = useState("google");
  const [sendDays, setSendDays]     = useState(22);
  const [backupPct, setBackupPct]   = useState(25);

  const prov           = PROVIDERS.find(p => p.id === providerId)!;
  const totalSends     = clients * leads * touches;
  const dailyNeeded    = totalSends / sendDays;
  const activeInboxes  = ceil(dailyNeeded / prov.limit);
  const backupInboxes  = ceil(activeInboxes * backupPct / 100);
  const totalInboxes   = activeInboxes + backupInboxes;
  const domains        = ceil(totalInboxes / 3);
  const inboxPerClient = ceil(activeInboxes / clients);
  const domsPerClient  = ceil(domains / clients);
  const costLow        = totalInboxes * 6;
  const costHigh       = totalInboxes * 15;

  const Card = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div style={{ padding: 16, background: "var(--paper-2)", border: "1px solid var(--border)", borderRadius: 10, textAlign: "center" }}>
      <p style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Geist Mono',monospace", color: "var(--red)" }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input[type=range]{accent-color:var(--red);width:100%} select{appearance:none;background:var(--paper);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-size:13px;color:var(--ink);width:100%;cursor:pointer}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Calculators</Link>
      </nav>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"48px 24px 80px" }}>
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.08em", color:"var(--red)", marginBottom:8 }}>Calculator · Agency</p>
          <h1 style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", color:"var(--ink)", marginBottom:10, letterSpacing:"-0.3px" }}>Client Capacity Planner</h1>
          <p style={{ fontSize:15, color:"var(--ink-3)", lineHeight:1.7 }}>Plan the full infrastructure needed to run cold email across all your agency clients — with backup built in.</p>
        </div>

        <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:24, marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:20 }}>Your agency setup</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
            {([
              { label:"Clients", val:clients, set:setClients, min:1, max:50 },
              { label:"Leads per client / month", val:leads, set:setLeads, min:100, max:10000, step:100 },
              { label:"Email touches per lead", val:touches, set:setTouches, min:1, max:8 },
              { label:"Sending days / month", val:sendDays, set:setSendDays, min:15, max:26 },
              { label:"Backup pool", val:backupPct, set:setBackupPct, min:10, max:50, suffix:"%" },
            ] as { label:string; val:number; set:(v:number)=>void; min:number; max:number; step?:number; suffix?:string }[]).map(({ label, val, set, min, max, step, suffix }) => (
              <div key={label}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>{label}</label>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>{val.toLocaleString()}{suffix||""}</span>
                </div>
                <input type="range" min={min} max={max} step={step||1} value={val} onChange={e => set(+e.target.value)} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--ink-5)", marginTop:4 }}><span>{min}{suffix||""}</span><span>{max.toLocaleString()}{suffix||""}</span></div>
              </div>
            ))}
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:"var(--ink)", display:"block", marginBottom:8 }}>Provider</label>
              <select value={providerId} onChange={e => setProvider(e.target.value)}>
                {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.limit}/day)</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
          <Card label="Total sends / month" value={fmt(totalSends)} sub={`${clients} clients × ${leads.toLocaleString()} leads × ${touches} touches`} />
          <Card label="Active inboxes" value={fmt(activeInboxes)} sub={`${prov.limit} sends/day each`} />
          <Card label="Total with backup" value={fmt(totalInboxes)} sub={`+${backupPct}% reserve`} />
          <Card label="Domains needed" value={fmt(domains)} sub="max 3 inboxes each" />
          <Card label="Inboxes per client" value={fmt(inboxPerClient)} sub="average" />
          <Card label="Domains per client" value={fmt(domsPerClient)} sub="isolated pool" />
        </div>

        <div style={{ background:"var(--paper)", border:"1px solid var(--border)", borderRadius:12, padding:"20px 24px", marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:16 }}>Monthly infra cost estimate</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ textAlign:"center", padding:14, background:"var(--paper-2)", borderRadius:8 }}>
              <p style={{ fontSize:11, color:"var(--ink-4)" }}>Conservative ($6/inbox)</p>
              <p style={{ fontSize:22, fontWeight:700, color:"var(--ink)", fontFamily:"'Geist Mono',monospace" }}>${costLow.toLocaleString()}/mo</p>
            </div>
            <div style={{ textAlign:"center", padding:14, background:"var(--red-dim)", border:"1px solid var(--red-border)", borderRadius:8 }}>
              <p style={{ fontSize:11, color:"var(--red)" }}>High-end ($15/inbox)</p>
              <p style={{ fontSize:22, fontWeight:700, color:"var(--red)", fontFamily:"'Geist Mono',monospace" }}>${costHigh.toLocaleString()}/mo</p>
            </div>
          </div>
        </div>

        <div style={{ padding:"16px 20px", background:"var(--red-dim)", border:"1px solid var(--red-border)", borderRadius:10 }}>
          <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7 }}>
            <strong style={{ color:"var(--ink)" }}>Agency rule:</strong> Never put two clients on the same domain. One client's spam complaints burn everyone else. For pre-warmed inboxes deployable same-day, <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ color:"var(--red)", fontWeight:600, textDecoration:"none" }}>WarmInboxes</a> has GWS and M365 options ready to go.
          </p>
        </div>
      </div>
    </div>
  );
}

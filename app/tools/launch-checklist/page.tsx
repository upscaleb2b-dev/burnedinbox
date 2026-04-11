"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, Circle, ExternalLink } from "lucide-react";

const SECTIONS = [
  { title:"Domain setup", items:[
    { id:"domain-age", label:"Domain is at least 30 days old", critical:true, link:"/tools/domain-expiry" },
    { id:"redirect",   label:"Root domain redirects correctly (http → https)", critical:true, link:"/tools/redirect" },
    { id:"www",        label:"www subdomain also redirects correctly", critical:false },
    { id:"ssl",        label:"SSL certificate is valid on root domain", critical:true },
  ]},
  { title:"Authentication", items:[
    { id:"spf",   label:"SPF record published and valid", critical:true, link:"/tools/spf" },
    { id:"dkim",  label:"DKIM record published (correct selector)", critical:true, link:"/tools/dkim" },
    { id:"dmarc", label:"DMARC record published (at least p=none)", critical:true, link:"/tools/dmarc" },
    { id:"mx",    label:"MX records configured correctly", critical:false, link:"/tools/mx" },
  ]},
  { title:"Tracking & infrastructure", items:[
    { id:"tracking-cname", label:"Tracking domain has correct CNAME", critical:true, link:"/tools/tracking-domain" },
    { id:"tracking-ssl",   label:"Tracking domain has valid SSL", critical:true, link:"/tools/tracking-domain" },
    { id:"tracking-cf",    label:"Tracking domain NOT proxied through Cloudflare", critical:true, link:"/tools/tracking-domain" },
    { id:"tracking-iso",   label:"Tracking domain is separate from primary domain", critical:false },
  ]},
  { title:"Mailbox warmup", items:[
    { id:"warmup-days",  label:"Inbox has been warming for 21+ days", critical:true, link:"/tools/warmup-ready" },
    { id:"warmup-int",   label:"Warmup had human interactions (opens/replies)", critical:true },
    { id:"warmup-vol",   label:"Volume was ramped gradually", critical:true },
    { id:"warmup-clean", label:"No spam signals during warmup", critical:true },
  ]},
  { title:"Pre-send checks", items:[
    { id:"blacklist",  label:"Domain not blacklisted on any RBL", critical:true, link:"/tools/blacklist" },
    { id:"rdns",       label:"Sending IP has a PTR record (rDNS)", critical:false, link:"/tools/rdns" },
    { id:"send-limit", label:"Daily send limit set below safe threshold", critical:true, link:"/tools/send-limits" },
    { id:"reply",      label:"Reply routing tested and working", critical:false },
    { id:"unsubscribe",label:"Unsubscribe / opt-out mechanism in place", critical:false },
  ]},
];

export default function LaunchChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const allItems     = SECTIONS.flatMap(s => s.items);
  const criticalItems= allItems.filter(i => i.critical);
  const doneAll      = allItems.filter(i => checked.has(i.id)).length;
  const doneCritical = criticalItems.filter(i => checked.has(i.id)).length;
  const pct          = Math.round((doneAll / allItems.length) * 100);
  const critPct      = Math.round((doneCritical / criticalItems.length) * 100);
  const launchReady  = doneCritical === criticalItems.length;

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} .item:hover{background:var(--paper-2)!important}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Cold Email Launch Checklist</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Complete all critical items before sending. Links to each checker are included.</p>
        </div>

        {/* Progress */}
        <div className="card" style={{ padding:"18px 22px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <p style={{ fontSize:22, fontWeight:700, color: launchReady ? "var(--green)" : "var(--ink)", fontFamily:"monospace" }}>{doneAll}/{allItems.length}</p>
              <p style={{ fontSize:12, color:"var(--ink-4)" }}>items complete</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontSize:22, fontWeight:700, color: launchReady ? "var(--green)" : doneCritical === 0 ? "var(--red)" : "var(--yellow)", fontFamily:"monospace" }}>{doneCritical}/{criticalItems.length}</p>
              <p style={{ fontSize:12, color:"var(--ink-4)" }}>critical items</p>
            </div>
          </div>
          <div style={{ height:6, background:"var(--paper-3)", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
            <div style={{ height:"100%", background: launchReady ? "var(--green)" : "var(--red)", borderRadius:3, width:`${critPct}%`, transition:"width 0.3s ease" }}/>
          </div>
          <p style={{ fontSize:12, fontWeight:600, color: launchReady ? "var(--green)" : "var(--red)" }}>
            {launchReady ? "✓ All critical checks complete — ready to launch" : `${criticalItems.length - doneCritical} critical item${criticalItems.length - doneCritical !== 1 ? "s" : ""} remaining`}
          </p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {SECTIONS.map(section => (
            <div key={section.title} className="card" style={{ overflow:"hidden" }}>
              <div style={{ padding:"12px 20px", borderBottom:"1px solid var(--border)", background:"var(--paper-2)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)" }}>{section.title}</p>
                <p style={{ fontSize:12, color:"var(--ink-4)" }}>
                  {section.items.filter(i => checked.has(i.id)).length}/{section.items.length}
                </p>
              </div>
              {section.items.map(item => {
                const done = checked.has(item.id);
                return (
                  <div key={item.id} className="item" onClick={() => toggle(item.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:"1px solid var(--border)", cursor:"pointer", background:"var(--paper)", transition:"background 0.1s" }}>
                    {done ? <CheckCircle2 size={18} style={{ color:"var(--green)", flexShrink:0 }}/> : <Circle size={18} style={{ color:"var(--border-2)", flexShrink:0 }}/>}
                    <span style={{ flex:1, fontSize:13, color: done ? "var(--ink-3)" : "var(--ink)", textDecoration: done ? "line-through" : "none" }}>{item.label}</span>
                    {item.critical && !done && <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4, background:"var(--red-dim)", color:"var(--red)", flexShrink:0 }}>Required</span>}
                    {item.link && !done && (
                      <Link href={item.link} onClick={e => e.stopPropagation()} style={{ fontSize:11, color:"var(--ink-4)", textDecoration:"none", flexShrink:0, display:"flex", alignItems:"center", gap:3 }}>
                        Check <ExternalLink size={10}/>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

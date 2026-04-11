"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Link as LinkIcon, Shield, Globe } from "lucide-react";

interface TrackingResult {
  domain: string; primaryDomain: string | null;
  cname: string | null; cnameTarget: string | null;
  ips: string[]; hasMX: boolean; hasSPF: boolean;
  cloudflareProxied: boolean;
  ssl: { ok: boolean; target?: string; error?: string };
  issues: string[]; tips: string[]; score: number;
}

const CNAME_TARGET_COLORS: Record<string, string> = {
  "Google Workspace":"#1967d2","Microsoft 365":"#0078d4","SendGrid":"#1b9fd8",
  "Mailgun":"#c81d25","Postmark":"#ffcc00","Klaviyo":"#1f2937",
  "Instantly":"#6366f1","Smartlead":"#8b5cf6","Lemlist":"#f97316",
  "Outreach":"#16a34a","Salesloft":"#0ea5e9","Cloudflare":"#f97316",
  "HubSpot":"#ff5c35","Marketo":"#5c4ee5","AWS":"#d97706","Fastly":"#ff282d","CloudFront":"#d97706",
};

function ScoreRing({ score }: { score: number }) {
  const r = 40, circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = score >= 75 ? "var(--green)" : score >= 45 ? "var(--yellow)" : "var(--red)";
  return (
    <div style={{ position:"relative", width:88, height:88, flexShrink:0 }}>
      <svg viewBox="0 0 100 100" style={{ width:"100%", height:"100%", transform:"rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-3)" strokeWidth="8"/>
        <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off} style={{ transition:"stroke-dashoffset 1s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"monospace", fontSize:20, fontWeight:700, lineHeight:1, color:col }}>{score}</span>
        <span style={{ fontSize:9, color:"var(--ink-4)", marginTop:1 }}>/100</span>
      </div>
    </div>
  );
}

function CheckRow({ label, value, ok, warn, detail }: { label: string; value?: string; ok?: boolean; warn?: boolean; detail?: string }) {
  const Icon = ok === true ? CheckCircle2 : ok === false ? XCircle : AlertTriangle;
  const col  = ok === true ? "var(--green)" : ok === false ? "var(--red)" : "var(--yellow)";
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
      <Icon size={14} style={{ color:col, flexShrink:0, marginTop:1 }}/>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: detail ? 3 : 0 }}>
          <span style={{ fontSize:13, fontWeight:500, color:"var(--ink)" }}>{label}</span>
          {value && <code style={{ fontFamily:"monospace", fontSize:11, color:"var(--ink-3)", background:"var(--paper-2)", padding:"1px 6px", borderRadius:4, border:"1px solid var(--border)" }}>{value}</code>}
        </div>
        {detail && <p style={{ fontSize:12, color:"var(--ink-4)", lineHeight:1.5 }}>{detail}</p>}
      </div>
    </div>
  );
}

export default function TrackingDomainPage() {
  const [domain, setDomain] = useState("");
  const [primary, setPrimary] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");

  const check = async () => {
    if (!domain.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/tracking-domain", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ domain: domain.trim(), primaryDomain: primary.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed");
      setResult(data);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fade-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} .fade-up{animation:fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both} input:focus{outline:none;border-color:var(--ink)!important;box-shadow:0 0 0 3px rgba(12,12,12,0.07)} *{box-sizing:border-box;margin:0;padding:0} input::placeholder{color:var(--ink-5)}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:660, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <LinkIcon size={18} style={{ color:"#7c3aed" }}/>
          </div>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px" }}>Tracking Domain Checker</h1>
            <p style={{ fontSize:13, color:"var(--ink-4)", marginTop:2 }}>Verify CNAME setup, Cloudflare proxy issues, SSL, isolation from primary domain, and ESP detection</p>
          </div>
        </div>

        <div className="card" style={{ padding:"20px 24px", marginBottom:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:7 }}>Tracking domain</label>
              <input className="input" type="text" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key==="Enter" && check()}
                placeholder="track.yourdomain.com" style={{ fontFamily:"monospace", fontSize:13 }}/>
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:7 }}>
                Primary domain <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"var(--ink-5)" }}>(optional)</span>
              </label>
              <input className="input" type="text" value={primary} onChange={e => setPrimary(e.target.value)} onKeyDown={e => e.key==="Enter" && check()}
                placeholder="yourdomain.com" style={{ fontFamily:"monospace", fontSize:13 }}/>
            </div>
          </div>
          <button onClick={check} disabled={loading || !domain.trim()} className="btn btn-primary" style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 22px", fontSize:13 }}>
            {loading ? <div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/> : <><LinkIcon size={13}/> Check tracking domain</>}
          </button>
          <p style={{ fontSize:12, color:"var(--ink-4)", marginTop:10 }}>Enter the subdomain you use for email tracking links. Optionally provide your primary domain to check isolation.</p>
        </div>

        {error && <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px", borderRadius:10, background:"var(--red-dim)", border:"1px solid var(--red-border)", color:"var(--red)", fontSize:13, marginBottom:14 }}><XCircle size={14}/> {error}</div>}

        {result && !loading && (
          <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Score + CNAME */}
            <div className="card" style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <ScoreRing score={result.score}/>
                <div style={{ flex:1 }}>
                  <code style={{ fontFamily:"monospace", fontSize:13, color:"var(--ink-2)", display:"block", marginBottom:6 }}>{result.domain}</code>
                  {result.cnameTarget && (
                    <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"3px 10px", borderRadius:100, background: CNAME_TARGET_COLORS[result.cnameTarget] ? `${CNAME_TARGET_COLORS[result.cnameTarget]}15` : "var(--paper-3)", border:`1px solid ${CNAME_TARGET_COLORS[result.cnameTarget] || "var(--border)"}44` }}>
                      <span style={{ fontSize:12, fontWeight:600, color: CNAME_TARGET_COLORS[result.cnameTarget] || "var(--ink-3)" }}>{result.cnameTarget}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Check rows */}
              <div style={{ borderTop:"1px solid var(--border)" }}>
                <CheckRow
                  label="CNAME record"
                  value={result.cname ? result.cname.slice(0, 45) + (result.cname.length > 45 ? "…" : "") : undefined}
                  ok={!!result.cname}
                  detail={result.cname ? `Correctly pointed to ${result.cnameTarget || "tracking provider"}` : "No CNAME found — tracking domain is not pointed to an ESP"}
                />
                <CheckRow
                  label="Cloudflare proxy"
                  ok={!result.cloudflareProxied}
                  warn={result.cloudflareProxied}
                  detail={result.cloudflareProxied ? "Proxied through Cloudflare (orange cloud) — this breaks click tracking. Set to DNS Only (grey cloud) in Cloudflare." : "Not proxied through Cloudflare — correct for a tracking domain"}
                />
                <CheckRow
                  label="SSL / HTTPS"
                  ok={result.ssl.ok}
                  detail={result.ssl.ok ? "Tracking domain responds over HTTPS — links will be served securely" : `SSL check failed: ${result.ssl.error || "Could not connect"}`}
                />
                <CheckRow
                  label="MX records"
                  ok={!result.hasMX}
                  warn={result.hasMX}
                  detail={result.hasMX ? "Tracking domain has MX records — this domain appears to also receive email, which is unusual for a tracking-only domain" : "No MX records — correct for a tracking-only domain"}
                />
                {result.primaryDomain && (
                  <CheckRow
                    label="Domain isolation"
                    ok={!result.domain.endsWith(`.${result.primaryDomain}`) && result.domain !== result.primaryDomain}
                    detail={result.domain.endsWith(`.${result.primaryDomain}`)
                      ? `Tracking domain is a subdomain of your primary domain (${result.primaryDomain}) — use a completely separate domain to protect your primary reputation`
                      : `Tracking domain is isolated from your primary domain (${result.primaryDomain}) — good`}
                  />
                )}
                <div style={{ borderBottom:"none" }}>
                  <CheckRow
                    label="IP addresses"
                    value={result.ips.length > 0 ? result.ips.slice(0,2).join(", ") : "None"}
                    ok={result.ips.length > 0}
                    detail={result.ips.length > 0 ? `Resolves to ${result.ips.length} IP${result.ips.length > 1 ? "s" : ""}` : "Domain doesn't resolve to any IP — may not be set up yet"}
                  />
                </div>
              </div>
            </div>

            {/* Issues + tips */}
            {result.issues.map((i, idx) => (
              <div key={idx} style={{ display:"flex", gap:8, padding:"10px 14px", borderRadius:10, background:"var(--red-dim)", border:"1px solid var(--red-border)" }}>
                <XCircle size={14} style={{ color:"var(--red)", flexShrink:0, marginTop:1 }}/><span style={{ fontSize:13, color:"var(--red)" }}>{i}</span>
              </div>
            ))}
            {result.tips.map((t, idx) => (
              <div key={idx} style={{ display:"flex", gap:8, padding:"10px 14px", borderRadius:10, background:"var(--yellow-dim)", border:"1px solid rgba(146,96,10,0.2)" }}>
                <AlertTriangle size={14} style={{ color:"var(--yellow)", flexShrink:0, marginTop:1 }}/><span style={{ fontSize:13, color:"var(--yellow)" }}>{t}</span>
              </div>
            ))}

            {result.issues.length === 0 && result.tips.length === 0 && (
              <div className="card" style={{ padding:"16px 20px", borderLeft:"3px solid var(--green)", display:"flex", gap:10, alignItems:"flex-start" }}>
                <CheckCircle2 size={15} style={{ color:"var(--green)", flexShrink:0, marginTop:2 }}/>
                <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.65 }}>Tracking domain is correctly configured — CNAME is set, SSL works, not proxied through Cloudflare, and properly isolated.</p>
              </div>
            )}

            <button onClick={() => { setResult(null); setDomain(""); setPrimary(""); }} className="btn btn-ghost" style={{ fontSize:13, display:"flex", alignItems:"center", gap:6, alignSelf:"flex-start" }}>
              <RefreshCw size={13}/> Check another domain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

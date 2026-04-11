"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ExternalLink as ExtLink } from "lucide-react";

interface LinkResult { url:string; status:number|null; isRedirect:boolean; isBroken:boolean; isHttp:boolean; finalLocation:string|null; issues:string[]; ok:boolean; }
interface CheckResult { links:LinkResult[]; total:number; issues:number; clean:number; message?:string; }

export default function LinkCheckPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<CheckResult | null>(null);
  const [error, setError]     = useState("");

  const check = async () => {
    if (!content.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/link-check", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed");
      setResult(data);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fade-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} .fade-up{animation:fade-up 0.4s ease both} *{box-sizing:border-box;margin:0;padding:0} textarea:focus{outline:none;border-color:var(--ink)!important;box-shadow:0 0 0 3px rgba(12,12,12,0.07)}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Link Reputation Checker</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Paste your email body — we check every link for redirects, broken URLs, HTTP issues, shorteners, and param bloat</p>
        </div>

        <div className="card" style={{ padding:"20px 24px", marginBottom:14 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:8 }}>Email content (HTML or plain text)</label>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder={"Hi there,\n\nCheck out our latest offer at https://example.com/offer?utm_source=email&utm_campaign=spring\n\nClick here: https://bit.ly/abc123\n\n– Team"}
            style={{ width:"100%", height:180, padding:"12px 14px", border:"1px solid var(--border)", borderRadius:8, background:"var(--paper)", fontFamily:"monospace", fontSize:12, color:"var(--ink)", resize:"vertical", lineHeight:1.7 }}/>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
            <p style={{ fontSize:12, color:"var(--ink-4)" }}>Extracts and checks up to 30 URLs. Results may take a few seconds.</p>
            <button onClick={check} disabled={loading || !content.trim()} className="btn btn-primary" style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 22px", fontSize:13 }}>
              {loading ? <div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/> : "Check links"}
            </button>
          </div>
        </div>

        {error && <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px", borderRadius:10, background:"var(--red-dim)", border:"1px solid var(--red-border)", color:"var(--red)", fontSize:13, marginBottom:14 }}><XCircle size={14}/> {error}</div>}

        {result && !loading && (
          <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {result.message ? (
              <div className="card" style={{ padding:"24px", textAlign:"center", color:"var(--ink-4)" }}>{result.message}</div>
            ) : (
              <>
                {/* Summary */}
                <div className="card" style={{ padding:"16px 22px", display:"flex", gap:20 }}>
                  <div><span style={{ fontFamily:"monospace", fontSize:22, fontWeight:700, color:"var(--ink)" }}>{result.total}</span><span style={{ fontSize:12, color:"var(--ink-4)", marginLeft:5 }}>links found</span></div>
                  <div><span style={{ fontFamily:"monospace", fontSize:22, fontWeight:700, color:"var(--green)" }}>{result.clean}</span><span style={{ fontSize:12, color:"var(--ink-4)", marginLeft:5 }}>clean</span></div>
                  <div><span style={{ fontFamily:"monospace", fontSize:22, fontWeight:700, color:"var(--red)" }}>{result.issues}</span><span style={{ fontSize:12, color:"var(--ink-4)", marginLeft:5 }}>issues</span></div>
                </div>

                {/* Link rows */}
                <div className="card" style={{ overflow:"hidden" }}>
                  {result.links.map((l,i) => (
                    <div key={i} style={{ padding:"12px 18px", borderBottom:"1px solid var(--border)", background:!l.ok ? "rgba(212,43,43,0.02)" : "var(--paper)" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom: l.issues.length > 0 ? 8 : 0 }}>
                        {l.ok ? <CheckCircle2 size={14} style={{ color:"var(--green)", flexShrink:0, marginTop:2 }}/> : <XCircle size={14} style={{ color:"var(--red)", flexShrink:0, marginTop:2 }}/>}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <code style={{ fontFamily:"monospace", fontSize:11, color:l.isBroken?"var(--red)":"var(--ink-2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:380 }}>{l.url}</code>
                            <a href={l.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color:"var(--ink-4)", flexShrink:0 }}><ExtLink size={10}/></a>
                          </div>
                          {l.status && <span style={{ fontSize:10, fontFamily:"monospace", fontWeight:700, color: l.status < 300 ? "var(--green)" : l.status < 400 ? "#2563eb" : "var(--red)", marginTop:2, display:"inline-block" }}>{l.status}</span>}
                          {l.isRedirect && l.finalLocation && <span style={{ fontSize:10, color:"var(--ink-4)", marginLeft:8 }}>→ {l.finalLocation.slice(0,50)}{l.finalLocation.length > 50 ? "…" : ""}</span>}
                        </div>
                      </div>
                      {l.issues.map((iss, j) => (
                        <div key={j} style={{ display:"flex", gap:6, marginTop:4, paddingLeft:24 }}>
                          <AlertTriangle size={11} style={{ color:"var(--red)", flexShrink:0, marginTop:1 }}/>
                          <span style={{ fontSize:12, color:"var(--red)" }}>{iss}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {result.issues === 0 && (
                  <div className="card" style={{ padding:"16px 20px", borderLeft:"3px solid var(--green)", display:"flex", gap:10 }}>
                    <CheckCircle2 size={15} style={{ color:"var(--green)", flexShrink:0, marginTop:2 }}/>
                    <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.65 }}>All links look clean — no broken URLs, HTTP issues, shorteners, or parameter bloat detected.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

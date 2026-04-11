"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Shield, RefreshCw } from "lucide-react";

interface RBLResult { name:string; zone:string; severity:string; listed:boolean; }
interface BlacklistResult { query:string; isIp:boolean; ip:string|null; total:number; listed:number; clean:number; checks:RBLResult[]; score:number; verdict:string; }

const SEVERITY_COLORS: Record<string, string> = { critical:"var(--red)", high:"#d97706", medium:"var(--yellow)", low:"var(--ink-4)" };

export default function BlacklistPage() {
  const [query, setQuery]   = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BlacklistResult | null>(null);
  const [error, setError]   = useState("");

  const check = async () => {
    if (!query.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/blacklist-check", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed");
      setResult(data);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const score = result?.score ?? 100;
  const scoreColor = score >= 80 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";
  const verdictMap: Record<string, string> = { clean:"Clean across all blacklists", minor:"Minor listings detected", warning:"Significant blacklist exposure", critical:"Critical blacklist listings" };

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fade-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} .fade-up{animation:fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both} .rbl-row{opacity:0;animation:fade-up 0.3s cubic-bezier(0.22,1,0.36,1) forwards} *{box-sizing:border-box;margin:0;padding:0} input:focus{outline:none;border-color:var(--ink)!important;box-shadow:0 0 0 3px rgba(12,12,12,0.07)} input::placeholder{color:var(--ink-5)}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"var(--red-dim)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Shield size={18} style={{ color:"var(--red)" }}/>
          </div>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px" }}>Blacklist Checker</h1>
            <p style={{ fontSize:13, color:"var(--ink-4)", marginTop:2 }}>Check any domain or IP against 16 major real-time blacklists</p>
          </div>
        </div>

        <div className="card" style={{ padding:"20px 24px", marginBottom:14 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:7 }}>Domain or IP address</label>
          <div style={{ display:"flex", gap:10 }}>
            <input className="input" type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==="Enter" && check()}
              placeholder="yourdomain.com or 1.2.3.4"
              style={{ flex:1, fontFamily:"monospace", fontSize:13 }}/>
            <button onClick={check} disabled={loading || !query.trim()} className="btn btn-primary" style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 22px", fontSize:13, flexShrink:0 }}>
              {loading ? <div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/> : <><Shield size={13}/> Check</>}
            </button>
          </div>
          <p style={{ fontSize:12, color:"var(--ink-4)", marginTop:10 }}>Checks Spamhaus ZEN/DBL, SURBL, Barracuda, SpamCop, UCEPROTECT L1/L2/L3, Mailspike, Abusix, and more.</p>
        </div>

        {error && <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px", borderRadius:10, background:"var(--red-dim)", border:"1px solid var(--red-border)", color:"var(--red)", fontSize:13, marginBottom:14 }}><XCircle size={14}/> {error}</div>}

        {result && !loading && (
          <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Summary */}
            <div className="card" style={{ padding:"20px 24px", overflow:"hidden" }}>
              <div style={{ padding:"14px 18px", borderRadius:10, background: result.listed === 0 ? "var(--green-dim)" : "var(--red-dim)", border:`1px solid ${result.listed === 0 ? "rgba(26,122,63,0.2)" : "var(--red-border)"}`, display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                {result.listed === 0 ? <CheckCircle2 size={24} style={{ color:"var(--green)", flexShrink:0 }}/> : <XCircle size={24} style={{ color:"var(--red)", flexShrink:0 }}/>}
                <div>
                  <p style={{ fontSize:16, fontWeight:700, color: result.listed === 0 ? "var(--green)" : "var(--red)", marginBottom:4 }}>{verdictMap[result.verdict] || result.verdict}</p>
                  <p style={{ fontSize:13, color:"var(--ink-3)" }}>
                    {result.listed === 0 ? `Clean across all ${result.total} blacklists checked` : `Listed on ${result.listed} of ${result.total} blacklists — action required`}
                  </p>
                </div>
                <div style={{ marginLeft:"auto", textAlign:"right" }}>
                  <span style={{ fontFamily:"monospace", fontSize:28, fontWeight:700, color:scoreColor }}>{score}</span>
                  <div style={{ fontSize:11, color:"var(--ink-4)" }}>/100 score</div>
                </div>
              </div>

              <div style={{ display:"flex", gap: 16, marginBottom:16 }}>
                {[{n:result.clean,l:"Clean",c:"var(--green)"},{n:result.listed,l:"Listed",c:"var(--red)"}].map(({n,l,c}) => (
                  <div key={l}>
                    <span style={{ fontFamily:"monospace", fontSize:22, fontWeight:700, color:c }}>{n}</span>
                    <span style={{ fontSize:12, color:"var(--ink-4)", marginLeft:5 }}>{l}</span>
                  </div>
                ))}
                {result.ip && result.ip !== result.query && <div style={{ marginLeft:"auto", fontSize:12, color:"var(--ink-4)" }}>IP resolved: <code style={{ fontFamily:"monospace" }}>{result.ip}</code></div>}
              </div>

              {/* Listed results */}
              {result.checks.filter(c => c.listed).map((c,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:8, background:"var(--red-dim)", border:"1px solid var(--red-border)", marginBottom:6 }}>
                  <XCircle size={14} style={{ color:"var(--red)", flexShrink:0 }}/>
                  <span style={{ fontSize:13, fontWeight:600, color:"var(--red)", flex:1 }}>{c.name}</span>
                  <span style={{ fontSize:11, fontWeight:600, padding:"2px 7px", borderRadius:4, color: SEVERITY_COLORS[c.severity] || "var(--ink-4)", background:`${(SEVERITY_COLORS[c.severity] || "var(--ink-4)").replace("var(","").replace(")","")}-dim` || "var(--paper-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{c.severity}</span>
                </div>
              ))}

              {/* Clean list (collapsed) */}
              <div style={{ marginTop: result.checks.filter(c=>c.listed).length > 0 ? 12 : 0 }}>
                <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:8 }}>All blacklists checked</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {result.checks.map((c,i) => (
                    <div key={i} className="rbl-row" style={{ animationDelay:`${i*0.02}s`, display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:100, border:`1px solid ${c.listed ? "var(--red-border)" : "var(--border)"}`, background:c.listed ? "var(--red-dim)" : "var(--paper-2)" }}>
                      {c.listed ? <XCircle size={10} style={{ color:"var(--red)" }}/> : <CheckCircle2 size={10} style={{ color:"var(--green)" }}/>}
                      <span style={{ fontSize:11, color:c.listed ? "var(--red)" : "var(--ink-4)" }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.listed > 0 && (
              <div className="card" style={{ padding:"18px 22px", borderLeft:"3px solid var(--red)" }}>
                <p style={{ fontSize:14, fontWeight:600, color:"var(--red)", marginBottom:8 }}>What to do about blacklisting</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:13, color:"var(--ink-3)" }}>
                  {["Identify the root cause — spam complaints, compromised account, or abusive sending patterns","Fix the underlying issue before requesting delisting — re-listing is common if root cause isn't resolved","Submit delisting requests to each blacklist (Spamhaus requires a form, Barracuda has a self-service lookup)","Monitor for 7–14 days after delisting to confirm you don't re-appear"].map((s,i) => (
                    <div key={i} style={{ display:"flex", gap:8 }}><span style={{ color:"var(--red)", flexShrink:0, marginTop:1 }}>→</span>{s}</div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => { setResult(null); setQuery(""); }} className="btn btn-ghost" style={{ fontSize:13, display:"flex", alignItems:"center", gap:6, alignSelf:"flex-start" }}>
              <RefreshCw size={13}/> Check another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

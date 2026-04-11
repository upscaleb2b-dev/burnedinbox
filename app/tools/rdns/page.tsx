"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Zap } from "lucide-react";

interface VerifiedPTR { ptr: string; forwardIps: string[]; confirmed: boolean; }
interface RDNSResult {
  ip: string; found: boolean; ptrs: string[];
  verified: VerifiedPTR[];
  forwardConfirmed: boolean; anyConfirmed: boolean;
  issues: string[]; tips: string[]; score: number;
  message?: string;
}

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

export default function RDNSPage() {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RDNSResult | null>(null);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!ip.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/rdns-lookup", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ip: ip.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
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

      <div style={{ maxWidth:640, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Zap size={18} style={{ color:"#d97706" }}/>
          </div>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px" }}>Reverse DNS (PTR) Checker</h1>
            <p style={{ fontSize:13, color:"var(--ink-4)", marginTop:2 }}>Check PTR records for any IP — validates forward-confirmed rDNS required by enterprise mail servers</p>
          </div>
        </div>

        <div className="card" style={{ padding:"20px 24px", marginBottom:14 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:7 }}>IP Address</label>
          <div style={{ display:"flex", gap:10 }}>
            <input className="input" type="text" value={ip} onChange={e => setIp(e.target.value)} onKeyDown={e => e.key==="Enter" && lookup()}
              placeholder="1.2.3.4 or 2001:db8::1" style={{ flex:1, fontFamily:"monospace", fontSize:13 }}/>
            <button onClick={lookup} disabled={loading || !ip.trim()} className="btn btn-primary" style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 22px", fontSize:13, flexShrink:0 }}>
              {loading ? <div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/> : <><Zap size={13}/> Look up</>}
            </button>
          </div>
          <p style={{ fontSize:12, color:"var(--ink-4)", marginTop:10 }}>Enter the IP address of your sending server. We check PTR records and validate forward-confirmed rDNS (FCrDNS).</p>
        </div>

        {error && <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px", borderRadius:10, background:"var(--red-dim)", border:"1px solid var(--red-border)", color:"var(--red)", fontSize:13, marginBottom:14 }}><XCircle size={14}/> {error}</div>}

        {result && !loading && (
          <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Summary */}
            <div className="card" style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom: result.found ? 16 : 0 }}>
                <ScoreRing score={result.score}/>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"monospace", fontSize:13, color:"var(--ink-2)", marginBottom:6 }}>{result.ip}</p>
                  {result.found ? (
                    <>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        {result.forwardConfirmed
                          ? <><CheckCircle2 size={14} style={{ color:"var(--green)" }}/><span style={{ fontSize:13, fontWeight:600, color:"var(--green)" }}>Forward-confirmed rDNS (FCrDNS) verified</span></>
                          : result.anyConfirmed
                          ? <><AlertTriangle size={14} style={{ color:"var(--yellow)" }}/><span style={{ fontSize:13, fontWeight:600, color:"var(--yellow)" }}>Partially confirmed</span></>
                          : <><XCircle size={14} style={{ color:"var(--red)" }}/><span style={{ fontSize:13, fontWeight:600, color:"var(--red)" }}>FCrDNS check failed</span></>}
                      </div>
                      <p style={{ fontSize:12, color:"var(--ink-4)" }}>{result.ptrs.length} PTR record{result.ptrs.length !== 1 ? "s" : ""} found</p>
                    </>
                  ) : (
                    <p style={{ fontSize:14, fontWeight:600, color:"var(--red)" }}>No PTR record found</p>
                  )}
                </div>
              </div>

              {!result.found && <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.7 }}>{result.message}</p>}

              {result.found && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {result.verified.map((v, i) => (
                    <div key={i} style={{ padding:"12px 14px", borderRadius:10, border:"1px solid var(--border)", background:"var(--paper-2)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                        {v.confirmed
                          ? <CheckCircle2 size={14} style={{ color:"var(--green)", flexShrink:0 }}/>
                          : <XCircle size={14} style={{ color:"var(--red)", flexShrink:0 }}/>}
                        <code style={{ fontFamily:"monospace", fontSize:13, color:"var(--ink)", fontWeight:600, flex:1 }}>{v.ptr}</code>
                        <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:100, color: v.confirmed ? "var(--green)" : "var(--red)", background: v.confirmed ? "var(--green-dim)" : "var(--red-dim)", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                          {v.confirmed ? "FCrDNS ✓" : "No FCrDNS"}
                        </span>
                      </div>
                      <div style={{ paddingLeft:22 }}>
                        <p style={{ fontSize:11, color:"var(--ink-4)", marginBottom:4 }}>Forward lookup resolves to:</p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {v.forwardIps.length > 0
                            ? v.forwardIps.map(fip => (
                                <code key={fip} style={{ fontFamily:"monospace", fontSize:11, padding:"2px 8px", borderRadius:4, background: fip === result.ip ? "var(--green-dim)" : "var(--paper-3)", color: fip === result.ip ? "var(--green)" : "var(--ink-3)", border: fip === result.ip ? "1px solid rgba(26,122,63,0.2)" : "1px solid var(--border)" }}>{fip}</code>
                              ))
                            : <span style={{ fontSize:11, color:"var(--red)" }}>No forward resolution</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

            {result.found && result.forwardConfirmed && result.issues.length === 0 && (
              <div className="card" style={{ padding:"16px 20px", borderLeft:"3px solid var(--green)", display:"flex", gap:10, alignItems:"flex-start" }}>
                <CheckCircle2 size={15} style={{ color:"var(--green)", flexShrink:0, marginTop:2 }}/>
                <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.65 }}>PTR record exists and forward-confirms correctly. This IP will pass rDNS checks on enterprise mail servers including Proofpoint, Mimecast, and Barracuda.</p>
              </div>
            )}

            <button onClick={() => { setResult(null); setIp(""); }} className="btn btn-ghost" style={{ fontSize:13, display:"flex", alignItems:"center", gap:6, alignSelf:"flex-start" }}>
              <RefreshCw size={13}/> Check another IP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

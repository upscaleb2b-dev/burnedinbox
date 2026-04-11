"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Globe, RefreshCw, Shield } from "lucide-react";

interface HopResult { url: string; status: number | null; location: string | null; ssl: boolean; error?: string; }
interface VariantResult { hops: HopResult[]; issues: string[]; tips: string[]; finalUrl: string; finalStatus: number | null; ssl: boolean; }
interface RedirectResult {
  domain: string;
  results: { root: { http: VariantResult; https: VariantResult }; www: { http: VariantResult; https: VariantResult } };
  issues: string[]; tips: string[]; score: number;
}

function StatusBadge({ status }: { status: number | null }) {
  if (!status) return <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--ink-4)" }}>—</span>;
  const col = status < 300 ? "var(--green)" : status < 400 ? "#2563eb" : "var(--red)";
  const bg  = status < 300 ? "var(--green-dim)" : status < 400 ? "rgba(37,99,235,0.1)" : "var(--red-dim)";
  return <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4, color: col, background: bg, fontFamily: "monospace" }}>{status}</span>;
}

function HopChain({ hops }: { hops: HopResult[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {hops.map((h, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0 && <ArrowRight size={10} style={{ color: "var(--ink-4)", flexShrink: 0, marginLeft: 4 }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, padding: i > 0 ? "0" : "0" }}>
            {h.ssl ? <Shield size={11} style={{ color: "var(--green)", flexShrink: 0 }} /> : <Globe size={11} style={{ color: "var(--yellow)", flexShrink: 0 }} />}
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{h.url}</span>
            <StatusBadge status={h.status} />
            {h.error && <span style={{ fontSize: 10, color: "var(--red)" }}>error</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function VariantCard({ label, v }: { label: string; v: VariantResult }) {
  const ok = v.issues.length === 0 && !v.hops.some(h => h.error);
  const Icon = ok ? CheckCircle2 : v.issues.length > 0 ? XCircle : AlertTriangle;
  const col = ok ? "var(--green)" : v.issues.length > 0 ? "var(--red)" : "var(--yellow)";
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", background: "var(--paper)", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border)" }}>
        <Icon size={14} style={{ color: col, flexShrink: 0 }} />
        <code style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", flex: 1 }}>{label}</code>
        <span style={{ fontSize: 11, color: "var(--ink-4)" }}>{v.hops.length} hop{v.hops.length !== 1 ? "s" : ""}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: col, background: ok ? "var(--green-dim)" : v.issues.length ? "var(--red-dim)" : "var(--yellow-dim)", padding: "2px 8px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {ok ? "Clean" : v.issues.length ? "Issues" : "Warning"}
        </span>
      </div>
      <div style={{ padding: "12px 14px", background: "var(--paper-2)" }}>
        <HopChain hops={v.hops} />
        {v.issues.map((i, idx) => (
          <div key={idx} style={{ display: "flex", gap: 6, marginTop: 8, padding: "7px 10px", borderRadius: 7, background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
            <XCircle size={12} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "var(--red)" }}>{i}</span>
          </div>
        ))}
        {v.tips.map((t, idx) => (
          <div key={idx} style={{ display: "flex", gap: 6, marginTop: 6, padding: "7px 10px", borderRadius: 7, background: "var(--yellow-dim)", border: "1px solid rgba(146,96,10,0.2)" }}>
            <AlertTriangle size={12} style={{ color: "var(--yellow)", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "var(--yellow)" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RedirectPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RedirectResult | null>(null);
  const [error, setError] = useState("");

  const check = async () => {
    if (!domain.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/redirect-check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed");
      setResult(data);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const score = result?.score ?? 0;
  const scoreColor = score >= 80 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fade-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} .fade-up{animation:fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both} input:focus{outline:none;border-color:var(--ink)!important;box-shadow:0 0 0 3px rgba(12,12,12,0.07)} *{box-sizing:border-box;margin:0;padding:0} input::placeholder{color:var(--ink-5)}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff" /></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13} /> Back</Link>
      </nav>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ArrowRight size={18} style={{ color:"#059669" }} />
          </div>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px" }}>Redirect Checker</h1>
            <p style={{ fontSize:13, color:"var(--ink-4)", marginTop:2 }}>Check all four redirect variants — HTTP/HTTPS × root/www — for chains, SSL issues, and broken destinations</p>
          </div>
        </div>

        <div className="card" style={{ padding:"20px 24px", marginBottom:14 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:7 }}>Domain</label>
          <div style={{ display:"flex", gap:10 }}>
            <input className="input" type="text" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key==="Enter" && check()}
              placeholder="yourdomain.com" style={{ flex:1, fontFamily:"monospace", fontSize:13 }} />
            <button onClick={check} disabled={loading || !domain.trim()} className="btn btn-primary" style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 22px", fontSize:13, flexShrink:0 }}>
              {loading ? <div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> : <><Globe size={13}/> Check</>}
            </button>
          </div>
          <p style={{ fontSize:12, color:"var(--ink-4)", marginTop:10 }}>Checks http://, https://, http://www., and https://www. — follows the full redirect chain for each.</p>
        </div>

        {error && <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px", borderRadius:10, background:"var(--red-dim)", border:"1px solid var(--red-border)", color:"var(--red)", fontSize:13, marginBottom:14 }}><XCircle size={14}/> {error}</div>}

        {result && !loading && (
          <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Score summary */}
            <div className="card" style={{ padding:"16px 22px", display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:14, border:`3px solid ${scoreColor}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"monospace", fontSize:18, fontWeight:700, color:scoreColor, lineHeight:1 }}>{score}</span>
                <span style={{ fontSize:9, color:"var(--ink-4)" }}>/100</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"monospace", fontSize:13, color:"var(--ink-2)", marginBottom:6 }}>{result.domain}</p>
                {result.issues.length === 0 && result.tips.length === 0
                  ? <p style={{ fontSize:13, color:"var(--green)", fontWeight:600 }}>All redirect variants look healthy</p>
                  : <p style={{ fontSize:13, color:"var(--ink-3)" }}>{result.issues.length} issue{result.issues.length !== 1 ? "s" : ""}, {result.tips.length} tip{result.tips.length !== 1 ? "s" : ""} across all variants</p>}
              </div>
            </div>

            {/* Global issues */}
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

            {/* Variants */}
            <div>
              <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:10 }}>Root domain</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <VariantCard label={`http://${result.domain}`}     v={result.results.root.http} />
                <VariantCard label={`https://${result.domain}`}    v={result.results.root.https} />
              </div>
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:10 }}>www variant</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <VariantCard label={`http://www.${result.domain}`}  v={result.results.www.http} />
                <VariantCard label={`https://www.${result.domain}`} v={result.results.www.https} />
              </div>
            </div>

            <button onClick={() => { setResult(null); setDomain(""); }} className="btn btn-ghost" style={{ fontSize:13, display:"flex", alignItems:"center", gap:6, alignSelf:"flex-start" }}>
              <RefreshCw size={13}/> Check another domain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

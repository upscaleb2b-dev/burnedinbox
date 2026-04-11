"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Copy, Check } from "lucide-react";

interface ParsedHeader { key: string; value: string; }
interface HeaderResult { hops: {from:string;by:string;delay?:string}[]; auth: {spf?:string;dkim?:string;dmarc?:string;verdict?:string}; spam: {score?:string;flag?:string;tests?:string}; returnPath?:string; messageId?:string; date?:string; subject?:string; issues: string[]; tips: string[]; raw: ParsedHeader[]; }

function parseHeaders(raw: string): HeaderResult {
  const lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const headers: ParsedHeader[] = [];
  let current: ParsedHeader | null = null;
  for (const line of lines) {
    if (line.match(/^\S.*:/)) {
      if (current) headers.push(current);
      const colon = line.indexOf(":");
      current = { key: line.slice(0, colon).trim().toLowerCase(), value: line.slice(colon + 1).trim() };
    } else if (current && line.match(/^\s/)) {
      current.value += " " + line.trim();
    }
  }
  if (current) headers.push(current);

  const get = (k: string) => headers.find(h => h.key === k)?.value || "";
  const getAll = (k: string) => headers.filter(h => h.key === k).map(h => h.value);

  // Received hops
  const receivedHdrs = getAll("received");
  const hops = receivedHdrs.map(r => {
    const fromMatch = r.match(/from\s+([\w\d.\-[\]:]+)/i);
    const byMatch   = r.match(/by\s+([\w\d.\-[\]:]+)/i);
    const delayMatch = r.match(/;\s*(.+)$/);
    return { from: fromMatch?.[1] || "", by: byMatch?.[1] || "", delay: delayMatch?.[1]?.trim() };
  }).filter(h => h.from || h.by);

  // Auth results
  const authResults = get("authentication-results") || get("arc-authentication-results");
  const auth: HeaderResult["auth"] = {};
  if (authResults) {
    const spfM  = authResults.match(/spf=(\w+)/i);
    const dkimM = authResults.match(/dkim=(\w+)/i);
    const dmarcM= authResults.match(/dmarc=(\w+)/i);
    if (spfM)   auth.spf   = spfM[1];
    if (dkimM)  auth.dkim  = dkimM[1];
    if (dmarcM) auth.dmarc = dmarcM[1];
  }
  const xSpamVerdict = get("x-ses-spam-verdict") || get("x-forefront-antispam-report");
  if (xSpamVerdict) auth.verdict = xSpamVerdict.slice(0, 60);

  // Spam score
  const spamStatus = get("x-spam-status");
  const spamScore  = get("x-spam-score");
  const spam: HeaderResult["spam"] = {};
  if (spamStatus) { spam.flag = spamStatus.split(",")[0]; spam.tests = spamStatus.includes("tests=") ? spamStatus.split("tests=")[1]?.split(" ")[0] : undefined; }
  if (spamScore)  spam.score = spamScore.split(" ")[0];

  const issues: string[] = [];
  const tips: string[] = [];

  if (auth.spf  && auth.spf  !== "pass") issues.push(`SPF ${auth.spf} — sending server is not authorized`);
  if (auth.dkim && auth.dkim !== "pass") issues.push(`DKIM ${auth.dkim} — signature verification failed`);
  if (auth.dmarc&& auth.dmarc!== "pass") issues.push(`DMARC ${auth.dmarc} — domain authentication failed`);
  if (spam.flag && spam.flag.toLowerCase().includes("yes")) issues.push("Email was flagged as spam by the receiving server");
  if (hops.length > 5) tips.push(`${hops.length} routing hops — unusually long path, may indicate misconfigured routing`);
  if (!get("message-id")) tips.push("No Message-ID header — some servers require this; add it to your sending setup");
  if (!get("list-unsubscribe") && !get("list-unsubscribe-post")) tips.push("No List-Unsubscribe header — consider adding for compliance");

  return {
    hops,
    auth,
    spam,
    returnPath: get("return-path") || get("x-original-return-path"),
    messageId: get("message-id"),
    date: get("date"),
    subject: get("subject"),
    issues, tips, raw: headers,
  };
}

export default function HeaderParserPage() {
  const [raw, setRaw]     = useState("");
  const [result, setResult] = useState<HeaderResult | null>(null);
  const [copied, setCopied] = useState(false);

  const parse = () => { if (raw.trim()) setResult(parseHeaders(raw)); };

  const StatusPill = ({ val }: { val?: string }) => {
    if (!val) return <span style={{ fontSize:11, color:"var(--ink-4)" }}>—</span>;
    const pass = val === "pass";
    return <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:100, color:pass?"var(--green)":"var(--red)", background:pass?"var(--green-dim)":"var(--red-dim)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{val}</span>;
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} textarea:focus{outline:none;border-color:var(--ink)!important;box-shadow:0 0 0 3px rgba(12,12,12,0.07)}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Email Header Parser</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Paste raw email headers — see routing path, auth results, spam scores, and delivery issues</p>
        </div>

        <div className="card" style={{ padding:"20px 24px", marginBottom:14 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:8 }}>Raw email headers</label>
          <textarea value={raw} onChange={e => setRaw(e.target.value)}
            placeholder={"Received: from mail.example.com...\nAuthentication-Results: mx.google.com;\n  spf=pass...\n  dkim=pass..."}
            style={{ width:"100%", height:180, padding:"12px 14px", border:"1px solid var(--border)", borderRadius:8, background:"var(--paper)", fontFamily:"monospace", fontSize:11, color:"var(--ink)", resize:"vertical", lineHeight:1.7 }}/>
          <p style={{ fontSize:12, color:"var(--ink-4)", marginTop:8 }}>In Gmail: open email → three dots → Show original. In Outlook: File → Properties → Internet headers.</p>
          <button onClick={parse} disabled={!raw.trim()} className="btn btn-primary" style={{ marginTop:12, padding:"10px 22px", fontSize:13, display:"flex", alignItems:"center", gap:7 }}>
            Parse headers
          </button>
        </div>

        {result && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Auth */}
            <div className="card" style={{ padding:"18px 22px" }}>
              <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:14 }}>Authentication results</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom: result.spam.score ? 14 : 0 }}>
                {[{l:"SPF",v:result.auth.spf},{l:"DKIM",v:result.auth.dkim},{l:"DMARC",v:result.auth.dmarc}].map(({l,v}) => (
                  <div key={l} style={{ textAlign:"center", padding:"14px", borderRadius:8, background:"var(--paper-2)", border:"1px solid var(--border)" }}>
                    <p style={{ fontSize:11, fontWeight:600, color:"var(--ink-4)", marginBottom:6 }}>{l}</p>
                    <StatusPill val={v}/>
                  </div>
                ))}
              </div>
              {result.spam.score && (
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:8, background:"var(--paper-2)", border:"1px solid var(--border)" }}>
                  <span style={{ fontSize:12, color:"var(--ink-4)" }}>Spam score:</span>
                  <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color: parseFloat(result.spam.score) > 5 ? "var(--red)" : "var(--green)" }}>{result.spam.score}</span>
                  {result.spam.flag && <><span style={{ fontSize:12, color:"var(--ink-4)", marginLeft:8 }}>Flag:</span><span style={{ fontFamily:"monospace", fontSize:12, color:"var(--ink-2)" }}>{result.spam.flag}</span></>}
                </div>
              )}
            </div>

            {/* Issues */}
            {(result.issues.length > 0 || result.tips.length > 0) && (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.issues.map((i,idx) => <div key={idx} style={{ display:"flex", gap:8, padding:"10px 14px", borderRadius:10, background:"var(--red-dim)", border:"1px solid var(--red-border)" }}><XCircle size={14} style={{ color:"var(--red)", flexShrink:0, marginTop:1 }}/><span style={{ fontSize:13, color:"var(--red)" }}>{i}</span></div>)}
                {result.tips.map((t,idx) => <div key={idx} style={{ display:"flex", gap:8, padding:"10px 14px", borderRadius:10, background:"var(--yellow-dim)", border:"1px solid rgba(146,96,10,0.2)" }}><AlertTriangle size={14} style={{ color:"var(--yellow)", flexShrink:0, marginTop:1 }}/><span style={{ fontSize:13, color:"var(--yellow)" }}>{t}</span></div>)}
              </div>
            )}

            {/* Routing hops */}
            {result.hops.length > 0 && (
              <div className="card" style={{ padding:"18px 22px" }}>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:12 }}>Routing path ({result.hops.length} hops)</p>
                {result.hops.map((h, i) => (
                  <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, color:"var(--ink-4)", flexShrink:0, width:20, textAlign:"right" }}>{i+1}</span>
                    <div style={{ flex:1 }}>
                      {h.from && <div style={{ fontSize:12, color:"var(--ink-3)" }}>from <code style={{ fontFamily:"monospace", fontSize:11, color:"var(--ink)" }}>{h.from}</code></div>}
                      {h.by   && <div style={{ fontSize:12, color:"var(--ink-3)" }}>by <code style={{ fontFamily:"monospace", fontSize:11, color:"var(--ink)" }}>{h.by}</code></div>}
                    </div>
                    {h.delay && <span style={{ fontSize:10, color:"var(--ink-4)", fontFamily:"monospace", flexShrink:0, alignSelf:"center" }}>{h.delay.slice(0,30)}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Key headers */}
            {(result.returnPath || result.messageId || result.date) && (
              <div className="card" style={{ padding:"18px 22px" }}>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:12 }}>Key headers</p>
                {[{l:"Return-Path",v:result.returnPath},{l:"Message-ID",v:result.messageId},{l:"Date",v:result.date},{l:"Subject",v:result.subject}].filter(x=>x.v).map(({l,v}) => (
                  <div key={l} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                    <span style={{ fontSize:12, color:"var(--ink-4)", flexShrink:0, minWidth:90 }}>{l}</span>
                    <span style={{ fontFamily:"monospace", fontSize:11, color:"var(--ink-2)", wordBreak:"break-all" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Auth = all pass banner */}
            {result.auth.spf === "pass" && result.auth.dkim === "pass" && result.auth.dmarc === "pass" && result.issues.length === 0 && (
              <div className="card" style={{ padding:"16px 20px", borderLeft:"3px solid var(--green)", display:"flex", gap:10 }}>
                <CheckCircle2 size={15} style={{ color:"var(--green)", flexShrink:0, marginTop:2 }}/>
                <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.65 }}>All authentication checks pass. Email routing looks clean with no obvious delivery issues.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

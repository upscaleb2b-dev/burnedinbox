"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const SPAM_WORDS = ["free","winner","won","prize","guarantee","guaranteed","risk-free","no risk","make money","earn money","double your","100%","act now","limited time","urgent","final notice","last chance","don't miss","click here","click below","buy now","order now","special offer","exclusive deal","once in a lifetime","no cost","no obligation","no fees","no hidden","as seen on","billion","million dollars","$$","cash","bonus","income","profit","revenue","roi","investment","debt","credit","loan","mortgage","refinance","insurance","claim","refund","congratulations","you've been selected","pre-approved","pre approved","dear friend","this is not spam","remove yourself","opt out","unsubscribe","email marketing","mass email","bulk email","open rates","click rates","spam","junk","filter","blacklist","whitelist","pharmacy","pills","diet","weight loss","lose weight","fat","casino","poker","gambling","xxx","adult","sex","viagra","cialis","penis","enlargement","bitcoin","crypto","nft","get rich","overnight","work from home","be your own boss","fire your boss"];

const SUSPICIOUS_PATTERNS = [
  { pattern: /[A-Z]{4,}/, label:"Excessive caps (4+ consecutive)", severity:"warn" as const },
  { pattern: /\!\!\!+/, label:"Multiple consecutive exclamation marks", severity:"warn" as const },
  { pattern: /\$\$+/, label:"Multiple dollar signs", severity:"fail" as const },
  { pattern: /\d{2,}%/, label:"Percentage claim (15%+)", severity:"info" as const },
  { pattern: /re:\s*$/i, label:"Fake reply prefix with nothing after", severity:"warn" as const },
  { pattern: /^fw:/i,    label:"Fake forward prefix", severity:"warn" as const },
  { pattern: /[\u{1F300}-\u{1F9FF}]/u, label:"Emoji in subject line", severity:"info" as const },
  { pattern: /[<>{}|\\^~\[\]`]/, label:"Unusual characters", severity:"warn" as const },
];

function analyze(subject: string) {
  const lower = subject.toLowerCase();
  const words = lower.split(/\W+/).filter(Boolean);
  const spamHits = SPAM_WORDS.filter(w => lower.includes(w));
  const patternHits = SUSPICIOUS_PATTERNS.filter(p => p.pattern.test(subject));
  const charCount = subject.length;
  const wordCount = words.length;

  const issues: { text:string; severity:"fail"|"warn"|"info" }[] = [];
  if (charCount > 70) issues.push({ text:`Subject is ${charCount} chars — over 70 chars may be truncated on mobile`, severity:"warn" });
  if (charCount < 10) issues.push({ text:"Very short subject — may look suspicious or unintentional", severity:"info" });
  if (wordCount > 15) issues.push({ text:`${wordCount} words is quite long for a subject line`, severity:"warn" });
  spamHits.forEach(w => issues.push({ text:`Spam trigger word: "${w}"`, severity:"fail" }));
  patternHits.forEach(p => issues.push({ text: p.label, severity: p.severity }));
  if (/^re:/i.test(subject) || /^fw:/i.test(subject)) issues.push({ text:"Fake reply/forward prefix — often flagged by spam filters", severity:"fail" });

  const failCount = issues.filter(i => i.severity === "fail").length;
  const warnCount = issues.filter(i => i.severity === "warn").length;
  let score = 100;
  score -= failCount * 25;
  score -= warnCount * 10;
  score -= issues.filter(i => i.severity === "info").length * 3;
  score = Math.max(0, Math.min(100, score));

  return { issues, score, charCount, wordCount, spamHits };
}

export default function SubjectCheckPage() {
  const [subject, setSubject] = useState("");
  const [result, setResult]   = useState<ReturnType<typeof analyze> | null>(null);

  const check = () => { if (subject.trim()) setResult(analyze(subject.trim())); };

  return (
    <div style={{ minHeight:"100vh", background:"var(--paper-2)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input:focus,textarea:focus{outline:none;border-color:var(--ink)!important;box-shadow:0 0 0 3px rgba(12,12,12,0.07)}`}</style>
      <nav style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:"var(--red)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}><Flame size={13} color="#fff"/></div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px", color:"var(--ink)" }}>burned<span style={{ color:"var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"var(--ink-3)", textDecoration:"none" }}><ArrowLeft size={13}/> Back</Link>
      </nav>

      <div style={{ maxWidth:660, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.3px", marginBottom:4 }}>Subject Line Spam Risk Tester</h1>
          <p style={{ fontSize:13, color:"var(--ink-4)" }}>Technical spam-risk check — trigger words, patterns, length, character issues</p>
        </div>

        <div className="card" style={{ padding:"20px 24px", marginBottom:14 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--ink-4)", marginBottom:8 }}>Subject line</label>
          <div style={{ display:"flex", gap:10 }}>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} onKeyDown={e => e.key==="Enter" && check()}
              placeholder="Your cold email subject line here…"
              style={{ flex:1, padding:"11px 14px", border:"1px solid var(--border)", borderRadius:8, background:"var(--paper)", fontFamily:"inherit", fontSize:14, color:"var(--ink)" }}/>
            <button onClick={check} disabled={!subject.trim()} className="btn btn-primary" style={{ padding:"10px 20px", fontSize:13, flexShrink:0 }}>Analyze</button>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:10 }}>
            <span style={{ fontSize:12, color: subject.length > 70 ? "var(--red)" : subject.length > 50 ? "var(--yellow)" : "var(--ink-4)" }}>{subject.length} chars</span>
            <span style={{ fontSize:12, color:"var(--ink-4)" }}>{subject.split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        {result && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Score */}
            <div className="card" style={{ padding:"18px 22px", display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:64, height:64, borderRadius:14, border:`3px solid ${result.score>=75?"var(--green)":result.score>=50?"var(--yellow)":"var(--red)"}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"monospace", fontSize:22, fontWeight:700, color:result.score>=75?"var(--green)":result.score>=50?"var(--yellow)":"var(--red)", lineHeight:1 }}>{result.score}</span>
                <span style={{ fontSize:9, color:"var(--ink-4)" }}>/100</span>
              </div>
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:result.score>=75?"var(--green)":result.score>=50?"var(--yellow)":"var(--red)", marginBottom:4 }}>
                  {result.score>=80 ? "Low spam risk" : result.score>=60 ? "Some risk signals" : result.score>=40 ? "High spam risk" : "Very high spam risk"}
                </p>
                <p style={{ fontSize:13, color:"var(--ink-4)" }}>
                  {result.issues.length === 0 ? "No issues detected" : `${result.issues.filter(i=>i.severity==="fail").length} failures, ${result.issues.filter(i=>i.severity==="warn").length} warnings`}
                </p>
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 ? (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.issues.map((i,idx) => {
                  const col = i.severity==="fail" ? "var(--red)" : i.severity==="warn" ? "var(--yellow)" : "var(--ink-4)";
                  const bg  = i.severity==="fail" ? "var(--red-dim)" : i.severity==="warn" ? "var(--yellow-dim)" : "var(--paper-3)";
                  const border = i.severity==="fail" ? "var(--red-border)" : i.severity==="warn" ? "rgba(146,96,10,0.2)" : "var(--border)";
                  const Ic  = i.severity==="fail" ? XCircle : i.severity==="warn" ? AlertTriangle : AlertTriangle;
                  return (
                    <div key={idx} style={{ display:"flex", gap:8, padding:"10px 14px", borderRadius:10, background:bg, border:`1px solid ${border}` }}>
                      <Ic size={14} style={{ color:col, flexShrink:0, marginTop:1 }}/><span style={{ fontSize:13, color:col }}>{i.text}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card" style={{ padding:"16px 20px", borderLeft:"3px solid var(--green)", display:"flex", gap:10 }}>
                <CheckCircle2 size={15} style={{ color:"var(--green)", flexShrink:0, marginTop:2 }}/>
                <p style={{ fontSize:13, color:"var(--ink-3)", lineHeight:1.65 }}>No spam trigger words, suspicious patterns, or length issues detected. Subject looks clean.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

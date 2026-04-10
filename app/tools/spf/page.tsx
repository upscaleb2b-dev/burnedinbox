"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Copy, Check, CheckCircle2, XCircle, AlertTriangle, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type Qualifier = "+" | "-" | "~" | "?";
type MechType = "include" | "a" | "mx" | "ip4" | "ip6" | "exists" | "redirect" | "ptr";
type AllPolicy = "-all" | "~all" | "?all" | "+all";

interface Mechanism {
  id: string;
  qualifier: Qualifier;
  type: MechType;
  value: string;
}

interface LookupResult {
  domain: string;
  found: boolean;
  record?: string;
  parsed?: {
    mechanisms: { type: string; value: string; qualifier: string }[];
    all: string;
  };
  grade?: { score: number; issues: string[]; tips: string[] };
  message?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

const QUALIFIER_LABELS: Record<Qualifier, { label: string; desc: string; color: string }> = {
  "+": { label: "Pass (+)", desc: "Authorized sender", color: "var(--green)" },
  "-": { label: "Fail (−)", desc: "Hard fail — reject", color: "var(--red)" },
  "~": { label: "Softfail (~)", desc: "Mark suspicious", color: "var(--yellow)" },
  "?": { label: "Neutral (?)", desc: "No assertion", color: "var(--ink-4)" },
};

const MECH_DESCRIPTIONS: Record<MechType, string> = {
  include: "Include another domain's SPF record (e.g. your ESP)",
  a: "Authorize the A record of this domain",
  mx: "Authorize the MX servers of this domain",
  ip4: "Authorize a specific IPv4 address or range (e.g. 1.2.3.4 or 1.2.3.0/24)",
  ip6: "Authorize a specific IPv6 address or range",
  exists: "Authorize if this domain exists in DNS",
  redirect: "Use another domain's SPF record entirely",
  ptr: "Authorize by reverse DNS lookup (not recommended)",
};

const ALL_POLICIES: { value: AllPolicy; label: string; desc: string; rec: boolean }[] = [
  { value: "-all", label: "Hardfail (−all)", desc: "Reject all mail not matching — recommended", rec: true },
  { value: "~all", label: "Softfail (~all)", desc: "Mark as suspicious but deliver — safer for migration", rec: false },
  { value: "?all", label: "Neutral (?all)", desc: "No policy — not recommended", rec: false },
  { value: "+all", label: "Allow all (+all)", desc: "Allow any server — never use this", rec: false },
];

function buildRecord(mechs: Mechanism[], allPolicy: AllPolicy, domain: string) {
  const parts = ["v=spf1"];
  for (const m of mechs) {
    const q = m.qualifier === "+" ? "" : m.qualifier;
    if (m.type === "mx" || m.type === "a") {
      parts.push(`${q}${m.type}${m.value ? `:${m.value}` : ""}`);
    } else if (m.type === "ip4" || m.type === "ip6") {
      if (m.value) parts.push(`${q}${m.type}:${m.value}`);
    } else if (m.type === "redirect") {
      if (m.value) parts.push(`redirect=${m.value}`);
    } else {
      if (m.value) parts.push(`${q}${m.type}:${m.value}`);
    }
  }
  parts.push(allPolicy);
  return parts.join(" ");
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${done ? "var(--green)" : "var(--border-2)"}`, background: done ? "var(--green-dim)" : "var(--paper-2)", color: done ? "var(--green)" : "var(--ink-3)", transition: "all 0.15s" }}
    >
      {done ? <Check size={11} /> : <Copy size={11} />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";
  const bg = score >= 80 ? "var(--green-dim)" : score >= 50 ? "var(--yellow-dim)" : "var(--red-dim)";
  const label = score >= 80 ? "Healthy" : score >= 50 ? "Needs work" : "Critical";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-mono, 'Geist Mono', monospace)", fontSize: 16, fontWeight: 700, color }}>{score}</span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--ink-4)" }}>SPF health score</div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function SPFPage() {
  // Generator state
  const [domain, setDomain] = useState("");
  const [mechs, setMechs] = useState<Mechanism[]>([
    { id: uid(), qualifier: "+", type: "mx", value: "" },
  ]);
  const [allPolicy, setAllPolicy] = useState<AllPolicy>("-all");
  const [showRecord, setShowRecord] = useState(false);

  // Lookup state
  const [lookupDomain, setLookupDomain] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [lookupErr, setLookupErr] = useState("");
  const [activeTab, setActiveTab] = useState<"generate" | "lookup">("generate");

  const generated = domain.trim() ? buildRecord(mechs, allPolicy, domain) : buildRecord(mechs, allPolicy, "yourdomain.com");

  const addMech = () => setMechs(prev => [...prev, { id: uid(), qualifier: "+", type: "include", value: "" }]);
  const removeMech = (id: string) => setMechs(prev => prev.filter(m => m.id !== id));
  const updateMech = (id: string, key: keyof Mechanism, val: string) =>
    setMechs(prev => prev.map(m => m.id === id ? { ...m, [key]: val } : m));

  const handleLookup = async () => {
    if (!lookupDomain.trim()) return;
    setLookupLoading(true); setLookupResult(null); setLookupErr("");
    try {
      const res = await fetch("/api/spf-lookup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: lookupDomain.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setLookupResult(data);
    } catch (e: unknown) {
      setLookupErr(e instanceof Error ? e.message : "Lookup failed");
    } finally { setLookupLoading(false); }
  };

  const dnsTip = `Name: ${domain || "yourdomain.com"}\nType: TXT\nValue: ${generated}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)", fontFamily: "var(--font-sans, 'Geist', sans-serif)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        select { appearance: none; -webkit-appearance: none; }
        input::placeholder { color: var(--ink-5, #bbb); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tab-btn { padding: 8px 18px; border-radius: 8px; border: 1px solid transparent; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; background: transparent; color: var(--ink-3, #555); }
        .tab-btn.active { background: var(--paper, #fff); border-color: var(--border, #e5e2dc); color: var(--ink, #0c0c0c); box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .mech-row { display: grid; grid-template-columns: 110px 120px 1fr 32px; gap: 8px; align-items: center; }
        @media (max-width: 580px) { .mech-row { grid-template-columns: 1fr 1fr; } }
        select, .sel { background: var(--paper, #fff); border: 1px solid var(--border, #e5e2dc); border-radius: 8px; padding: 9px 12px; font-size: 13px; color: var(--ink, #0c0c0c); cursor: pointer; width: 100%; }
        .sel:focus, input:focus { outline: none; border-color: var(--ink, #0c0c0c); box-shadow: 0 0 0 3px rgba(12,12,12,0.07); }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red, #c8102e)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={13} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>
            burned<span style={{ color: "var(--red, #c8102e)" }}>inbox</span>
          </span>
        </Link>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
          <ArrowLeft size={13} /> Back
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--red-dim, rgba(200,16,46,0.08))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red, #c8102e)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>SPF Record Tool</h1>
              <p style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 2 }}>Generate or look up SPF records for any domain</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "inline-flex", gap: 4, padding: 4, background: "var(--paper-3, #f0ede8)", borderRadius: 10 }}>
            {(["generate", "lookup"] as const).map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                {t === "generate" ? "Generate SPF" : "Lookup SPF"}
              </button>
            ))}
          </div>
        </div>

        {/* ── GENERATOR ── */}
        {activeTab === "generate" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Domain */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>Your domain</label>
              <input
                className="input"
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="yourdomain.com"
                style={{ fontFamily: "var(--font-mono, 'Geist Mono', monospace)", fontSize: 13 }}
              />
              <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 8 }}>The domain you send email from. Used for the DNS record label below.</p>
            </div>

            {/* Mechanisms */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Sending sources</p>
                  <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>Add every server or service authorized to send email from your domain</p>
                </div>
                <button onClick={addMech} className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                  <Plus size={12} /> Add
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mechs.map((m) => (
                  <div key={m.id} style={{ display: "grid", gridTemplateColumns: "110px 120px 1fr 32px", gap: 8, alignItems: "start" }}>
                    {/* Qualifier */}
                    <div style={{ position: "relative" }}>
                      <select className="sel" value={m.qualifier} onChange={e => updateMech(m.id, "qualifier", e.target.value)}>
                        {Object.entries(QUALIFIER_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* Type */}
                    <div style={{ position: "relative" }}>
                      <select className="sel" value={m.type} onChange={e => updateMech(m.id, "type", e.target.value)}>
                        {(["include", "a", "mx", "ip4", "ip6", "exists", "redirect", "ptr"] as MechType[]).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    {/* Value */}
                    <div>
                      <input
                        className="input"
                        type="text"
                        value={m.value}
                        onChange={e => updateMech(m.id, "value", e.target.value)}
                        placeholder={
                          m.type === "include" ? "_spf.google.com" :
                          m.type === "ip4" ? "1.2.3.4 or 1.2.3.0/24" :
                          m.type === "ip6" ? "2001:db8::/32" :
                          m.type === "a" || m.type === "mx" ? "leave blank for this domain" :
                          m.type === "redirect" ? "otherdomain.com" :
                          "value"
                        }
                        style={{ fontFamily: "var(--font-mono, 'Geist Mono', monospace)", fontSize: 12 }}
                      />
                      <p style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 4, lineHeight: 1.4 }}>{MECH_DESCRIPTIONS[m.type]}</p>
                    </div>
                    {/* Remove */}
                    <button onClick={() => removeMech(m.id)} disabled={mechs.length === 1}
                      style={{ width: 32, height: 36, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--ink-4)", cursor: mechs.length === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: mechs.length === 1 ? 0.3 : 1, flexShrink: 0 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Common presets */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Quick add</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    { label: "Google Workspace", value: "_spf.google.com" },
                    { label: "Microsoft 365", value: "spf.protection.outlook.com" },
                    { label: "Mailchimp", value: "servers.mcsv.net" },
                    { label: "SendGrid", value: "sendgrid.net" },
                    { label: "Mailgun", value: "mailgun.org" },
                    { label: "Postmark", value: "spf.mtasv.net" },
                    { label: "Instantly", value: "spf.instantly.ai" },
                    { label: "Smartlead", value: "spf.smartlead.ai" },
                  ].map(({ label, value }) => (
                    <button key={label}
                      onClick={() => setMechs(prev => [...prev, { id: uid(), qualifier: "+", type: "include", value }])}
                      style={{ fontSize: 12, padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-3)", cursor: "pointer", transition: "all 0.1s" }}>
                      + {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* All policy */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>Default policy</p>
              <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 14 }}>What happens to mail from servers not listed above</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ALL_POLICIES.map(({ value, label, desc, rec }) => (
                  <label key={value} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, border: `1px solid ${allPolicy === value ? "var(--ink-3)" : "var(--border)"}`, background: allPolicy === value ? "var(--paper-3)" : "var(--paper)", cursor: "pointer", transition: "all 0.15s" }}>
                    <input type="radio" name="all" value={value} checked={allPolicy === value} onChange={() => setAllPolicy(value as AllPolicy)} style={{ accentColor: "var(--ink)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-mono, 'Geist Mono', monospace)" }}>{label}</span>
                        {rec && <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 100, background: "var(--green-dim)", color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recommended</span>}
                        {value === "+all" && <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 100, background: "var(--red-dim)", color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Dangerous</span>}
                      </div>
                      <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Output */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Generated SPF record</p>
                <CopyButton text={generated} />
              </div>
              <code style={{ display: "block", fontFamily: "var(--font-mono, 'Geist Mono', monospace)", fontSize: 13, padding: "14px 16px", borderRadius: 8, background: "var(--paper-2)", border: "1px solid var(--border)", wordBreak: "break-all", lineHeight: 1.7, color: "var(--ink)" }}>
                {generated}
              </code>

              {/* DNS record block */}
              <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 8, background: "var(--paper-3)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)" }}>Add this DNS TXT record</p>
                  <CopyButton text={dnsTip} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "60px 60px 1fr", gap: 12 }}>
                  {[
                    { label: "Name", val: domain || "yourdomain.com" },
                    { label: "Type", val: "TXT" },
                    { label: "Value", val: generated },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</p>
                      <code style={{ fontSize: 12, fontFamily: "var(--font-mono, 'Geist Mono', monospace)", color: "var(--ink-2)", wordBreak: "break-all" }}>{val}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LOOKUP ── */}
        {activeTab === "lookup" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card" style={{ padding: "20px 24px" }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 8 }}>Domain to check</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="input"
                  type="text"
                  value={lookupDomain}
                  onChange={e => setLookupDomain(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLookup()}
                  placeholder="yourdomain.com"
                  style={{ fontFamily: "var(--font-mono, 'Geist Mono', monospace)", fontSize: 13, flex: 1 }}
                />
                <button onClick={handleLookup} disabled={lookupLoading || !lookupDomain.trim()} className="btn btn-primary" style={{ padding: "10px 20px", fontSize: 13, flexShrink: 0 }}>
                  {lookupLoading
                    ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    : "Look up"}
                </button>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>

            {lookupErr && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--red-dim)", color: "var(--red)", fontSize: 13, border: "1px solid var(--red-border)" }}>
                <XCircle size={14} /> {lookupErr}
              </div>
            )}

            {lookupResult && (
              <>
                {!lookupResult.found ? (
                  <div className="card" style={{ padding: "28px 24px", textAlign: "center" }}>
                    <XCircle size={28} style={{ color: "var(--red)", margin: "0 auto 12px" }} />
                    <p style={{ fontWeight: 600, color: "var(--red)", marginBottom: 6 }}>No SPF record found</p>
                    <p style={{ fontSize: 13, color: "var(--ink-4)" }}>{lookupResult.message}</p>
                    <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 10 }}>Switch to the Generate tab to create one.</p>
                  </div>
                ) : (
                  <>
                    {/* Score */}
                    {lookupResult.grade && (
                      <div className="card" style={{ padding: "20px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                          <ScoreBadge score={lookupResult.grade.score} />
                          <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--font-mono, 'Geist Mono', monospace)" }}>{lookupResult.domain}</div>
                        </div>
                        {lookupResult.grade.issues.length > 0 && (
                          <div style={{ marginTop: 16 }}>
                            {lookupResult.grade.issues.map((i, idx) => (
                              <div key={idx} style={{ display: "flex", gap: 8, padding: "9px 12px", borderRadius: 8, background: "var(--red-dim)", border: "1px solid var(--red-border)", marginBottom: 6 }}>
                                <XCircle size={13} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} />
                                <span style={{ fontSize: 13, color: "var(--red)" }}>{i}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {lookupResult.grade.tips.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            {lookupResult.grade.tips.map((t, idx) => (
                              <div key={idx} style={{ display: "flex", gap: 8, padding: "9px 12px", borderRadius: 8, background: "var(--yellow-dim)", border: "1px solid rgba(146,96,10,0.2)", marginBottom: 6 }}>
                                <AlertTriangle size={13} style={{ color: "var(--yellow)", flexShrink: 0, marginTop: 1 }} />
                                <span style={{ fontSize: 13, color: "var(--yellow)" }}>{t}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {lookupResult.grade.issues.length === 0 && lookupResult.grade.tips.length === 0 && (
                          <div style={{ display: "flex", gap: 8, padding: "9px 12px", borderRadius: 8, background: "var(--green-dim)", border: "1px solid rgba(26,122,63,0.2)", marginTop: 12 }}>
                            <CheckCircle2 size={13} style={{ color: "var(--green)", flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 13, color: "var(--green)" }}>SPF record looks good — no issues detected</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Raw record */}
                    <div className="card" style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>SPF record</p>
                        <CopyButton text={lookupResult.record || ""} />
                      </div>
                      <code style={{ display: "block", fontFamily: "var(--font-mono, 'Geist Mono', monospace)", fontSize: 13, padding: "14px 16px", borderRadius: 8, background: "var(--paper-2)", border: "1px solid var(--border)", wordBreak: "break-all", lineHeight: 1.7, color: "var(--ink)" }}>
                        {lookupResult.record}
                      </code>
                    </div>

                    {/* Parsed mechanisms */}
                    {lookupResult.parsed && (
                      <div className="card" style={{ padding: "20px 24px" }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Parsed mechanisms</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {lookupResult.parsed.mechanisms.map((m, i) => {
                            const q = m.qualifier as Qualifier;
                            const qConf = QUALIFIER_LABELS[q] || QUALIFIER_LABELS["+"];
                            return (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "var(--paper-2)", color: qConf.color, fontFamily: "var(--font-mono, 'Geist Mono', monospace)", border: "1px solid var(--border)" }}>{q === "+" ? "" : q}{m.type}</span>
                                {m.value && <span style={{ fontSize: 13, fontFamily: "var(--font-mono, 'Geist Mono', monospace)", color: "var(--ink-2)", flex: 1, wordBreak: "break-all" }}>{m.value}</span>}
                                <span style={{ fontSize: 11, color: "var(--ink-4)", flexShrink: 0 }}>{qConf.desc}</span>
                              </div>
                            );
                          })}
                          {lookupResult.parsed.all && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper-2)" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4, fontFamily: "var(--font-mono, 'Geist Mono', monospace)", color: lookupResult.parsed.all === "-all" ? "var(--green)" : lookupResult.parsed.all === "~all" ? "var(--yellow)" : "var(--red)", background: "var(--paper-3)", border: "1px solid var(--border)" }}>{lookupResult.parsed.all}</span>
                              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Default policy — applies to all other senders</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

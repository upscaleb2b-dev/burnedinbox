import Link from "next/link";
import {
  ArrowRight, Flame, CheckCircle2, XCircle, AlertTriangle,
  Shield, Zap, Globe, Lock, BarChart3, Mail, ExternalLink,
  Users, Building2, TrendingUp, Settings2
} from "lucide-react";

// ── Shared styles ─────────────────────────────────────────────────────────────
const S = {
  eyebrow: { fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--red)", marginBottom: 12 },
  h2: { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1.1, letterSpacing: "-0.3px", marginBottom: 0 },
  body: { fontSize: 15, color: "var(--ink-3)", lineHeight: 1.7 },
  label: { fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.07em" },
  section: { padding: "80px 24px", borderBottom: "1px solid var(--border)" },
  wrap: { maxWidth: 1040, margin: "0 auto" },
};

export default function Home() {
  return (
    <div style={{ background: "var(--paper)" }}>

      {/* ── 1. HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)" }}>
        <div style={{ ...S.wrap, maxWidth: 1100, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px" }}>
              burned<span style={{ color: "var(--red)" }}>inbox</span>
            </span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[["How it works", "#how"], ["What we check", "#checks"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>{l}</a>
            ))}
            {/* Resources dropdown */}
            <div style={{ position: "relative" }} className="resources-menu">
              <button style={{ fontSize: 13, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                Resources
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="resources-dropdown" style={{ position: "absolute", top: "calc(100% + 12px)", right: 0, background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "var(--shadow-3)", width: 220, overflow: "hidden", opacity: 0, pointerEvents: "none", transform: "translateY(-4px)", transition: "opacity 0.15s, transform 0.15s" }}>
                <div style={{ padding: "6px" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 10px 4px" }}>Tools</p>
                  <Link href="/dns" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7, textDecoration: "none", transition: "background 0.1s" }} className="resource-link">
                    <div style={{ width: 28, height: 28, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 1 }}>DNS Checker</p>
                      <p style={{ fontSize: 11, color: "var(--ink-4)" }}>Look up any DNS record</p>
                    </div>
                  </Link>
                  <Link href="/tools/spf" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7, textDecoration: "none", transition: "background 0.1s" }} className="resource-link">
                    <div style={{ width: 28, height: 28, background: "rgba(200,16,46,0.08)", border: "1px solid rgba(200,16,46,0.2)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 1 }}>SPF Generator</p>
                      <p style={{ fontSize: 11, color: "var(--ink-4)" }}>Build and validate SPF records</p>
                    </div>
                  </Link>
                  <Link href="/tools/dmarc" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7, textDecoration: "none", transition: "background 0.1s" }} className="resource-link">
                    <div style={{ width: 28, height: 28, background: "rgba(200,16,46,0.08)", border: "1px solid rgba(200,16,46,0.2)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 1 }}>DMARC Lookup</p>
                      <p style={{ fontSize: 11, color: "var(--ink-4)" }}>Check policy, alignment, reporting</p>
                    </div>
                  </Link>
                  <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
                  <p style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 10px 2px" }}>Domain</p>
                  <Link href="/tools/domain-expiry" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7, textDecoration: "none", transition: "background 0.1s" }} className="resource-link">
                    <div style={{ width: 28, height: 28, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 1 }}>Domain Expiry</p>
                      <p style={{ fontSize: 11, color: "var(--ink-4)" }}>Check when any domain expires</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/test" className="btn btn-red" style={{ padding: "7px 16px", fontSize: 13 }}>
              Test my inbox
            </Link>
          </nav>
          <style>{`
            .resources-menu:hover .resources-dropdown { opacity: 1 !important; pointer-events: auto !important; transform: translateY(0) !important; }
            .resource-link:hover { background: var(--paper-2) !important; }
          `}</style>
        </div>
      </header>

      {/* ── 2. HERO ── */}
      <section style={{ padding: "96px 24px 88px", borderBottom: "1px solid var(--border)", background: "var(--paper-2)" }}>
        <div style={{ ...S.wrap, maxWidth: 780, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "var(--red-dim)", border: "1px solid var(--red-border)", marginBottom: 28 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--red)" }}>Built for cold emailers, agencies, and outbound teams</span>
          </div>

          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2.6rem, 6vw, 4.25rem)", lineHeight: 1.05, letterSpacing: "-0.5px", marginBottom: 22 }}>
            Check if your inbox<br />
            <em style={{ color: "var(--red)" }}>is burned?</em>
          </h1>

          <p style={{ ...S.body, fontSize: 17, maxWidth: 540, margin: "0 auto 36px" }}>
            BurnedInbox helps cold emailers test inbox placement, check core DNS and authentication signals, and spot setup issues before they hurt campaigns.
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/test" className="btn btn-red" style={{ padding: "12px 26px", fontSize: 15 }}>
              <Flame size={15} /> Test my inbox
            </Link>
            <Link href="/test" className="btn btn-ghost" style={{ padding: "12px 22px", fontSize: 15 }}>
              Run free placement test <ArrowRight size={14} />
            </Link>
          </div>

          {/* Hero mockup */}
          <div style={{ marginTop: 56, display: "flex", justifyContent: "center" }}>
            <div className="card" style={{ width: "100%", maxWidth: 480, textAlign: "left", overflow: "hidden", boxShadow: "var(--shadow-3)" }}>
              {/* Result banner */}
              <div style={{ padding: "14px 20px", background: "#fff0f0", borderBottom: "2px solid var(--red)", display: "flex", alignItems: "center", gap: 10 }}>
                <XCircle size={18} style={{ color: "var(--red)" }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "var(--red)" }}>Spam Folder</p>
                  <p style={{ fontSize: 12, color: "var(--ink-4)" }}>yourcompany.com · Score: 28/100</p>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "var(--red)", lineHeight: 1 }}>F</div>
              </div>
              {/* Check rows */}
              {[
                { l: "SPF Record", s: "pass" }, { l: "DKIM Signature", s: "fail" },
                { l: "DMARC Policy", s: "fail" }, { l: "Blacklist Status", s: "fail" },
                { l: "Sender Reputation", s: "warn" },
              ].map(({ l, s }) => {
                const col = s === "pass" ? "var(--green)" : s === "fail" ? "var(--red)" : "var(--yellow)";
                const bg  = s === "pass" ? "var(--green-dim)" : s === "fail" ? "var(--red-dim)" : "var(--yellow-dim)";
                const Ic  = s === "pass" ? CheckCircle2 : s === "fail" ? XCircle : AlertTriangle;
                return (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderBottom: "1px solid var(--border)" }}>
                    <Ic size={13} style={{ color: col }} />
                    <span style={{ fontSize: 13, flex: 1, color: "var(--ink-2)" }}>{l}</span>
                    <span style={{ ...S.label, fontSize: 10, color: col, background: bg, padding: "2px 8px", borderRadius: 100 }}>{s}</span>
                  </div>
                );
              })}
              <div style={{ padding: "12px 20px", background: "var(--red-dim)" }}>
                <p style={{ fontSize: 12, color: "var(--red)", fontWeight: 500 }}>→ Replace weak infrastructure with pre-warmed inboxes at WarmInboxes.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. PROCESS ── */}
      <section id="how" style={S.section}>
        <div style={S.wrap}>
          <p style={S.eyebrow}>Simple process</p>
          <h2 style={{ ...S.h2, marginBottom: 48 }}>Three steps to know where you stand</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            {[
              { n: "01", title: "Enter your domain", desc: "Type your domain or email. We generate a unique seed address so only you receive the results." },
              { n: "02", title: "Send us an email", desc: "Send an email from your actual ESP, SMTP, or email client to the seed address. Use your real setup." },
              { n: "03", title: "Get your verdict", desc: "We detect where it lands — inbox, promotions, or spam — plus a full DNS and setup diagnostic." },
            ].map(({ n, title, desc }, i) => (
              <div key={n} style={{ padding: "40px 36px", background: "var(--paper)", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 600, color: "var(--red)", marginBottom: 20 }}>{n}</p>
                <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.2px", marginBottom: 12, color: "var(--ink)" }}>{title}</h3>
                <p style={{ ...S.body, fontSize: 14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. DIAGNOSTIC ── */}
      <section id="checks" style={{ ...S.section, background: "var(--paper-2)" }}>
        <div style={S.wrap}>
          <p style={S.eyebrow}>Comprehensive analysis</p>
          <h2 style={{ ...S.h2, marginBottom: 14 }}>Eight signals. One report.</h2>
          <p style={{ ...S.body, maxWidth: 520, marginBottom: 48 }}>
            BurnedInbox checks the core technical signals that usually decide whether a cold email setup is healthy, weak, or quietly underperforming.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {[
              { icon: Shield, label: "SPF Record", tag: "Critical", desc: "Authorizes your sending servers" },
              { icon: Lock, label: "DKIM Signature", tag: "Critical", desc: "Cryptographic email authentication" },
              { icon: Shield, label: "DMARC Policy", tag: "Critical", desc: "Spoofing and BEC protection" },
              { icon: Globe, label: "47 Blacklists", tag: "Critical", desc: "Spamhaus, SURBL, Barracuda, and more" },
              { icon: Mail, label: "MX Records", tag: "Infrastructure", desc: "Mail routing configuration" },
              { icon: Zap, label: "Reverse DNS", tag: "Infrastructure", desc: "PTR record for your sending IP" },
              { icon: Lock, label: "TLS Encryption", tag: "Security", desc: "In-transit email encryption" },
              { icon: BarChart3, label: "Sender Reputation", tag: "Reputation", desc: "Trust and reputation signal analysis" },
            ].map(({ icon: I, label, tag, desc }) => {
              const critical = tag === "Critical";
              return (
                <div key={label} className="card" style={{ padding: "20px", background: "var(--paper)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--red-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <I size={14} style={{ color: "var(--red)" }} />
                    </div>
                    <span style={{ ...S.label, fontSize: 10, color: critical ? "var(--red)" : "var(--ink-4)", background: critical ? "var(--red-dim)" : "var(--paper-3)", padding: "2px 8px", borderRadius: 100 }}>{tag}</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 12, color: "var(--ink-4)", lineHeight: 1.55 }}>{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. WHY THIS MATTERS ── */}
      <section style={S.section}>
        <div style={S.wrap}>
          <p style={S.eyebrow}>Why setups fail</p>
          <h2 style={{ ...S.h2, marginBottom: 14 }}>Most inbox problems do not<br />look broken at first</h2>
          <p style={{ ...S.body, maxWidth: 520, marginBottom: 48 }}>
            Cold email setups often keep sending even when something underneath is off. Missing authentication, weak reputation, bad DNS, or poor placement can quietly drag down performance before most teams notice.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>
            {[
              { title: "Authentication gaps", desc: "Missing or weak SPF, DKIM, or DMARC can reduce trust and hurt inboxing." },
              { title: "Placement issues", desc: "Messages may send successfully while landing in promotions or spam." },
              { title: "Burned infrastructure", desc: "Old or overused inboxes can drag reply rates down fast." },
              { title: "Bad scaling decisions", desc: "Scaling weak infrastructure usually makes deliverability worse." },
            ].map(({ title, desc }) => (
              <div key={title} className="card" style={{ padding: "24px", borderLeft: "3px solid var(--red)" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{title}</p>
                <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. VERDICT ── */}
      <section style={{ ...S.section, background: "var(--paper-2)" }}>
        <div style={S.wrap}>
          <p style={S.eyebrow}>Clear output</p>
          <h2 style={{ ...S.h2, marginBottom: 14 }}>A simple verdict you can act on</h2>
          <p style={{ ...S.body, maxWidth: 520, marginBottom: 48 }}>
            No vague deliverability advice. Just a clear read on whether to keep sending, fix your setup, or replace weak infrastructure.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {[
              { verdict: "Healthy", icon: CheckCircle2, color: "var(--green)", bg: "var(--green-dim)", desc: "Your setup looks stable. Keep sending and keep monitoring." },
              { verdict: "Needs attention", icon: AlertTriangle, color: "var(--yellow)", bg: "var(--yellow-dim)", desc: "Your setup has weak points that may reduce deliverability." },
              { verdict: "Critical", icon: XCircle, color: "var(--red)", bg: "var(--red-dim)", desc: "Your infrastructure may be hurting campaigns already." },
            ].map(({ verdict, icon: I, color, bg, desc }) => (
              <div key={verdict} className="card" style={{ padding: "28px 24px", borderTop: `3px solid ${color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <I size={18} style={{ color }} />
                  <p style={{ fontSize: 15, fontWeight: 700, color }}>{verdict}</p>
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. USE CASES ── */}
      <section style={{ ...S.section, background: "var(--paper-2)" }}>
        <div style={S.wrap}>
          <p style={S.eyebrow}>Who it's for</p>
          <h2 style={{ ...S.h2, marginBottom: 48 }}>Built for people who rely on outbound</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {[
              { icon: Building2, title: "Agencies", desc: "Check client setups before campaigns go live." },
              { icon: TrendingUp, title: "Founders", desc: "Avoid wasting lead lists on weak infrastructure." },
              { icon: Users, title: "Outbound teams", desc: "Catch setup issues before scaling." },
              { icon: Settings2, title: "Operators", desc: "Use BurnedInbox as a fast first-pass diagnostic." },
            ].map(({ icon: I, title, desc }) => (
              <div key={title} className="card" style={{ padding: "24px", background: "var(--paper)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--paper-3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <I size={15} style={{ color: "var(--ink-3)" }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--ink)" }}>{title}</p>
                <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <section style={S.section}>
        <div style={{ ...S.wrap, maxWidth: 680 }}>
          <h2 style={{ ...S.h2, marginBottom: 40 }}>Common questions</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { q: "What does BurnedInbox check?", a: "It checks core deliverability and infrastructure signals like inbox placement, DNS records, blacklist exposure, authentication, and reputation indicators." },
              { q: "Can this tell me with certainty if an inbox is burned?", a: "Not with perfect certainty. It helps surface likely issues and risk signals that suggest whether a setup is healthy or underperforming." },
              { q: "Is the placement test free?", a: "Yes. BurnedInbox is designed to be a free diagnostic tool." },
              { q: "What should I do if the result is critical?", a: "That depends on the issue. Some setups can be fixed with the right DNS records and a recovery plan. Others are better replaced entirely — especially if the infrastructure is old, overused, or showing blacklist exposure." },
            ].map(({ q, a }, i) => (
              <div key={q} style={{ padding: "22px 0", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{q}</p>
                <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ── */}
      <section id="test-cta" style={{ padding: "96px 24px", background: "var(--ink)", textAlign: "center" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "#fff", lineHeight: 1.1, marginBottom: 18 }}>
            Check your setup before<br /><em>your campaigns pay for it</em>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginBottom: 36, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px" }}>
            Run a free inbox test, see where your messages land, and find out whether your infrastructure is helping you scale or quietly holding you back.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <Link href="/test" className="btn" style={{ background: "#fff", color: "var(--ink)", padding: "13px 28px", fontSize: 15, fontWeight: 600 }}>
              <Flame size={15} style={{ color: "var(--red)" }} /> Test my inbox
            </Link>
            <Link href="/test" className="btn" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", padding: "13px 24px", fontSize: 15 }}>
              Run free placement test
            </Link>
          </div>
          <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
            Need a faster fix? Explore WarmInboxes →
          </a>
        </div>
      </section>

      {/* ── WARMINBOXES BRIDGE — end of page ── */}
      <section style={{ ...S.section, background: "var(--paper-2)" }}>
        <div style={S.wrap}>
          <div style={{ maxWidth: 700, padding: "48px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow-2)" }}>
            <p style={S.eyebrow}>When fixing is not enough</p>
            <h2 style={{ ...S.h2, marginBottom: 16 }}>Some setups should be repaired.<br />Others should be replaced.</h2>
            <p style={{ ...S.body, marginBottom: 12 }}>
              If your inboxes are underperforming, patching DNS is not always the fastest move. Sometimes the infrastructure itself is the problem — old domains, overused IPs, or inboxes that have accumulated too much damage to recover quickly.
            </p>
            <p style={{ ...S.body, marginBottom: 28 }}>
              In those cases, starting fresh with pre-warmed infrastructure is usually faster than waiting for a recovery that may never fully land.
            </p>
            <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Explore prewarmed inboxes <ExternalLink size={13} />
            </a>
            <p style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 16, lineHeight: 1.6 }}>
              WarmInboxes provides prewarmed inboxes and free domains for teams that need to launch faster or reset after a deliverability drop.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: "var(--red)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={11} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>burnedinbox.com</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-4)" }}>Free email deliverability checker. No account required.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {["Privacy", "Terms"].map(l => <a key={l} href="#" style={{ fontSize: 12, color: "var(--ink-4)", textDecoration: "none" }}>{l}</a>)}
        </div>
      </footer>
    </div>
  );
}

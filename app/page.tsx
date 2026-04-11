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
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <style>{`
          .nav-link:hover { color: var(--ink) !important; }
          .mega-group a:hover { background: var(--paper-2) !important; }
          .mega-group a:hover p { color: var(--ink) !important; }
          .tools-menu:hover .mega-panel,
          .tools-menu:focus-within .mega-panel { opacity: 1 !important; pointer-events: auto !important; transform: translateX(-50%) translateY(0) !important; }
        `}</style>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 54, display: "flex", alignItems: "center", gap: 0 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0, marginRight: 28 }}>
            <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>
              burned<span style={{ color: "var(--red)" }}>inbox</span>
            </span>
          </Link>

          {/* Nav links — no overflow, just clean links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>

            {/* Each category is a direct link to a representative tool */}
            {[
              { label: "Placement",      href: "/test" },
              { label: "Auth & DNS",     href: "/tools/spf" },
              { label: "Deliverability", href: "/tools/blacklist" },
              { label: "Calculators",    href: "/tools/infra-calc" },
              { label: "Recovery",       href: "/tools/repair-or-replace" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="nav-link" style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "none", padding: "5px 12px", borderRadius: 7, whiteSpace: "nowrap", transition: "color 0.12s, background 0.12s" }}>
                {label}
              </Link>
            ))}

            {/* All tools mega dropdown */}
            <div className="tools-menu" style={{ position: "relative" }}>
              <button style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", background: "var(--paper-3)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, whiteSpace: "nowrap", marginLeft: 4 }}>
                All 23 tools
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {/* Mega panel — fixed width, centered under button */}
              <div className="mega-panel" style={{ position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%) translateY(-6px)", width: 860, background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-3)", padding: "24px", opacity: 0, pointerEvents: "none", transition: "opacity 0.15s, transform 0.15s", zIndex: 200 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 180px", gap: 28 }}>

                  {/* Col 1: Placement & Deliverability */}
                  <div className="mega-group">
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.09em", color: "var(--red)", marginBottom: 12, paddingLeft: 8 }}>Placement & Deliverability</p>
                    {[
                      { href: "/test",                label: "Inbox placement test",   desc: "Inbox or spam?" },
                      { href: "/tools/burn-score",    label: "Burn score",             desc: "Health rating" },
                      { href: "/tools/warmup-ready",  label: "Warmup readiness",       desc: "Ready to send?" },
                      { href: "/tools/blacklist",     label: "Blacklist checker",      desc: "16 RBLs" },
                      { href: "/tools/header-parser", label: "Email header parser",    desc: "Routing & auth" },
                      { href: "/tools/subject-check", label: "Subject spam tester",    desc: "Trigger words" },
                      { href: "/tools/link-check",    label: "Link reputation",        desc: "URL safety" },
                    ].map(({ href, label, desc }) => (
                      <Link key={href} href={href} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "6px 8px", borderRadius: 7, textDecoration: "none", gap: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", margin: 0, whiteSpace: "nowrap" }}>{label}</p>
                        <p style={{ fontSize: 11, color: "var(--ink-4)", margin: 0, whiteSpace: "nowrap", flexShrink: 0 }}>{desc}</p>
                      </Link>
                    ))}
                  </div>

                  {/* Col 2: Auth & DNS */}
                  <div className="mega-group">
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.09em", color: "var(--red)", marginBottom: 12, paddingLeft: 8 }}>Authentication & DNS</p>
                    {[
                      { href: "/tools/spf",             label: "SPF generator",        desc: "Build & validate" },
                      { href: "/tools/dkim",             label: "DKIM checker",         desc: "Auto-discover" },
                      { href: "/tools/dmarc",            label: "DMARC lookup",         desc: "Policy & reports" },
                      { href: "/dns",                    label: "DNS checker",           desc: "All record types" },
                      { href: "/tools/mx",               label: "MX records",           desc: "Mail routing" },
                      { href: "/tools/rdns",             label: "Reverse DNS",          desc: "PTR + FCrDNS" },
                      { href: "/tools/tracking-domain",  label: "Tracking domain",      desc: "CNAME & SSL" },
                      { href: "/tools/redirect",         label: "Redirect checker",     desc: "4 variants" },
                      { href: "/tools/domain-expiry",    label: "Domain expiry",        desc: "Renewal dates" },
                    ].map(({ href, label, desc }) => (
                      <Link key={href} href={href} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "6px 8px", borderRadius: 7, textDecoration: "none", gap: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", margin: 0, whiteSpace: "nowrap" }}>{label}</p>
                        <p style={{ fontSize: 11, color: "var(--ink-4)", margin: 0, whiteSpace: "nowrap", flexShrink: 0 }}>{desc}</p>
                      </Link>
                    ))}
                  </div>

                  {/* Col 3: Calculators & Recovery */}
                  <div className="mega-group">
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.09em", color: "var(--red)", marginBottom: 12, paddingLeft: 8 }}>Calculators & Recovery</p>
                    {[
                      { href: "/tools/infra-calc",        label: "Infrastructure calc",   desc: "Domains & inboxes" },
                      { href: "/tools/send-limits",       label: "Sending limits",         desc: "Safe daily caps" },
                      { href: "/tools/launch-checklist",  label: "Launch checklist",       desc: "Pre-send" },
                      { href: "/tools/repair-or-replace", label: "Repair or replace",      desc: "What to do?" },
                      { href: "/tools/recovery-time",     label: "Recovery estimator",     desc: "How long?" },
                      { href: "/tools/emergency",         label: "Emergency calculator",   desc: "Infra burned" },
                    ].map(({ href, label, desc }) => (
                      <Link key={href} href={href} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "6px 8px", borderRadius: 7, textDecoration: "none", gap: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", margin: 0, whiteSpace: "nowrap" }}>{label}</p>
                        <p style={{ fontSize: 11, color: "var(--ink-4)", margin: 0, whiteSpace: "nowrap", flexShrink: 0 }}>{desc}</p>
                      </Link>
                    ))}
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", paddingLeft: 8 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.09em", color: "var(--ink-5)", marginBottom: 6 }}>Coming soon</p>
                      {["List cleaner", "Postmortem", "Backup planner", "BIMI checker"].map(l => (
                        <p key={l} style={{ fontSize: 12, color: "var(--ink-5)", padding: "3px 0" }}>{l}</p>
                      ))}
                    </div>
                  </div>

                  {/* Col 4: CTA */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)", borderRadius: 10, padding: "16px 14px" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", marginBottom: 6 }}>Free placement test</p>
                      <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6, marginBottom: 12 }}>See where your emails actually land.</p>
                      <Link href="/test" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#fff", background: "var(--red)", padding: "7px 14px", borderRadius: 7, textDecoration: "none" }}>
                        Test now <ArrowRight size={11} />
                      </Link>
                    </div>
                    <div style={{ padding: "14px", background: "var(--paper-2)", border: "1px solid var(--border)", borderRadius: 10 }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", fontFamily: "'Geist Mono', monospace", lineHeight: 1, marginBottom: 4 }}>23</p>
                      <p style={{ fontSize: 11, color: "var(--ink-4)" }}>free tools. No account needed.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </nav>

          <Link href="/test" className="btn btn-red" style={{ padding: "7px 16px", fontSize: 13, flexShrink: 0, marginLeft: 16 }}>
            Test my inbox
          </Link>
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
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--paper-2)", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Tool grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(3, 1fr)", gap: 40, marginBottom: 40 }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Flame size={13} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px", color: "var(--ink)" }}>
                  burned<span style={{ color: "var(--red)" }}>inbox</span>
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, maxWidth: 260, marginBottom: 16 }}>
                Free email deliverability tools for cold emailers, agencies, and outbound teams. No account required.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href="/test" className="btn btn-red" style={{ fontSize: 12, padding: "6px 14px" }}>Test my inbox</Link>
              </div>
            </div>

            {/* Placement & Deliverability */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.09em", color: "var(--ink-4)", marginBottom: 14 }}>Placement</p>
              {[
                { href: "/test",                label: "Inbox placement test" },
                { href: "/tools/burn-score",    label: "Burn score" },
                { href: "/tools/warmup-ready",  label: "Warmup readiness" },
                { href: "/tools/blacklist",     label: "Blacklist checker" },
                { href: "/tools/header-parser", label: "Email header parser" },
                { href: "/tools/subject-check", label: "Subject spam tester" },
                { href: "/tools/link-check",    label: "Link reputation checker" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ display: "block", fontSize: 13, color: "var(--ink-3)", textDecoration: "none", padding: "4px 0", transition: "color 0.12s" }} className="footer-link">
                  {label}
                </Link>
              ))}
            </div>

            {/* Auth & DNS */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.09em", color: "var(--ink-4)", marginBottom: 14 }}>Auth & DNS</p>
              {[
                { href: "/tools/spf",             label: "SPF generator" },
                { href: "/tools/dkim",             label: "DKIM checker" },
                { href: "/tools/dmarc",            label: "DMARC lookup" },
                { href: "/dns",                    label: "DNS record checker" },
                { href: "/tools/mx",               label: "MX records" },
                { href: "/tools/rdns",             label: "Reverse DNS (PTR)" },
                { href: "/tools/tracking-domain",  label: "Tracking domain" },
                { href: "/tools/redirect",         label: "Redirect checker" },
                { href: "/tools/domain-expiry",    label: "Domain expiry" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ display: "block", fontSize: 13, color: "var(--ink-3)", textDecoration: "none", padding: "4px 0", transition: "color 0.12s" }} className="footer-link">
                  {label}
                </Link>
              ))}
            </div>

            {/* Calculators */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.09em", color: "var(--ink-4)", marginBottom: 14 }}>Calculators</p>
              {[
                { href: "/tools/infra-calc",        label: "Infrastructure calculator" },
                { href: "/tools/send-limits",       label: "Sending limit planner" },
                { href: "/tools/launch-checklist",  label: "Launch checklist" },
                { href: "/tools/repair-or-replace", label: "Repair or replace" },
                { href: "/tools/recovery-time",     label: "Recovery time estimator" },
                { href: "/tools/emergency",         label: "Emergency calculator" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ display: "block", fontSize: 13, color: "var(--ink-3)", textDecoration: "none", padding: "4px 0", transition: "color 0.12s" }} className="footer-link">
                  {label}
                </Link>
              ))}
            </div>

          </div>

          {/* Bottom bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, color: "var(--ink-4)" }}>
              23 free tools. No account. No credit card. Built for cold emailers.
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--ink-4)", textDecoration: "none" }}>WarmInboxes</a>
              {["Privacy", "Terms"].map(l => <a key={l} href="#" style={{ fontSize: 12, color: "var(--ink-4)", textDecoration: "none" }}>{l}</a>)}
            </div>
          </div>
        </div>
        <style>{`.footer-link:hover { color: var(--ink) !important; }`}</style>
      </footer>
    </div>
  );
}

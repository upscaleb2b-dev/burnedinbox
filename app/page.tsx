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

export const metadata = {
  alternates: { canonical: "/" },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://burnedinbox.com/#org",
      name: "BurnedInbox",
      url: "https://burnedinbox.com",
      logo: "https://burnedinbox.com/icon.png",
      description: "Free email deliverability tools and operator-grade guides for cold email teams and agencies.",
    },
    {
      "@type": "WebSite",
      "@id": "https://burnedinbox.com/#site",
      name: "BurnedInbox",
      url: "https://burnedinbox.com",
      publisher: { "@id": "https://burnedinbox.com/#org" },
    },
  ],
};

export default function Home() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />

      {/* ── 1. HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <style>{`
          .nav-item { position: relative; }
          .nav-item > a, .nav-item > button {
            font-size: 13px; color: var(--ink-3); background: none; border: none;
            cursor: pointer; text-decoration: none; padding: 5px 11px; border-radius: 7px;
            white-space: nowrap; transition: color 0.12s, background 0.12s;
            display: flex; align-items: center; gap: 4px; font-family: inherit; font-weight: 400;
          }
          .nav-item > a:hover, .nav-item > button:hover { color: var(--ink); background: var(--paper-2); }
          .nav-item:hover .drop, .nav-item:focus-within .drop {
            opacity: 1 !important; pointer-events: auto !important; transform: translateY(0) !important;
          }
          .drop { position: absolute; top: calc(100% + 8px); left: 0; background: var(--paper);
            border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-3);
            padding: 8px; min-width: 220px; opacity: 0; pointer-events: none;
            transform: translateY(-6px); transition: opacity 0.15s, transform 0.15s; z-index: 200; }
          .drop-wide { min-width: 680px; padding: 20px 20px 16px; }
          .drop-item { display: flex; align-items: baseline; justify-content: space-between;
            gap: 10px; padding: 6px 10px; border-radius: 7px; text-decoration: none; }
          .drop-item:hover { background: var(--paper-2); }
          .drop-item .di-label { font-size: 13px; font-weight: 500; color: var(--ink); white-space: nowrap; }
          .drop-item .di-desc { font-size: 11px; color: var(--ink-4); white-space: nowrap; flex-shrink: 0; }
          .drop-head { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em;
            color: var(--red); margin-bottom: 6px; padding: 0 10px; }
          .chevron { width: 10px; height: 10px; opacity: 0.5; }
          @keyframes ai-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.5), 0 0 12px rgba(139,92,246,0.3); }
            50% { box-shadow: 0 0 0 4px rgba(139,92,246,0), 0 0 20px rgba(139,92,246,0.5); }
          }
          .ai-btn {
            display: flex; flex-direction: column; align-items: center; gap: 1px;
            padding: 5px 14px; border-radius: 8px; text-decoration: none;
            background: linear-gradient(135deg, #7c3aed, #6d28d9);
            animation: ai-pulse 2.5s ease-in-out infinite;
            border: 1px solid rgba(139,92,246,0.4); flex-shrink: 0;
            transition: transform 0.15s;
          }
          .ai-btn:hover { transform: scale(1.03); }
        `}</style>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 54, display: "flex", alignItems: "center", gap: 0 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0, marginRight: 20 }}>
            <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>
              burned<span style={{ color: "var(--red)" }}>inbox</span>
            </span>
          </Link>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>

            {/* 1. PLACEMENT */}
            <div className="nav-item">
              <button>
                Placement
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="drop">
                <p className="drop-head">Tools</p>
                {[
                  { href: "/test",               label: "Inbox placement test",  desc: "Inbox or spam?" },
                  { href: "/tools/burn-score",   label: "Burn score calculator", desc: "Domain health" },
                  { href: "/tools/warmup-ready", label: "Warmup readiness",      desc: "Ready to send?" },
                  { href: "/tools/blacklist",    label: "Blacklist checker",     desc: "16 RBLs" },
                  { href: "/tools/header-parser",label: "Email header parser",   desc: "Routing & auth" },
                  { href: "/tools/subject-check",label: "Subject spam tester",   desc: "Trigger words" },
                  { href: "/tools/link-check",   label: "Link reputation",       desc: "URL safety" },
                  { href: "/tools/email-spam",   label: "Email content spam test", desc: "Spam triggers" },
                ].map(({ href, label, desc }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">{desc}</span>
                  </Link>
                ))}
                <div style={{ margin: "8px 0 4px", borderTop: "1px solid var(--border)" }} />
                <p className="drop-head" style={{ marginTop: 8 }}>Guides</p>
                {[
                  { href: "/blog/inbox-placement-test-before-blaming-copy", label: "Run a placement test" },
                  { href: "/blog/why-cold-emails-suddenly-going-to-spam",   label: "Why emails go to spam" },
                  { href: "/blog/placement-vs-deliverability-difference",   label: "Placement vs deliverability" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">Guide →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. AUTH & DNS */}
            <div className="nav-item">
              <button>
                Auth & DNS
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="drop">
                <p className="drop-head">Tools</p>
                {[
                  { href: "/tools/spf",            label: "SPF checker",       desc: "Build & validate" },
                  { href: "/tools/dkim",            label: "DKIM checker",      desc: "Auto-discover" },
                  { href: "/tools/dmarc",           label: "DMARC lookup",      desc: "Policy & reports" },
                  { href: "/dns",                   label: "DNS checker",       desc: "All record types" },
                  { href: "/tools/mx",              label: "MX records",        desc: "Mail routing" },
                  { href: "/tools/rdns",            label: "Reverse DNS / PTR", desc: "FCrDNS check" },
                  { href: "/tools/tracking-domain", label: "Tracking domain",   desc: "CNAME & SSL" },
                  { href: "/tools/redirect",        label: "Redirect checker",  desc: "4 variants" },
                  { href: "/tools/domain-expiry",   label: "Domain expiry",     desc: "Renewal dates" },
                  { href: "/tools/bimi",            label: "BIMI lookup",        desc: "Logo & VMC" },
                  { href: "/tools/mta-sts",         label: "MTA-STS checker",    desc: "TLS enforcement" },
                ].map(({ href, label, desc }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">{desc}</span>
                  </Link>
                ))}
                <div style={{ margin: "8px 0 4px", borderTop: "1px solid var(--border)" }} />
                <p className="drop-head" style={{ marginTop: 8 }}>Guides</p>
                {[
                  { href: "/blog/spf-dkim-dmarc-cold-email-fix-guide", label: "SPF, DKIM & DMARC explained" },
                  { href: "/blog/dns-error-killing-deliverability",     label: "Is a DNS error the problem?" },
                  { href: "/blog/dmarc-cold-email-what-it-does-why-it-matters", label: "DMARC for cold email" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">Guide →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. CHECKLISTS */}
            <div className="nav-item">
              <button>
                Checklists
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="drop">
                <p className="drop-head">Interactive tools</p>
                {[
                  { href: "/tools/launch-checklist", label: "Pre-launch checklist",    desc: "Before first send" },
                  { href: "/tools/warmup-ready",     label: "Warmup readiness check",  desc: "Is inbox ready?" },
                ].map(({ href, label, desc }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">{desc}</span>
                  </Link>
                ))}
                <div style={{ margin: "8px 0 4px", borderTop: "1px solid var(--border)" }} />
                <p className="drop-head" style={{ marginTop: 8 }}>Written checklists</p>
                {[
                  { href: "/blog/cold-email-setup-checklist-domain-dns-tracking", label: "Domain & DNS setup" },
                  { href: "/blog/cold-email-spam-checklist-21-reasons",            label: "21 reasons you're in spam" },
                  { href: "/blog/m365-setup-checklist-inboxing",                   label: "M365 setup checklist" },
                  { href: "/blog/cold-email-domain-readiness-check-15-minutes",    label: "15-min domain audit" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">Checklist →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. CALCULATORS */}
            <div className="nav-item">
              <button>
                Calculators
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="drop drop-wide" style={{ left: "auto", right: 0, minWidth: 640 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  <div style={{ paddingRight: 16, borderRight: "1px solid var(--border)" }}>
                    <p className="drop-head">Infra planning</p>
                    {[
                      { href: "/tools/inbox-count",      label: "Inbox count calc",      desc: "Active + backup + warmup" },
                      { href: "/tools/domain-count",     label: "Domain count calc",     desc: "All domain types" },
                      { href: "/tools/sending-capacity", label: "Sending capacity",      desc: "Leads per month" },
                      { href: "/tools/client-capacity",  label: "Client capacity planner", desc: "Agency · all clients" },
                      { href: "/tools/infra-calc",       label: "Infrastructure calc",   desc: "Full infra model" },
                      { href: "/tools/send-limits",      label: "Sending limits",        desc: "Safe daily caps" },
                      { href: "/tools/backup-budget",    label: "Backup infra budget",   desc: "Cost vs risk" },
                    ].map(({ href, label, desc }) => (
                      <Link key={href} href={href} className="drop-item">
                        <span className="di-label">{label}</span>
                        <span className="di-desc">{desc}</span>
                      </Link>
                    ))}
                  </div>
                  <div style={{ paddingLeft: 16 }}>
                    <p className="drop-head">Recovery & risk</p>
                    {[
                      { href: "/tools/repair-or-replace",         label: "Repair or replace",         desc: "Make the call" },
                      { href: "/tools/recovery-time",             label: "Recovery time est.",         desc: "How long?" },
                      { href: "/tools/replacement-vs-downtime",   label: "Replace vs downtime cost",   desc: "True cost compare" },
                      { href: "/tools/burn-cost",                 label: "Burn cost calculator",       desc: "True cost of burning" },
                      { href: "/tools/warmup-time-saved",         label: "Warm-up time saved",         desc: "DIY vs pre-warmed" },
                      { href: "/tools/deliverability-risk",       label: "Deliverability risk planner", desc: "8-factor risk score" },
                      { href: "/tools/emergency",                 label: "Emergency calculator",       desc: "Infra burned now" },
                    ].map(({ href, label, desc }) => (
                      <Link key={href} href={href} className="drop-item">
                        <span className="di-label">{label}</span>
                        <span className="di-desc">{desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. TEMPLATES */}
            <div className="nav-item">
              <button>
                Templates
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="drop">
                <p className="drop-head">Client comms</p>
                {[
                  { href: "/blog/explain-deliverability-problems-to-clients", label: "Explain deliverability to clients" },
                  { href: "/blog/keep-client-campaigns-running-when-infra-breaks", label: "When infra breaks mid-campaign" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">Template →</span>
                  </Link>
                ))}
                <div style={{ margin: "8px 0 4px", borderTop: "1px solid var(--border)" }} />
                <p className="drop-head" style={{ marginTop: 8 }}>Setup templates</p>
                {[
                  { href: "/blog/google-workspace-setup-cold-email-correctly", label: "GWS setup guide" },
                  { href: "/blog/microsoft-365-cold-email-setup",              label: "M365 setup guide" },
                  { href: "/blog/domain-warmup-after-infra-reset",             label: "Infra reset template" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">Template →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 6. SOPs */}
            <div className="nav-item">
              <button>
                SOPs
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="drop">
                <p className="drop-head">Emergency SOPs</p>
                {[
                  { href: "/blog/first-24-hours-after-inboxes-burned",         label: "First 24 hours after burning" },
                  { href: "/blog/cold-email-deliverability-collapsed-triage",   label: "Full deliverability triage" },
                  { href: "/blog/disaster-recovery-sop-agency",                 label: "Agency disaster recovery SOP" },
                  { href: "/blog/cold-email-disaster-recovery-sop",             label: "Cold email disaster recovery" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">SOP →</span>
                  </Link>
                ))}
                <div style={{ margin: "8px 0 4px", borderTop: "1px solid var(--border)" }} />
                <p className="drop-head" style={{ marginTop: 8 }}>Operational SOPs</p>
                {[
                  { href: "/blog/weekly-deliverability-monitoring-sop",          label: "Weekly monitoring SOP" },
                  { href: "/blog/new-domain-cold-email-provisioning-sop",        label: "New domain provisioning SOP" },
                  { href: "/blog/inbox-rotation-sop-cold-email",                 label: "Inbox rotation SOP" },
                  { href: "/blog/client-onboarding-deliverability-sop",          label: "Client onboarding audit SOP" },
                  { href: "/blog/blacklist-delisting-sop",                       label: "Blacklist delisting SOP" },
                  { href: "/blog/replace-inboxes-without-pausing-campaigns",    label: "Replace inboxes without pausing" },
                  { href: "/blog/agency-rotate-inboxes-deliverability-slipping", label: "Agency inbox rotation" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">SOP →</span>
                  </Link>
                ))}
                <div style={{ margin: "8px 0 4px", borderTop: "1px solid var(--border)" }} />
                <p className="drop-head" style={{ marginTop: 8 }}>Pre-Warmed Inboxes</p>
                {[
                  { href: "/blog/best-place-to-buy-pre-warmed-inboxes",  label: "Where to buy pre-warmed inboxes" },
                  { href: "/blog/are-pre-warmed-inboxes-worth-it",        label: "Are pre-warmed inboxes worth it?" },
                  { href: "/blog/pre-warmed-inboxes-vs-diy-warmup",       label: "Pre-warmed vs DIY warmup" },
                  { href: "/blog/pre-warmed-email-accounts-reddit",       label: "What Reddit says about pre-warmed" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">Guide →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 7. GUIDES */}
            <div className="nav-item">
              <button>
                Guides
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="drop drop-wide" style={{ left: "auto", right: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                  <div>
                    <p className="drop-head">Google Workspace</p>
                    {[
                      { href: "/blog/google-workspace-emails-go-to-spam",                label: "GWS emails going to spam" },
                      { href: "/blog/google-workspace-deliverability-problems-causes-fixes", label: "GWS deliverability guide" },
                      { href: "/blog/google-workspace-spam-after-scaling",               label: "GWS spam after scaling" },
                      { href: "/blog/recover-damaged-google-workspace-setup",            label: "Recover a damaged GWS setup" },
                      { href: "/blog/gws-warmup-not-translating",                        label: "Warmup not working" },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href} className="drop-item">
                        <span className="di-label">{label}</span>
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className="drop-head">Microsoft 365</p>
                    {[
                      { href: "/blog/microsoft-365-deliverability-fixes",    label: "M365 deliverability fixes" },
                      { href: "/blog/outlook-spam-diagnosis-fixes",           label: "Outlook spam diagnosis" },
                      { href: "/blog/why-outlook-filters-harder-than-gmail", label: "Why Outlook is harder" },
                      { href: "/blog/m365-when-to-replace",                  label: "When to replace M365" },
                      { href: "/blog/m365-reply-rates-fall-before-bounces",  label: "Reply rates fall silently" },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href} className="drop-item">
                        <span className="di-label">{label}</span>
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className="drop-head">Recovery & Warmup</p>
                    {[
                      { href: "/blog/how-long-to-recover-burned-email-domain", label: "How long does recovery take?" },
                      { href: "/blog/recover-burned-inbox-or-replace",          label: "Recover or replace?" },
                      { href: "/blog/warm-up-new-inboxes-without-burning-them", label: "Warmup without burning" },
                      { href: "/blog/is-cold-email-domain-permanently-burned",  label: "Is my domain permanently burned?" },
                      { href: "/blog/when-to-abandon-domain",                   label: "When to abandon a domain" },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href} className="drop-item">
                        <span className="di-label">{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", textAlign: "right" }}>
                  <Link href="/blog" style={{ fontSize: 12, color: "var(--red)", textDecoration: "none", fontWeight: 600 }}>
                    View all 97 guides →
                  </Link>
                </div>
              </div>
            </div>

            {/* 8. CHEAT SHEETS */}
            <div className="nav-item">
              <button>
                Cheat Sheets
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="drop" style={{ left: "auto", right: 0 }}>
                <p className="drop-head">Quick references</p>
                {[
                  { href: "/blog/spf-vs-dkim-vs-dmarc-which-breaking-emails",  label: "SPF vs DKIM vs DMARC",        desc: "Which one is broken?" },
                  { href: "/blog/cold-email-spam-checklist-21-reasons",          label: "21 spam reasons",             desc: "Full checklist" },
                  { href: "/blog/cold-email-domain-readiness-check-15-minutes",  label: "15-min domain audit",         desc: "Quick checklist" },
                  { href: "/blog/burned-domain-vs-burned-inbox",                 label: "Domain vs inbox burned",      desc: "How to tell" },
                  { href: "/blog/placement-vs-deliverability-difference",        label: "Placement vs deliverability", desc: "The difference" },
                  { href: "/blog/how-to-tell-if-inboxes-burned-or-something-else", label: "Burned or just broken?",   desc: "Diagnosis" },
                ].map(({ href, label, desc }) => (
                  <Link key={href} href={href} className="drop-item">
                    <span className="di-label">{label}</span>
                    <span className="di-desc">{desc}</span>
                  </Link>
                ))}
              </div>
            </div>

          </nav>

          {/* ── Cold Email AI — centre CTA ── */}
          <a
            href="https://chatgpt.com/g/g-69bc393551dc81918483833d2bda685a-cold-email-ai-by-instantly-clay-smartlead-experts"
            target="_blank"
            rel="noopener noreferrer"
            className="ai-btn"
            style={{ margin: "0 12px" }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", letterSpacing: "-0.1px" }}>✦ Cold Email AI</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>By Clay, Instantly &amp; Smartlead Experts</span>
          </a>

          <Link href="/test" className="btn btn-red" style={{ padding: "7px 16px", fontSize: 13, flexShrink: 0 }}>
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
                { href: "/tools/inbox-count",            label: "Inbox count" },
                { href: "/tools/domain-count",           label: "Domain count" },
                { href: "/tools/sending-capacity",       label: "Sending capacity" },
                { href: "/tools/client-capacity",        label: "Client capacity planner" },
                { href: "/tools/infra-calc",             label: "Infrastructure calculator" },
                { href: "/tools/send-limits",            label: "Sending limit planner" },
                { href: "/tools/backup-budget",          label: "Backup infra budget" },
                { href: "/tools/repair-or-replace",      label: "Repair or replace" },
                { href: "/tools/recovery-time",          label: "Recovery time estimator" },
                { href: "/tools/replacement-vs-downtime", label: "Replace vs downtime cost" },
                { href: "/tools/burn-cost",              label: "Burn cost calculator" },
                { href: "/tools/warmup-time-saved",      label: "Warm-up time saved" },
                { href: "/tools/deliverability-risk",    label: "Deliverability risk planner" },
                { href: "/tools/emergency",              label: "Emergency calculator" },
                { href: "/tools/launch-checklist",       label: "Launch checklist" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ display: "block", fontSize: 13, color: "var(--ink-3)", textDecoration: "none", padding: "4px 0", transition: "color 0.12s" }} className="footer-link">
                  {label}
                </Link>
              ))}
            </div>

          </div>

          {/* Cold Email AI footer block */}
          <div style={{ margin: "40px 0 32px", display: "flex", justifyContent: "center" }}>
            <a
              href="https://chatgpt.com/g/g-69bc393551dc81918483833d2bda685a-cold-email-ai-by-instantly-clay-smartlead-experts"
              target="_blank"
              rel="noopener noreferrer"
              className="ai-footer-btn"
            >
              <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>✦ Cold Email AI</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>By Clay, Instantly &amp; Smartlead Certified Experts</span>
            </a>
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
        <style>{`
          .footer-link:hover { color: var(--ink) !important; }
          .ai-footer-btn {
            display: flex; flex-direction: column; align-items: center; gap: 6px;
            padding: 18px 36px; border-radius: 14px; text-decoration: none;
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%);
            box-shadow: 0 0 0 1px rgba(139,92,246,0.4), 0 8px 32px rgba(109,40,217,0.4), 0 0 60px rgba(139,92,246,0.15);
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .ai-footer-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 0 0 1px rgba(139,92,246,0.5), 0 12px 40px rgba(109,40,217,0.5), 0 0 80px rgba(139,92,246,0.25);
          }
        `}</style>
      </footer>
    </div>
  );
}

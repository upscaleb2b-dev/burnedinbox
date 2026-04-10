import Link from "next/link";
import { ArrowRight, Flame, CheckCircle2, XCircle, Shield, Zap, Globe, Lock, BarChart3, Mail, ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <div style={{ background: "var(--paper)" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "var(--red)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={14} color="#fff" />
            </div>
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>
              burned<span style={{ color: "var(--red)" }}>inbox</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#how" style={{ fontSize: 14, color: "var(--ink-3)", textDecoration: "none" }}>How it works</a>
            <a href="#checks" style={{ fontSize: 14, color: "var(--ink-3)", textDecoration: "none" }}>What we check</a>
            <Link href="/test" className="btn btn-red" style={{ padding: "8px 16px", fontSize: 13 }}>
              Test my inbox <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ borderBottom: "1px solid var(--border)", padding: "80px 24px 72px", background: "var(--paper-2)" }} className="paper-texture">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "var(--red-dim)", border: "1px solid var(--red-border)", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", display: "inline-block", animation: "blink-dot 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--red)" }}>Free inbox placement testing</span>
          </div>

          <h1 className="serif" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: 1.05, marginBottom: 20, letterSpacing: "-0.5px" }}>
            Are your emails<br />
            <em style={{ color: "var(--red)" }}>actually landing?</em>
          </h1>

          <p style={{ fontSize: 18, color: "var(--ink-3)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.65 }}>
            Send us a test email and find out in 30 seconds whether you're hitting the inbox, promotions, or spam. Free — no account needed.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/test" className="btn btn-red" style={{ padding: "13px 28px", fontSize: 15 }}>
              <Flame size={15} /> Run free placement test
            </Link>
            <a href="#how" className="btn btn-ghost" style={{ padding: "13px 24px", fontSize: 15 }}>
              How it works
            </a>
          </div>

          {/* Trust row */}
          <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
            {[
              { icon: Shield, t: "47 blacklists checked" },
              { icon: Zap, t: "Results in ~15 seconds" },
              { icon: Lock, t: "No data stored" },
            ].map(({ icon: I, t }) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)" }}>
                <I size={13} style={{ color: "var(--ink-4)" }} /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: "72px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--red)", marginBottom: 10 }}>Simple process</p>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>Three steps to know where you stand</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 2, border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            {[
              { n: "01", title: "Enter your domain", desc: "Type your domain or email. We generate a unique seed address only you receive results for." },
              { n: "02", title: "Send us an email", desc: "Send any email from your actual ESP, SMTP, or email client to our seed address. Uses your real setup." },
              { n: "03", title: "Get your verdict", desc: "We detect the folder within seconds — inbox, promotions, or spam — plus a full DNS diagnostic." },
            ].map(({ n, title, desc }, i) => (
              <div key={n} style={{ padding: "36px 32px", background: "var(--paper)", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--red)", marginBottom: 16, fontFamily: "Geist Mono, monospace" }}>{n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.2px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we check */}
      <section id="checks" style={{ padding: "72px 24px", borderBottom: "1px solid var(--border)", background: "var(--paper-2)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--red)", marginBottom: 10 }}>Comprehensive analysis</p>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>Eight signals. One report.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
            {[
              { icon: Shield, label: "SPF Record", tag: "Critical", desc: "Authorizes your sending servers" },
              { icon: Lock, label: "DKIM Signature", tag: "Critical", desc: "Cryptographic email authentication" },
              { icon: Shield, label: "DMARC Policy", tag: "Critical", desc: "Spoofing and BEC protection" },
              { icon: Globe, label: "47 Blacklists", tag: "Critical", desc: "Spamhaus, SURBL, Barracuda + more" },
              { icon: Mail, label: "MX Records", tag: "Infrastructure", desc: "Mail routing configuration" },
              { icon: Zap, label: "Reverse DNS", tag: "Infrastructure", desc: "PTR record for your sending IP" },
              { icon: Lock, label: "TLS Encryption", tag: "Security", desc: "In-transit email encryption" },
              { icon: BarChart3, label: "Sender Reputation", tag: "Reputation", desc: "ISP trust score analysis" },
            ].map(({ icon: I, label, tag, desc }) => (
              <div key={label} className="card" style={{ padding: "18px 20px", transition: "box-shadow 0.2s, transform 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--red-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <I size={14} style={{ color: "var(--red)" }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: tag === "Critical" ? "var(--red)" : "var(--ink-4)", background: tag === "Critical" ? "var(--red-dim)" : "var(--paper-3)", padding: "2px 7px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.06em" }}>{tag}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "var(--ink)" }}>{label}</p>
                <p style={{ fontSize: 12, color: "var(--ink-4)", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* If you're burning */}
      <section style={{ padding: "72px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--red)", marginBottom: 10 }}>If you're burning</p>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, marginBottom: 20 }}>Your inbox<br /><em>is fixable.</em></h2>
            <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 24 }}>
              A burned domain is recoverable — but recovery takes weeks. The fastest path is starting fresh with pre-warmed inboxes from <strong style={{ color: "var(--ink)" }}>WarmInboxes</strong>, with established reputation and clean IPs, ready to send from day one.
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {["Pre-warmed sender reputation — no cold start", "SPF, DKIM, DMARC configured out of the box", "Clean IP infrastructure, not blacklisted", "Deploy in under 10 minutes"].map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-3)" }}>
                  <CheckCircle2 size={14} style={{ color: "var(--green)", flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <a href="https://warminboxes.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Get pre-warmed inboxes <ExternalLink size={13} />
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Burned Domain", color: "var(--red)", items: ["Spam folder delivery", "Blacklisted IPs", "Missing auth records", "Months to recover"], bad: true },
              { label: "WarmInboxes", color: "var(--green)", items: ["Inbox delivery from day one", "Clean infrastructure", "Auth pre-configured", "Campaigns ship today"], bad: false },
            ].map(({ label, color, items, bad }) => (
              <div key={label} className="card" style={{ padding: "20px 24px", borderLeft: `3px solid ${color}` }}>
                <p style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 12 }}>{label}</p>
                {items.map(i => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-3)", marginBottom: 6 }}>
                    {bad ? <XCircle size={12} style={{ color: "var(--red)", flexShrink: 0 }} /> : <CheckCircle2 size={12} style={{ color: "var(--green)", flexShrink: 0 }} />}
                    {i}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 24px", background: "var(--ink)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Flame size={28} color="rgba(255,255,255,0.5)" style={{ marginBottom: 20, display: "block", margin: "0 auto 20px" }} />
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
            Stop guessing.<br /><em>Know.</em>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 32, lineHeight: 1.65 }}>
            A 15-second test can save weeks of deliverability recovery.
          </p>
          <Link href="/test" className="btn" style={{ background: "#fff", color: "var(--ink)", padding: "14px 32px", fontSize: 15, fontWeight: 600, display: "inline-flex" }}>
            Run my free test <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Footer */}
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

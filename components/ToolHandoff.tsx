import Link from "next/link";
import { Flame, ArrowLeft, ArrowRight, ExternalLink, Check } from "lucide-react";
import { TOOL_HANDOFFS } from "@/lib/tool-handoffs";

export default function ToolHandoffPage({ tool }: { tool: string }) {
  const t = TOOL_HANDOFFS[tool];
  const related = t.related.map(k => TOOL_HANDOFFS[k]).filter(Boolean);

  const cta = (
    <a href={t.warmInboxesUrl} target="_blank" rel="noopener" className="btn btn-red handoff-cta">
      Open the free {t.warmInboxesName} <ExternalLink size={14} />
    </a>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`
        .handoff-cta { padding: 13px 22px; font-size: 15px; font-weight: 600; }
        .handoff-related:hover { border-color: var(--ink-4) !important; }
        @media (max-width: 560px) { .handoff-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={13} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>
            burned<span style={{ color: "var(--red)" }}>inbox</span>
          </span>
        </Link>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
          <ArrowLeft size={13} /> Back
        </Link>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 80px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--red)", marginBottom: 12 }}>Free tool</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.85rem, 4vw, 2.5rem)", lineHeight: 1.12, color: "var(--ink)", marginBottom: 14 }}>
          {t.name}
        </h1>
        <p style={{ fontSize: 17, color: "var(--ink-3)", lineHeight: 1.6, marginBottom: 28 }}>{t.summary}</p>
        {cta}
        <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 10 }}>Opens on warminboxes.com · free · no account required</p>

        <section className="card" style={{ padding: "26px 28px", marginTop: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>What it&apos;s for</h2>
          <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.75 }}>{t.whatItIs}</p>
        </section>

        <div className="handoff-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          {[{ title: "What it checks", items: t.checks }, { title: "When to use it", items: t.useWhen }].map(block => (
            <section key={block.title} className="card" style={{ padding: "22px 24px" }}>
              <h2 style={{ fontSize: 15, marginBottom: 14 }}>{block.title}</h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {block.items.map(item => (
                  <li key={item} style={{ display: "flex", gap: 9, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55 }}>
                    <Check size={15} style={{ color: "var(--green)", flexShrink: 0, marginTop: 3 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {t.extra && (
          <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.65, marginTop: 18 }}>
            {t.extra.note}{" "}
            <a href={t.extra.url} target="_blank" rel="noopener" style={{ color: "var(--ink)", fontWeight: 600 }}>
              Open the {t.extra.label} →
            </a>
          </p>
        )}

        <section style={{ marginTop: 36, padding: "26px 28px", borderRadius: 14, background: "var(--ink)" }}>
          <h2 style={{ fontSize: 19, color: "#fff", marginBottom: 8 }}>Ready to check your domain?</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 18 }}>
            The {t.warmInboxesName} runs on warminboxes.com — results are live, queried the moment you run it.
          </p>
          <a href={t.warmInboxesUrl} target="_blank" rel="noopener"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 18px", borderRadius: 8, background: "#fff", color: "var(--ink)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Open the {t.warmInboxesName} <ExternalLink size={13} />
          </a>
        </section>

        <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 24 }}>
          Want SPF, DKIM, DMARC and blacklists checked together?{" "}
          <Link href="/test" style={{ color: "var(--red)", fontWeight: 600, textDecoration: "none" }}>Run the free placement test →</Link>
        </p>

        {related.length > 0 && (
          <section style={{ marginTop: 44 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)", marginBottom: 14 }}>Related tools</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {related.map(r => (
                <Link key={r.path} href={r.path} className="handoff-related"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 18px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 10, textDecoration: "none" }}>
                  <span>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{r.name}</span>
                    <span style={{ display: "block", fontSize: 13, color: "var(--ink-4)", marginTop: 2 }}>{r.summary}</span>
                  </span>
                  <ArrowRight size={14} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

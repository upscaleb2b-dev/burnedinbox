import Link from "next/link";
import { Flame, ArrowLeft, ArrowRight } from "lucide-react";
import { GUIDES } from "@/lib/guides";

export const metadata = {
  title: "Email Error Library: SMTP Bounce Codes Explained",
  description: "What Gmail, Outlook and Microsoft 365 bounce codes like 550 5.7.26, 421 4.7.28 and 550 5.7.515 mean, and the checks that fix them.",
  alternates: { canonical: "/errors" },
};

const ERRORS = GUIDES.filter(g => g.kind === "error");

export default function ErrorLibrary() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={13} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>burned<span style={{ color: "var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}><ArrowLeft size={13} /> Back</Link>
      </nav>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3.2vw, 2.375rem)", color: "var(--ink)", marginBottom: 12 }}>Email error library</h1>
        <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 32 }}>
          A bounce code tells you more than a spam-folder guess ever will. Find your error, copy the full SMTP response, and work through the checks that apply to it.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ERRORS.map(g => (
            <Link key={g.path} href={g.path} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "16px 20px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 10, textDecoration: "none" }}>
              <span>
                <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{g.title}</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--ink-4)", marginTop: 3, lineHeight: 1.5 }}>{g.description}</span>
              </span>
              <ArrowRight size={14} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

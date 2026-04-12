import Link from "next/link";
import { Flame, ArrowRight, Clock } from "lucide-react";
import { posts } from "./posts";

export const metadata = {
  title: "Cold Email Deliverability Blog — BurnedInbox",
  description: "Practical recovery guides, technical fixes, and operator-level deliverability content for cold emailers and agencies.",
};

const CATEGORIES = ["All", "Emergency", "Spam & Placement", "Google Workspace", "Microsoft 365", "DNS & Auth", "Warmup & Recovery", "Agency"];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } .post-card:hover { border-color: var(--ink-3) !important; } .post-card:hover .post-title { color: var(--red) !important; }`}</style>

      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={13} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>burned<span style={{ color: "var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/test" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--red)", padding: "7px 16px", borderRadius: 8, textDecoration: "none" }}>
          Test my inbox <ArrowRight size={13} />
        </Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "var(--ink)", letterSpacing: "-0.3px", marginBottom: 12 }}>
            Deliverability guides
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7, maxWidth: 600 }}>
            Practical recovery content for cold emailers and agencies. No fluff — just what's wrong and how to fix it.
          </p>
        </div>

        {/* Posts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card" style={{ display: "block", textDecoration: "none", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px", transition: "border-color 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "2px 8px", borderRadius: 4, color: "var(--red)", background: "var(--red-dim)" }}>{post.category}</span>
                <span style={{ fontSize: 11, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} /> {post.readTime} min read</span>
              </div>
              <h2 className="post-title" style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", lineHeight: 1.4, marginBottom: 8, transition: "color 0.15s" }}>{post.title}</h2>
              <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65 }}>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

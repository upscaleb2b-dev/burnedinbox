import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame, ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { posts } from "../posts";
import { posts2 } from "../posts2";

const allPosts = [...posts, ...posts2];

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: `${post.title} — BurnedInbox`, description: post.excerpt };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = allPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .prose h2 { font-size: 20px; font-weight: 700; color: var(--ink); margin: 36px 0 14px; letter-spacing: -0.2px; }
        .prose h3 { font-size: 16px; font-weight: 700; color: var(--ink); margin: 28px 0 10px; }
        .prose p { font-size: 15px; color: var(--ink-3); line-height: 1.8; margin-bottom: 18px; }
        .prose ul, .prose ol { margin: 0 0 18px 20px; }
        .prose li { font-size: 15px; color: var(--ink-3); line-height: 1.75; margin-bottom: 6px; }
        .prose strong { color: var(--ink); font-weight: 600; }
        .prose a { color: var(--red); text-decoration: none; border-bottom: 1px solid var(--red-border); }
        .prose a:hover { opacity: 0.8; }
        .prose code { font-family: 'Geist Mono', monospace; font-size: 13px; background: var(--paper-3); padding: 2px 6px; border-radius: 4px; color: var(--ink); }
        .prose blockquote { border-left: 3px solid var(--red); padding: 12px 18px; background: var(--red-dim); border-radius: 0 8px 8px 0; margin: 24px 0; }
        .prose blockquote p { color: var(--red); margin-bottom: 0; font-weight: 500; }
        .checklist { background: var(--paper); border: 1px solid var(--border); border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
        .checklist h4 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-4); margin-bottom: 12px; }
        .checklist li { list-style: none; margin-left: 0; padding: 4px 0; display: flex; gap: 8px; align-items: flex-start; }
        .checklist li::before { content: "□"; color: var(--ink-4); flex-shrink: 0; font-size: 14px; }
      `}</style>

      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={13} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>burned<span style={{ color: "var(--red)" }}>inbox</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/blog" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}><ArrowLeft size={13} /> All posts</Link>
          <Link href="/test" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--red)", padding: "7px 14px", borderRadius: 8, textDecoration: "none" }}>
            Test my inbox
          </Link>
        </div>
      </nav>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 4, color: "var(--red)", background: "var(--red-dim)" }}>{post.category}</span>
            <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {post.readTime} min read</span>
          </div>
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.3px", marginBottom: 16 }}>{post.title}</h1>
          <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7 }}>{post.excerpt}</p>
        </div>

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />

        <div style={{ marginTop: 48, padding: "24px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12, borderLeft: "3px solid var(--red)" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Run the checks first</p>
          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 16 }}>
            Before replacing anything, run a free inbox placement test. You might find the issue is DNS, not the domain — and save yourself a week of unnecessary work.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/test" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--red)", padding: "9px 18px", borderRadius: 8, textDecoration: "none" }}>
              Free inbox placement test <ArrowRight size={13} />
            </Link>
            <Link href="/tools/burn-score" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--ink-3)", background: "var(--paper-2)", border: "1px solid var(--border)", padding: "9px 18px", borderRadius: 8, textDecoration: "none" }}>
              Check burn score
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)", marginBottom: 16 }}>More guides</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {related.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 9, textDecoration: "none" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{p.title}</span>
                  <ArrowRight size={13} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

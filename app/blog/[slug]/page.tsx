import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame, ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { allPosts } from "../all-posts";

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://burnedinbox.com/blog/${post.slug}`,
      siteName: "Burned Inbox",
      type: "article",
      locale: "en_US",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/twitter-image"],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = allPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  const url = `https://burnedinbox.com/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        articleSection: post.category,
        inLanguage: "en-US",
        url,
        ...(post.updated ? { dateModified: post.updated } : {}),
        image: "https://burnedinbox.com/opengraph-image",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Organization", name: "BurnedInbox", url: "https://burnedinbox.com" },
        publisher: {
          "@type": "Organization",
          "@id": "https://burnedinbox.com/#org",
          name: "BurnedInbox",
          url: "https://burnedinbox.com",
          logo: { "@type": "ImageObject", url: "https://burnedinbox.com/icon.png" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://burnedinbox.com" },
          { "@type": "ListItem", position: 2, name: "Guides", item: "https://burnedinbox.com/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
            {post.updated && (
              <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
                Updated <time dateTime={post.updated}>{new Date(post.updated + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time>
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3.2vw, 2.125rem)", color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 16 }}>{post.title}</h1>
          <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7 }}>{post.excerpt}</p>
        </div>

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />

        <p style={{ marginTop: 32, fontSize: 13, color: "var(--ink-4)", lineHeight: 1.65 }}>
          Timelines, volumes and thresholds in this guide are typical ranges seen in practice, not provider rules or guarantees. Mailbox providers don&apos;t publish their filtering decisions; results depend on your list, content and sending history.
        </p>

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

import Link from "next/link";
import { Flame, ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { type Guide, GUIDES, GUIDE_PUBLISHED } from "@/lib/guides";

const BASE = "https://burnedinbox.com";

const PRIMARY_CTA: Record<string, { href: string; label: string }> = {
  "/burned-domain-checker":    { href: "/tools/burn-score",  label: "Calculate your burn score" },
  "/email-blacklist-checker":  { href: "/tools/blacklist",   label: "Run a free blacklist scan" },
  "/domain-reputation-checker":{ href: "/tools/blacklist",   label: "Check public blocklists" },
};

const PUBLISHED_LABEL = new Date(GUIDE_PUBLISHED + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function guideJsonLd(g: Guide) {
  const url = BASE + g.path;
  const parent = g.kind === "error"
    ? { name: "Email error library", item: `${BASE}/errors` }
    : { name: "Guides", item: `${BASE}/blog` };
  const graph: object[] = [
    {
      "@type": "Article",
      headline: g.title,
      description: g.description,
      url,
      inLanguage: "en-US",
      datePublished: GUIDE_PUBLISHED,
      dateModified: GUIDE_PUBLISHED,
      image: `${BASE}/opengraph-image`,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: "BurnedInbox", url: BASE },
      publisher: { "@type": "Organization", "@id": `${BASE}/#org`, name: "BurnedInbox", url: BASE, logo: { "@type": "ImageObject", url: `${BASE}/icon.png` } },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, ...parent },
        { "@type": "ListItem", position: 3, name: g.title, item: url },
      ],
    },
  ];
  if (g.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: g.faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export default function GuideArticle({ guide: g }: { guide: Guide }) {
  const cta = PRIMARY_CTA[g.path] ?? { href: "/test", label: "Run the free placement test" };
  const crumb = g.kind === "error" ? { href: "/errors", label: "Error library" } : { href: "/blog", label: "Guides" };
  const related = GUIDES.filter(x => x.kind === g.kind && x.path !== g.path && !x.path.startsWith("/blog/")).slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(g)) }} />

      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={13} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>burned<span style={{ color: "var(--red)" }}>inbox</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href={crumb.href} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}><ArrowLeft size={13} /> {crumb.label}</Link>
          <Link href="/test" style={{ display: "inline-flex", alignItems: "center", fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--red)", padding: "7px 14px", borderRadius: 8, textDecoration: "none" }}>Test my inbox</Link>
        </div>
      </nav>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 18 }}>
          <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
          {" / "}
          <Link href={crumb.href} style={{ color: "var(--ink-4)", textDecoration: "none" }}>{crumb.label}</Link>
        </p>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3.4vw, 2.25rem)", lineHeight: 1.15, color: "var(--ink)", marginBottom: 14 }}>{g.title}</h1>
        <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 14 }}>{g.description}</p>
        <p style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
          By the BurnedInbox team · Published <time dateTime={GUIDE_PUBLISHED}>{PUBLISHED_LABEL}</time> · <Clock size={11} /> {g.readTime} min read
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", padding: "16px 20px", background: "var(--paper)", border: "1px solid var(--border)", borderLeft: "3px solid var(--red)", borderRadius: 10, marginBottom: 32 }}>
          <span style={{ fontSize: 14, color: "var(--ink-2)", fontWeight: 500 }}>Check your own setup while you read.</span>
          <Link href={cta.href} data-cta="guide-top" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--ink)", padding: "9px 16px", borderRadius: 8, textDecoration: "none" }}>
            {cta.label} <ArrowRight size={13} />
          </Link>
        </div>

        <div className="prose" dangerouslySetInnerHTML={{ __html: g.html }} />

        <aside style={{ marginTop: 36, padding: "16px 20px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65 }}>
          <strong style={{ color: "var(--ink)" }}>About this guide.</strong> BurnedInbox is free and built by the team behind{" "}
          <a href="https://warminboxes.com" target="_blank" rel="noopener" style={{ color: "var(--ink)" }}>WarmInboxes</a>, which sells pre-warmed inboxes. We link to it where replacement infrastructure is a reasonable fix, and never as a substitute for fixing the cause. Mailbox providers don&apos;t publish their filtering rules, so treat any timeline here as a typical range, not a guarantee.
        </aside>

        {related.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)", marginBottom: 14 }}>
              {g.kind === "error" ? "More error guides" : "Related guides"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {related.map(r => (
                <Link key={r.path} href={r.path} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 9, textDecoration: "none" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{r.title}</span>
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

export function guideMetadata(g: Guide) {
  return {
    title: g.title,
    description: g.description,
    keywords: g.keyword,
    alternates: { canonical: g.path },
    openGraph: { title: g.title, description: g.description, url: BASE + g.path, siteName: "Burned Inbox", type: "article", locale: "en_US", images: ["/opengraph-image"], publishedTime: GUIDE_PUBLISHED },
    twitter: { card: "summary_large_image", title: g.title, description: g.description, images: ["/twitter-image"] },
  };
}

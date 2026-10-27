import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DMARC Record Checker & Policy Analyzer",
  description: "Look up any domain's DMARC record, parse every tag (p, sp, pct, rua, adkim, aspf) and get a 0-100 policy strength score with upgrade recommendations.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/dmarc" },
  openGraph: {
    title: "Free DMARC Record Checker & Policy Analyzer",
    description: "Look up any domain's DMARC record, parse every tag (p, sp, pct, rua, adkim, aspf) and get a 0-100 policy strength score with upgrade recommendations.",
    url: "https://burnedinbox.com/tools/dmarc",
    siteName: "Burned Inbox",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Free DMARC Record Checker & Policy Analyzer",
      "description": "Look up any domain's DMARC record, parse every tag (p, sp, pct, rua, adkim, aspf) and get a 0-100 policy strength score with upgrade recommendations.",
      "url": "https://burnedinbox.com/tools/dmarc",
      "relatedLink": "https://warminboxes.com/dmarc-checker",
      "publisher": {
        "@type": "Organization",
        "name": "BurnedInbox",
        "url": "https://burnedinbox.com"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://burnedinbox.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Free DMARC Record Checker & Policy Analyzer",
          "item": "https://burnedinbox.com/tools/dmarc"
        }
      ]
    }
  ]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Header Analyzer",
  description: "Paste raw email headers to trace routing hops and read SPF, DKIM and DMARC authentication results in plain English.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/header-parser" },
  openGraph: {
    title: "Free Email Header Analyzer",
    description: "Paste raw email headers to trace routing hops and read SPF, DKIM and DMARC authentication results in plain English.",
    url: "https://burnedinbox.com/tools/header-parser",
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
      "name": "Free Email Header Analyzer",
      "description": "Paste raw email headers to trace routing hops and read SPF, DKIM and DMARC authentication results in plain English.",
      "url": "https://burnedinbox.com/tools/header-parser",
      "relatedLink": "https://warminboxes.com/header-analyzer",
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
          "name": "Free Email Header Analyzer",
          "item": "https://burnedinbox.com/tools/header-parser"
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

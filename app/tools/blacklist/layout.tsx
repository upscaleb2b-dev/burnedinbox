import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Blacklist Checker — 16 RBLs",
  description: "Check any domain or IP against 16 blacklists including Spamhaus, SURBL, Barracuda and SpamCop. Severity-ranked results with delisting guidance.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/blacklist" },
  openGraph: {
    title: "Free Email Blacklist Checker — 16 RBLs",
    description: "Check any domain or IP against 16 blacklists including Spamhaus, SURBL, Barracuda and SpamCop. Severity-ranked results with delisting guidance.",
    url: "https://burnedinbox.com/tools/blacklist",
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
      "name": "Free Email Blacklist Checker \u2014 16 RBLs",
      "description": "Check any domain or IP against 16 blacklists including Spamhaus, SURBL, Barracuda and SpamCop. Severity-ranked results with delisting guidance.",
      "url": "https://burnedinbox.com/tools/blacklist",
      "relatedLink": "https://warminboxes.com/blacklist-checker",
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
          "name": "Free Email Blacklist Checker \u2014 16 RBLs",
          "item": "https://burnedinbox.com/tools/blacklist"
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Blacklist Checker — 16 RBLs",
  description: "Check any domain or IP against 16 blacklists including Spamhaus, SURBL, Barracuda and SpamCop. Severity-ranked results with delisting guidance.",
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
      "@type": "WebApplication",
      "name": "Free Email Blacklist Checker \u2014 16 RBLs",
      "description": "Check any domain or IP against 16 blacklists including Spamhaus, SURBL, Barracuda and SpamCop. Severity-ranked results with delisting guidance.",
      "url": "https://burnedinbox.com/tools/blacklist",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Count Calculator for Cold Email",
  description: "Size your multi-domain sending strategy: how many domains you need for your volume, with safe inbox-per-domain ratios.",
  alternates: { canonical: "/tools/domain-count" },
  openGraph: {
    title: "Domain Count Calculator for Cold Email",
    description: "Size your multi-domain sending strategy: how many domains you need for your volume, with safe inbox-per-domain ratios.",
    url: "https://burnedinbox.com/tools/domain-count",
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
      "name": "Domain Count Calculator for Cold Email",
      "description": "Size your multi-domain sending strategy: how many domains you need for your volume, with safe inbox-per-domain ratios.",
      "url": "https://burnedinbox.com/tools/domain-count",
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
          "name": "Domain Count Calculator for Cold Email",
          "item": "https://burnedinbox.com/tools/domain-count"
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

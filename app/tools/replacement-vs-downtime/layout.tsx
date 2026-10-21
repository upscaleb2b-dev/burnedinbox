import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replacement Cost vs Downtime Calculator",
  description: "Compare the cost of pre-warmed replacement infrastructure against the revenue lost while burned domains recover.",
  alternates: { canonical: "/tools/replacement-vs-downtime" },
  openGraph: {
    title: "Replacement Cost vs Downtime Calculator",
    description: "Compare the cost of pre-warmed replacement infrastructure against the revenue lost while burned domains recover.",
    url: "https://burnedinbox.com/tools/replacement-vs-downtime",
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
      "name": "Replacement Cost vs Downtime Calculator",
      "description": "Compare the cost of pre-warmed replacement infrastructure against the revenue lost while burned domains recover.",
      "url": "https://burnedinbox.com/tools/replacement-vs-downtime",
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
          "name": "Replacement Cost vs Downtime Calculator",
          "item": "https://burnedinbox.com/tools/replacement-vs-downtime"
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

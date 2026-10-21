import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Burn Score Calculator — Domain Health Check",
  description: "Score your sending domain's health from volume, bounces, engagement and infrastructure signals. Know if you're burning before placement collapses.",
  alternates: { canonical: "/tools/burn-score" },
  openGraph: {
    title: "Burn Score Calculator — Domain Health Check",
    description: "Score your sending domain's health from volume, bounces, engagement and infrastructure signals. Know if you're burning before placement collapses.",
    url: "https://burnedinbox.com/tools/burn-score",
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
      "name": "Burn Score Calculator \u2014 Domain Health Check",
      "description": "Score your sending domain's health from volume, bounces, engagement and infrastructure signals. Know if you're burning before placement collapses.",
      "url": "https://burnedinbox.com/tools/burn-score",
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
          "name": "Burn Score Calculator \u2014 Domain Health Check",
          "item": "https://burnedinbox.com/tools/burn-score"
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

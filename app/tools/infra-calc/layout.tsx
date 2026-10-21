import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cold Email Infrastructure Calculator",
  description: "Model your full sending stack: domains, inboxes, warmup pipeline, budget and safe capacity in one calculator.",
  alternates: { canonical: "/tools/infra-calc" },
  openGraph: {
    title: "Cold Email Infrastructure Calculator",
    description: "Model your full sending stack: domains, inboxes, warmup pipeline, budget and safe capacity in one calculator.",
    url: "https://burnedinbox.com/tools/infra-calc",
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
      "name": "Cold Email Infrastructure Calculator",
      "description": "Model your full sending stack: domains, inboxes, warmup pipeline, budget and safe capacity in one calculator.",
      "url": "https://burnedinbox.com/tools/infra-calc",
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
          "name": "Cold Email Infrastructure Calculator",
          "item": "https://burnedinbox.com/tools/infra-calc"
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

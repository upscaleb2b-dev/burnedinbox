import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Burned Inbox Cost Calculator",
  description: "Calculate the true cost of burned sending infrastructure: replacement, downtime, pipeline loss and client churn risk.",
  alternates: { canonical: "/tools/burn-cost" },
  openGraph: {
    title: "Burned Inbox Cost Calculator",
    description: "Calculate the true cost of burned sending infrastructure: replacement, downtime, pipeline loss and client churn risk.",
    url: "https://burnedinbox.com/tools/burn-cost",
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
      "name": "Burned Inbox Cost Calculator",
      "description": "Calculate the true cost of burned sending infrastructure: replacement, downtime, pipeline loss and client churn risk.",
      "url": "https://burnedinbox.com/tools/burn-cost",
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
          "name": "Burned Inbox Cost Calculator",
          "item": "https://burnedinbox.com/tools/burn-cost"
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cold Email Pre-Launch Checklist",
  description: "Interactive checklist covering DNS, authentication, warmup, list quality and volume settings — everything to verify before your first send.",
  alternates: { canonical: "/tools/launch-checklist" },
  openGraph: {
    title: "Cold Email Pre-Launch Checklist",
    description: "Interactive checklist covering DNS, authentication, warmup, list quality and volume settings — everything to verify before your first send.",
    url: "https://burnedinbox.com/tools/launch-checklist",
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
      "name": "Cold Email Pre-Launch Checklist",
      "description": "Interactive checklist covering DNS, authentication, warmup, list quality and volume settings \u2014 everything to verify before your first send.",
      "url": "https://burnedinbox.com/tools/launch-checklist",
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
          "name": "Cold Email Pre-Launch Checklist",
          "item": "https://burnedinbox.com/tools/launch-checklist"
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

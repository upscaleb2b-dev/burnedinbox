import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cold Email Emergency Calculator",
  description: "Infrastructure burned mid-campaign? Calculate downtime cost, recovery timelines and replacement options in one place.",
  alternates: { canonical: "/tools/emergency" },
  openGraph: {
    title: "Cold Email Emergency Calculator",
    description: "Infrastructure burned mid-campaign? Calculate downtime cost, recovery timelines and replacement options in one place.",
    url: "https://burnedinbox.com/tools/emergency",
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
      "name": "Cold Email Emergency Calculator",
      "description": "Infrastructure burned mid-campaign? Calculate downtime cost, recovery timelines and replacement options in one place.",
      "url": "https://burnedinbox.com/tools/emergency",
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
          "name": "Cold Email Emergency Calculator",
          "item": "https://burnedinbox.com/tools/emergency"
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

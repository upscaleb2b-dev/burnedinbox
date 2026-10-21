import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repair or Replace Calculator for Burned Domains",
  description: "Data-driven answer to cold email's hardest call: rehabilitate a damaged domain or replace it with fresh infrastructure.",
  alternates: { canonical: "/tools/repair-or-replace" },
  openGraph: {
    title: "Repair or Replace Calculator for Burned Domains",
    description: "Data-driven answer to cold email's hardest call: rehabilitate a damaged domain or replace it with fresh infrastructure.",
    url: "https://burnedinbox.com/tools/repair-or-replace",
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
      "name": "Repair or Replace Calculator for Burned Domains",
      "description": "Data-driven answer to cold email's hardest call: rehabilitate a damaged domain or replace it with fresh infrastructure.",
      "url": "https://burnedinbox.com/tools/repair-or-replace",
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
          "name": "Repair or Replace Calculator for Burned Domains",
          "item": "https://burnedinbox.com/tools/repair-or-replace"
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

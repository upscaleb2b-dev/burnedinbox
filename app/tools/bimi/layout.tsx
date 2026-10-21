import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free BIMI Record Checker — Logo & VMC Validation",
  description: "Check your BIMI record, verify your SVG logo URL and VMC certificate are reachable, and confirm the DMARC p=reject requirement for Gmail logo display.",
  alternates: { canonical: "/tools/bimi" },
  openGraph: {
    title: "Free BIMI Record Checker — Logo & VMC Validation",
    description: "Check your BIMI record, verify your SVG logo URL and VMC certificate are reachable, and confirm the DMARC p=reject requirement for Gmail logo display.",
    url: "https://burnedinbox.com/tools/bimi",
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
      "name": "Free BIMI Record Checker \u2014 Logo & VMC Validation",
      "description": "Check your BIMI record, verify your SVG logo URL and VMC certificate are reachable, and confirm the DMARC p=reject requirement for Gmail logo display.",
      "url": "https://burnedinbox.com/tools/bimi",
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
          "name": "Free BIMI Record Checker \u2014 Logo & VMC Validation",
          "item": "https://burnedinbox.com/tools/bimi"
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

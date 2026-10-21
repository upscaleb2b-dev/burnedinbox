import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Inbox Placement Test & Warm Score",
  description: "Run an all-inclusive email deliverability test: real SPF, DKIM, DMARC and blacklist checks plus inbox placement testing across Gmail, Outlook, Yahoo and iCloud.",
  alternates: { canonical: "/test" },
  openGraph: {
    title: "Free Inbox Placement Test & Warm Score",
    description: "Run an all-inclusive email deliverability test: real SPF, DKIM, DMARC and blacklist checks plus inbox placement testing across Gmail, Outlook, Yahoo and iCloud.",
    url: "https://burnedinbox.com/test",
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
      "name": "Free Inbox Placement Test & Warm Score",
      "description": "Run an all-inclusive email deliverability test: real SPF, DKIM, DMARC and blacklist checks plus inbox placement testing across Gmail, Outlook, Yahoo and iCloud.",
      "url": "https://burnedinbox.com/test",
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
          "name": "Free Inbox Placement Test & Warm Score",
          "item": "https://burnedinbox.com/test"
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

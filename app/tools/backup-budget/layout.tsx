import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backup Inbox Budget Calculator",
  description: "Price a standby inbox pool against the cost of campaign downtime. See what the right backup capacity costs for your volume.",
  alternates: { canonical: "/tools/backup-budget" },
  openGraph: {
    title: "Backup Inbox Budget Calculator",
    description: "Price a standby inbox pool against the cost of campaign downtime. See what the right backup capacity costs for your volume.",
    url: "https://burnedinbox.com/tools/backup-budget",
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
      "name": "Backup Inbox Budget Calculator",
      "description": "Price a standby inbox pool against the cost of campaign downtime. See what the right backup capacity costs for your volume.",
      "url": "https://burnedinbox.com/tools/backup-budget",
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
          "name": "Backup Inbox Budget Calculator",
          "item": "https://burnedinbox.com/tools/backup-budget"
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

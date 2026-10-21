import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox Count Calculator for Cold Email",
  description: "Work out how many sending inboxes you need — active, backup and warming — for your monthly outreach targets.",
  alternates: { canonical: "/tools/inbox-count" },
  openGraph: {
    title: "Inbox Count Calculator for Cold Email",
    description: "Work out how many sending inboxes you need — active, backup and warming — for your monthly outreach targets.",
    url: "https://burnedinbox.com/tools/inbox-count",
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
      "name": "Inbox Count Calculator for Cold Email",
      "description": "Work out how many sending inboxes you need \u2014 active, backup and warming \u2014 for your monthly outreach targets.",
      "url": "https://burnedinbox.com/tools/inbox-count",
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
          "name": "Inbox Count Calculator for Cold Email",
          "item": "https://burnedinbox.com/tools/inbox-count"
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

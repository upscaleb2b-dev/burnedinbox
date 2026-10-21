import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safe Send Limits Calculator by Provider",
  description: "Get safe daily sending caps per inbox for Google Workspace and Microsoft 365, with ramp schedules that protect your domains.",
  alternates: { canonical: "/tools/send-limits" },
  openGraph: {
    title: "Safe Send Limits Calculator by Provider",
    description: "Get safe daily sending caps per inbox for Google Workspace and Microsoft 365, with ramp schedules that protect your domains.",
    url: "https://burnedinbox.com/tools/send-limits",
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
      "name": "Safe Send Limits Calculator by Provider",
      "description": "Get safe daily sending caps per inbox for Google Workspace and Microsoft 365, with ramp schedules that protect your domains.",
      "url": "https://burnedinbox.com/tools/send-limits",
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
          "name": "Safe Send Limits Calculator by Provider",
          "item": "https://burnedinbox.com/tools/send-limits"
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

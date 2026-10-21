import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sending Capacity Calculator",
  description: "Calculate how many leads per month your cold email infrastructure can actually reach at safe sending limits.",
  alternates: { canonical: "/tools/sending-capacity" },
  openGraph: {
    title: "Sending Capacity Calculator",
    description: "Calculate how many leads per month your cold email infrastructure can actually reach at safe sending limits.",
    url: "https://burnedinbox.com/tools/sending-capacity",
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
      "name": "Sending Capacity Calculator",
      "description": "Calculate how many leads per month your cold email infrastructure can actually reach at safe sending limits.",
      "url": "https://burnedinbox.com/tools/sending-capacity",
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
          "name": "Sending Capacity Calculator",
          "item": "https://burnedinbox.com/tools/sending-capacity"
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

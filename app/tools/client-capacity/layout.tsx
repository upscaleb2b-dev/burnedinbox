import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency Client Capacity Calculator",
  description: "Model how many cold email clients your agency's infrastructure can support before deliverability risk stacks up.",
  alternates: { canonical: "/tools/client-capacity" },
  openGraph: {
    title: "Agency Client Capacity Calculator",
    description: "Model how many cold email clients your agency's infrastructure can support before deliverability risk stacks up.",
    url: "https://burnedinbox.com/tools/client-capacity",
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
      "name": "Agency Client Capacity Calculator",
      "description": "Model how many cold email clients your agency's infrastructure can support before deliverability risk stacks up.",
      "url": "https://burnedinbox.com/tools/client-capacity",
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
          "name": "Agency Client Capacity Calculator",
          "item": "https://burnedinbox.com/tools/client-capacity"
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

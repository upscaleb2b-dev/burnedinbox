import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warmup Time-Saved Calculator",
  description: "Compare DIY inbox warmup against pre-warmed inboxes: weeks saved, launch dates and the break-even price for your volume.",
  alternates: { canonical: "/tools/warmup-time-saved" },
  openGraph: {
    title: "Warmup Time-Saved Calculator",
    description: "Compare DIY inbox warmup against pre-warmed inboxes: weeks saved, launch dates and the break-even price for your volume.",
    url: "https://burnedinbox.com/tools/warmup-time-saved",
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
      "name": "Warmup Time-Saved Calculator",
      "description": "Compare DIY inbox warmup against pre-warmed inboxes: weeks saved, launch dates and the break-even price for your volume.",
      "url": "https://burnedinbox.com/tools/warmup-time-saved",
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
          "name": "Warmup Time-Saved Calculator",
          "item": "https://burnedinbox.com/tools/warmup-time-saved"
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

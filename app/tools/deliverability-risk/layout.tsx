import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deliverability Risk Score Calculator",
  description: "Model your cold email setup across 8 risk factors and get a prioritized list of what to fix before launching.",
  alternates: { canonical: "/tools/deliverability-risk" },
  openGraph: {
    title: "Deliverability Risk Score Calculator",
    description: "Model your cold email setup across 8 risk factors and get a prioritized list of what to fix before launching.",
    url: "https://burnedinbox.com/tools/deliverability-risk",
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
      "name": "Deliverability Risk Score Calculator",
      "description": "Model your cold email setup across 8 risk factors and get a prioritized list of what to fix before launching.",
      "url": "https://burnedinbox.com/tools/deliverability-risk",
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
          "name": "Deliverability Risk Score Calculator",
          "item": "https://burnedinbox.com/tools/deliverability-risk"
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

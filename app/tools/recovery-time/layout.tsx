import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Recovery Time Estimator",
  description: "Estimate how long your burned domain needs to recover based on damage severity, blacklist status and sending history.",
  alternates: { canonical: "/tools/recovery-time" },
  openGraph: {
    title: "Domain Recovery Time Estimator",
    description: "Estimate how long your burned domain needs to recover based on damage severity, blacklist status and sending history.",
    url: "https://burnedinbox.com/tools/recovery-time",
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
      "name": "Domain Recovery Time Estimator",
      "description": "Estimate how long your burned domain needs to recover based on damage severity, blacklist status and sending history.",
      "url": "https://burnedinbox.com/tools/recovery-time",
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
          "name": "Domain Recovery Time Estimator",
          "item": "https://burnedinbox.com/tools/recovery-time"
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free MTA-STS Checker — TLS Policy Validation",
  description: "Validate your MTA-STS DNS record, fetch and parse the policy file, and check TLS-RPT reporting. Includes a full setup guide for enforce mode.",
  alternates: { canonical: "/tools/mta-sts" },
  openGraph: {
    title: "Free MTA-STS Checker — TLS Policy Validation",
    description: "Validate your MTA-STS DNS record, fetch and parse the policy file, and check TLS-RPT reporting. Includes a full setup guide for enforce mode.",
    url: "https://burnedinbox.com/tools/mta-sts",
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
      "name": "Free MTA-STS Checker \u2014 TLS Policy Validation",
      "description": "Validate your MTA-STS DNS record, fetch and parse the policy file, and check TLS-RPT reporting. Includes a full setup guide for enforce mode.",
      "url": "https://burnedinbox.com/tools/mta-sts",
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
          "name": "Free MTA-STS Checker \u2014 TLS Policy Validation",
          "item": "https://burnedinbox.com/tools/mta-sts"
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

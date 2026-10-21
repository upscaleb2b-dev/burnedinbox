import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free SPF Record Checker & Generator",
  description: "Look up and validate any domain's SPF record, or build a correct one with includes for Google, Microsoft 365, SendGrid and more. Instant grading with fixes.",
  alternates: { canonical: "/tools/spf" },
  openGraph: {
    title: "Free SPF Record Checker & Generator",
    description: "Look up and validate any domain's SPF record, or build a correct one with includes for Google, Microsoft 365, SendGrid and more. Instant grading with fixes.",
    url: "https://burnedinbox.com/tools/spf",
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
      "name": "Free SPF Record Checker & Generator",
      "description": "Look up and validate any domain's SPF record, or build a correct one with includes for Google, Microsoft 365, SendGrid and more. Instant grading with fixes.",
      "url": "https://burnedinbox.com/tools/spf",
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
          "name": "Free SPF Record Checker & Generator",
          "item": "https://burnedinbox.com/tools/spf"
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

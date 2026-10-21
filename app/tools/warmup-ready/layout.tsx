import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warmup Readiness Checker for Cold Email",
  description: "Answer a short questionnaire to find out if your inboxes are actually ready for campaign volume — or headed for the spam folder.",
  alternates: { canonical: "/tools/warmup-ready" },
  openGraph: {
    title: "Warmup Readiness Checker for Cold Email",
    description: "Answer a short questionnaire to find out if your inboxes are actually ready for campaign volume — or headed for the spam folder.",
    url: "https://burnedinbox.com/tools/warmup-ready",
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
      "name": "Warmup Readiness Checker for Cold Email",
      "description": "Answer a short questionnaire to find out if your inboxes are actually ready for campaign volume \u2014 or headed for the spam folder.",
      "url": "https://burnedinbox.com/tools/warmup-ready",
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
          "name": "Warmup Readiness Checker for Cold Email",
          "item": "https://burnedinbox.com/tools/warmup-ready"
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

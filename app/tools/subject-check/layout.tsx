import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Subject Line Spam Tester",
  description: "Test email subject lines for spam trigger words, fake Re:/Fwd: prefixes, promotional language and length issues before you send.",
  alternates: { canonical: "/tools/subject-check" },
  openGraph: {
    title: "Free Subject Line Spam Tester",
    description: "Test email subject lines for spam trigger words, fake Re:/Fwd: prefixes, promotional language and length issues before you send.",
    url: "https://burnedinbox.com/tools/subject-check",
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
      "name": "Free Subject Line Spam Tester",
      "description": "Test email subject lines for spam trigger words, fake Re:/Fwd: prefixes, promotional language and length issues before you send.",
      "url": "https://burnedinbox.com/tools/subject-check",
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
          "name": "Free Subject Line Spam Tester",
          "item": "https://burnedinbox.com/tools/subject-check"
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

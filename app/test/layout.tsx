import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Authentication & Blacklist Check",
  description: "Check your cold email domain free: live SPF, DKIM, DMARC and domain blacklist checks with a 0–100 health score, plus how to check placement in your own inbox.",
  alternates: { canonical: "/test" },
  openGraph: {
    title: "Free Email Authentication & Blacklist Check",
    description: "Check your cold email domain free: live SPF, DKIM, DMARC and domain blacklist checks with a 0–100 health score, plus how to check placement in your own inbox.",
    url: "https://burnedinbox.com/test",
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
      "name": "Free Email Authentication & Blacklist Check",
      "description": "Check your cold email domain free: live SPF, DKIM, DMARC and domain blacklist checks with a 0–100 health score, plus how to check placement in your own inbox.",
      "url": "https://burnedinbox.com/test",
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
          "name": "Free Email Authentication & Blacklist Check",
          "item": "https://burnedinbox.com/test"
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

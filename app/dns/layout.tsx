import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DNS Checker — All Record Types",
  description: "Look up A, AAAA, MX, TXT, CNAME, NS, SOA, SRV, PTR and CAA records for any domain with TTL details. Free instant DNS lookup tool.",
  alternates: { canonical: "/dns" },
  openGraph: {
    title: "Free DNS Checker — All Record Types",
    description: "Look up A, AAAA, MX, TXT, CNAME, NS, SOA, SRV, PTR and CAA records for any domain with TTL details. Free instant DNS lookup tool.",
    url: "https://burnedinbox.com/dns",
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
      "name": "Free DNS Checker \u2014 All Record Types",
      "description": "Look up A, AAAA, MX, TXT, CNAME, NS, SOA, SRV, PTR and CAA records for any domain with TTL details. Free instant DNS lookup tool.",
      "url": "https://burnedinbox.com/dns",
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
          "name": "Free DNS Checker \u2014 All Record Types",
          "item": "https://burnedinbox.com/dns"
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

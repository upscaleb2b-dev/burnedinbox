import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Domain Expiry Checker — WHOIS Lookup",
  description: "Check when any domain expires, its registrar, nameservers and status codes. Catch expiring campaign domains before they lapse.",
  alternates: { canonical: "/tools/domain-expiry" },
  openGraph: {
    title: "Free Domain Expiry Checker — WHOIS Lookup",
    description: "Check when any domain expires, its registrar, nameservers and status codes. Catch expiring campaign domains before they lapse.",
    url: "https://burnedinbox.com/tools/domain-expiry",
    siteName: "Burned Inbox",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Free Domain Expiry Checker \u2014 WHOIS Lookup",
      "description": "Check when any domain expires, its registrar, nameservers and status codes. Catch expiring campaign domains before they lapse.",
      "url": "https://burnedinbox.com/tools/domain-expiry",
      "relatedLink": "https://warminboxes.com/domain-expiry-checker",
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
          "name": "Free Domain Expiry Checker \u2014 WHOIS Lookup",
          "item": "https://burnedinbox.com/tools/domain-expiry"
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

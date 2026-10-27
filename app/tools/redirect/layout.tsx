import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Redirect Checker — Root & WWW Variants",
  description: "Follow redirect chains for http/https and root/www variants of any domain. Detect long chains, missing HTTPS upgrades and parked pages.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/redirect" },
  openGraph: {
    title: "Free Redirect Checker — Root & WWW Variants",
    description: "Follow redirect chains for http/https and root/www variants of any domain. Detect long chains, missing HTTPS upgrades and parked pages.",
    url: "https://burnedinbox.com/tools/redirect",
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
      "name": "Free Redirect Checker \u2014 Root & WWW Variants",
      "description": "Follow redirect chains for http/https and root/www variants of any domain. Detect long chains, missing HTTPS upgrades and parked pages.",
      "url": "https://burnedinbox.com/tools/redirect",
      "relatedLink": "https://warminboxes.com/tracking-domain-checker",
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
          "name": "Free Redirect Checker \u2014 Root & WWW Variants",
          "item": "https://burnedinbox.com/tools/redirect"
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

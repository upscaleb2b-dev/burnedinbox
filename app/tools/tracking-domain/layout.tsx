import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tracking Domain Checker for Cold Email",
  description: "Validate your tracking domain: CNAME target detection, Cloudflare proxy warnings, SSL verification and domain isolation checks.",
  alternates: { canonical: "/tools/tracking-domain" },
  openGraph: {
    title: "Free Tracking Domain Checker for Cold Email",
    description: "Validate your tracking domain: CNAME target detection, Cloudflare proxy warnings, SSL verification and domain isolation checks.",
    url: "https://burnedinbox.com/tools/tracking-domain",
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
      "name": "Free Tracking Domain Checker for Cold Email",
      "description": "Validate your tracking domain: CNAME target detection, Cloudflare proxy warnings, SSL verification and domain isolation checks.",
      "url": "https://burnedinbox.com/tools/tracking-domain",
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
          "name": "Free Tracking Domain Checker for Cold Email",
          "item": "https://burnedinbox.com/tools/tracking-domain"
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

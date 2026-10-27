import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Reverse DNS / PTR Checker with FCrDNS",
  description: "Verify PTR records for any IP, run forward-confirmed rDNS (FCrDNS) validation, and detect generic ISP hostnames that hurt mail delivery.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/rdns" },
  openGraph: {
    title: "Free Reverse DNS / PTR Checker with FCrDNS",
    description: "Verify PTR records for any IP, run forward-confirmed rDNS (FCrDNS) validation, and detect generic ISP hostnames that hurt mail delivery.",
    url: "https://burnedinbox.com/tools/rdns",
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
      "name": "Free Reverse DNS / PTR Checker with FCrDNS",
      "description": "Verify PTR records for any IP, run forward-confirmed rDNS (FCrDNS) validation, and detect generic ISP hostnames that hurt mail delivery.",
      "url": "https://burnedinbox.com/tools/rdns",
      "relatedLink": "https://warminboxes.com/reverse-dns-lookup",
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
          "name": "Free Reverse DNS / PTR Checker with FCrDNS",
          "item": "https://burnedinbox.com/tools/rdns"
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

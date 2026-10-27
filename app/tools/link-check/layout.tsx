import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Link Checker — URL Reputation",
  description: "Extract and test every URL in your email: broken links, redirect chains, URL shorteners and excessive tracking parameters.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/link-check" },
  openGraph: {
    title: "Free Email Link Checker — URL Reputation",
    description: "Extract and test every URL in your email: broken links, redirect chains, URL shorteners and excessive tracking parameters.",
    url: "https://burnedinbox.com/tools/link-check",
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
      "name": "Free Email Link Checker \u2014 URL Reputation",
      "description": "Extract and test every URL in your email: broken links, redirect chains, URL shorteners and excessive tracking parameters.",
      "url": "https://burnedinbox.com/tools/link-check",
      "relatedLink": "https://warminboxes.com/email-link-scanner",
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
          "name": "Free Email Link Checker \u2014 URL Reputation",
          "item": "https://burnedinbox.com/tools/link-check"
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

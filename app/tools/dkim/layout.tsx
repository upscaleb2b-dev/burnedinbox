import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DKIM Record Checker — Auto-Discover Selectors",
  description: "Check DKIM records across 16+ common selectors, validate key type and length (1024 vs 2048-bit RSA), and detect revoked or test-mode keys.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/dkim" },
  openGraph: {
    title: "Free DKIM Record Checker — Auto-Discover Selectors",
    description: "Check DKIM records across 16+ common selectors, validate key type and length (1024 vs 2048-bit RSA), and detect revoked or test-mode keys.",
    url: "https://burnedinbox.com/tools/dkim",
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
      "name": "Free DKIM Record Checker \u2014 Auto-Discover Selectors",
      "description": "Check DKIM records across 16+ common selectors, validate key type and length (1024 vs 2048-bit RSA), and detect revoked or test-mode keys.",
      "url": "https://burnedinbox.com/tools/dkim",
      "relatedLink": "https://warminboxes.com/dkim-checker",
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
          "name": "Free DKIM Record Checker \u2014 Auto-Discover Selectors",
          "item": "https://burnedinbox.com/tools/dkim"
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

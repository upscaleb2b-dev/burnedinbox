import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free MX Record Checker & Mail Provider Lookup",
  description: "Look up MX records, detect the mail provider, verify server connectivity and reverse DNS, and catch priority misconfigurations.",
  alternates: { canonical: "/tools/mx" },
  openGraph: {
    title: "Free MX Record Checker & Mail Provider Lookup",
    description: "Look up MX records, detect the mail provider, verify server connectivity and reverse DNS, and catch priority misconfigurations.",
    url: "https://burnedinbox.com/tools/mx",
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
      "name": "Free MX Record Checker & Mail Provider Lookup",
      "description": "Look up MX records, detect the mail provider, verify server connectivity and reverse DNS, and catch priority misconfigurations.",
      "url": "https://burnedinbox.com/tools/mx",
      "relatedLink": "https://warminboxes.com/mx-lookup",
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
          "name": "Free MX Record Checker & Mail Provider Lookup",
          "item": "https://burnedinbox.com/tools/mx"
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

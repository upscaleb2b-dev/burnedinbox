import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Subject Line Spam Tester",
  description: "Test email subject lines for spam trigger words, fake Re:/Fwd: prefixes, promotional language and length issues before you send.",
  robots: { index: false, follow: true },
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
      "@type": "WebPage",
      "name": "Free Subject Line Spam Tester",
      "description": "Test email subject lines for spam trigger words, fake Re:/Fwd: prefixes, promotional language and length issues before you send.",
      "url": "https://burnedinbox.com/tools/subject-check",
      "relatedLink": "https://warminboxes.com/spam-checker",
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

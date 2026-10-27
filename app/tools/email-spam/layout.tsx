import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Spam Test — Content & Subject Analyzer",
  description: "Paste your email and get a deliverability score: spam trigger words, caps ratio, link density, image balance and subject line issues with fixes.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/email-spam" },
  openGraph: {
    title: "Free Email Spam Test — Content & Subject Analyzer",
    description: "Paste your email and get a deliverability score: spam trigger words, caps ratio, link density, image balance and subject line issues with fixes.",
    url: "https://burnedinbox.com/tools/email-spam",
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
      "name": "Free Email Spam Test \u2014 Content & Subject Analyzer",
      "description": "Paste your email and get a deliverability score: spam trigger words, caps ratio, link density, image balance and subject line issues with fixes.",
      "url": "https://burnedinbox.com/tools/email-spam",
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
          "name": "Free Email Spam Test \u2014 Content & Subject Analyzer",
          "item": "https://burnedinbox.com/tools/email-spam"
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Inbox Placement Test & Warm Score",
  description: "Run an all-inclusive email deliverability test: real SPF, DKIM, DMARC and blacklist checks plus inbox placement testing across Gmail, Outlook, Yahoo and iCloud.",
  alternates: { canonical: "/test" },
  openGraph: {
    title: "Free Inbox Placement Test & Warm Score",
    description: "Run an all-inclusive email deliverability test: real SPF, DKIM, DMARC and blacklist checks plus inbox placement testing across Gmail, Outlook, Yahoo and iCloud.",
    url: "https://burnedinbox.com/test",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

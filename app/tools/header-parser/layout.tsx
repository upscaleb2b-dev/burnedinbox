import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Header Analyzer",
  description: "Paste raw email headers to trace routing hops and read SPF, DKIM and DMARC authentication results in plain English.",
  alternates: { canonical: "/tools/header-parser" },
  openGraph: {
    title: "Free Email Header Analyzer",
    description: "Paste raw email headers to trace routing hops and read SPF, DKIM and DMARC authentication results in plain English.",
    url: "https://burnedinbox.com/tools/header-parser",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

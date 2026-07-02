import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Count Calculator for Cold Email",
  description: "Size your multi-domain sending strategy: how many domains you need for your volume, with safe inbox-per-domain ratios.",
  alternates: { canonical: "/tools/domain-count" },
  openGraph: {
    title: "Domain Count Calculator for Cold Email",
    description: "Size your multi-domain sending strategy: how many domains you need for your volume, with safe inbox-per-domain ratios.",
    url: "https://burnedinbox.com/tools/domain-count",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

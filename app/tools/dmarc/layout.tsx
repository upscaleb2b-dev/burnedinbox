import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DMARC Record Checker & Policy Analyzer",
  description: "Look up any domain's DMARC record, parse every tag (p, sp, pct, rua, adkim, aspf) and get a 0-100 policy strength score with upgrade recommendations.",
  alternates: { canonical: "/tools/dmarc" },
  openGraph: {
    title: "Free DMARC Record Checker & Policy Analyzer",
    description: "Look up any domain's DMARC record, parse every tag (p, sp, pct, rua, adkim, aspf) and get a 0-100 policy strength score with upgrade recommendations.",
    url: "https://burnedinbox.com/tools/dmarc",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

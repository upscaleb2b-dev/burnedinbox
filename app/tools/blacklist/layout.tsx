import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Blacklist Checker — 16 RBLs",
  description: "Check any domain or IP against 16 blacklists including Spamhaus, SURBL, Barracuda and SpamCop. Severity-ranked results with delisting guidance.",
  alternates: { canonical: "/tools/blacklist" },
  openGraph: {
    title: "Free Email Blacklist Checker — 16 RBLs",
    description: "Check any domain or IP against 16 blacklists including Spamhaus, SURBL, Barracuda and SpamCop. Severity-ranked results with delisting guidance.",
    url: "https://burnedinbox.com/tools/blacklist",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

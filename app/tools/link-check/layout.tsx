import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Link Checker — URL Reputation",
  description: "Extract and test every URL in your email: broken links, redirect chains, URL shorteners and excessive tracking parameters.",
  alternates: { canonical: "/tools/link-check" },
  openGraph: {
    title: "Free Email Link Checker — URL Reputation",
    description: "Extract and test every URL in your email: broken links, redirect chains, URL shorteners and excessive tracking parameters.",
    url: "https://burnedinbox.com/tools/link-check",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

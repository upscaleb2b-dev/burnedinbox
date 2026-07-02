import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Redirect Checker — Root & WWW Variants",
  description: "Follow redirect chains for http/https and root/www variants of any domain. Detect long chains, missing HTTPS upgrades and parked pages.",
  alternates: { canonical: "/tools/redirect" },
  openGraph: {
    title: "Free Redirect Checker — Root & WWW Variants",
    description: "Follow redirect chains for http/https and root/www variants of any domain. Detect long chains, missing HTTPS upgrades and parked pages.",
    url: "https://burnedinbox.com/tools/redirect",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Domain Expiry Checker — WHOIS Lookup",
  description: "Check when any domain expires, its registrar, nameservers and status codes. Catch expiring campaign domains before they lapse.",
  alternates: { canonical: "/tools/domain-expiry" },
  openGraph: {
    title: "Free Domain Expiry Checker — WHOIS Lookup",
    description: "Check when any domain expires, its registrar, nameservers and status codes. Catch expiring campaign domains before they lapse.",
    url: "https://burnedinbox.com/tools/domain-expiry",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

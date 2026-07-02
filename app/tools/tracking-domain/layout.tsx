import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tracking Domain Checker for Cold Email",
  description: "Validate your tracking domain: CNAME target detection, Cloudflare proxy warnings, SSL verification and domain isolation checks.",
  alternates: { canonical: "/tools/tracking-domain" },
  openGraph: {
    title: "Free Tracking Domain Checker for Cold Email",
    description: "Validate your tracking domain: CNAME target detection, Cloudflare proxy warnings, SSL verification and domain isolation checks.",
    url: "https://burnedinbox.com/tools/tracking-domain",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

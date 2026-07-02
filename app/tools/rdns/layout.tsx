import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Reverse DNS / PTR Checker with FCrDNS",
  description: "Verify PTR records for any IP, run forward-confirmed rDNS (FCrDNS) validation, and detect generic ISP hostnames that hurt mail delivery.",
  alternates: { canonical: "/tools/rdns" },
  openGraph: {
    title: "Free Reverse DNS / PTR Checker with FCrDNS",
    description: "Verify PTR records for any IP, run forward-confirmed rDNS (FCrDNS) validation, and detect generic ISP hostnames that hurt mail delivery.",
    url: "https://burnedinbox.com/tools/rdns",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

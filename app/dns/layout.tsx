import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DNS Checker — All Record Types",
  description: "Look up A, AAAA, MX, TXT, CNAME, NS, SOA, SRV, PTR and CAA records for any domain with TTL details. Free instant DNS lookup tool.",
  alternates: { canonical: "/dns" },
  openGraph: {
    title: "Free DNS Checker — All Record Types",
    description: "Look up A, AAAA, MX, TXT, CNAME, NS, SOA, SRV, PTR and CAA records for any domain with TTL details. Free instant DNS lookup tool.",
    url: "https://burnedinbox.com/dns",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

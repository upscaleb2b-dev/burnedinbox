import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free MX Record Checker & Mail Provider Lookup",
  description: "Look up MX records, detect the mail provider, verify server connectivity and reverse DNS, and catch priority misconfigurations.",
  alternates: { canonical: "/tools/mx" },
  openGraph: {
    title: "Free MX Record Checker & Mail Provider Lookup",
    description: "Look up MX records, detect the mail provider, verify server connectivity and reverse DNS, and catch priority misconfigurations.",
    url: "https://burnedinbox.com/tools/mx",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

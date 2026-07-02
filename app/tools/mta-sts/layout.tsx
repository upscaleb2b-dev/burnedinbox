import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free MTA-STS Checker — TLS Policy Validation",
  description: "Validate your MTA-STS DNS record, fetch and parse the policy file, and check TLS-RPT reporting. Includes a full setup guide for enforce mode.",
  alternates: { canonical: "/tools/mta-sts" },
  openGraph: {
    title: "Free MTA-STS Checker — TLS Policy Validation",
    description: "Validate your MTA-STS DNS record, fetch and parse the policy file, and check TLS-RPT reporting. Includes a full setup guide for enforce mode.",
    url: "https://burnedinbox.com/tools/mta-sts",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

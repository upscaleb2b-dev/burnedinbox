import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backup Inbox Budget Calculator",
  description: "Price a standby inbox pool against the cost of campaign downtime. See what the right backup capacity costs for your volume.",
  alternates: { canonical: "/tools/backup-budget" },
  openGraph: {
    title: "Backup Inbox Budget Calculator",
    description: "Price a standby inbox pool against the cost of campaign downtime. See what the right backup capacity costs for your volume.",
    url: "https://burnedinbox.com/tools/backup-budget",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

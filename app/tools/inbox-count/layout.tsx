import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox Count Calculator for Cold Email",
  description: "Work out how many sending inboxes you need — active, backup and warming — for your monthly outreach targets.",
  alternates: { canonical: "/tools/inbox-count" },
  openGraph: {
    title: "Inbox Count Calculator for Cold Email",
    description: "Work out how many sending inboxes you need — active, backup and warming — for your monthly outreach targets.",
    url: "https://burnedinbox.com/tools/inbox-count",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

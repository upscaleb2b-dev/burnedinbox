import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repair or Replace Calculator for Burned Domains",
  description: "Data-driven answer to cold email's hardest call: rehabilitate a damaged domain or replace it with fresh infrastructure.",
  alternates: { canonical: "/tools/repair-or-replace" },
  openGraph: {
    title: "Repair or Replace Calculator for Burned Domains",
    description: "Data-driven answer to cold email's hardest call: rehabilitate a damaged domain or replace it with fresh infrastructure.",
    url: "https://burnedinbox.com/tools/repair-or-replace",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

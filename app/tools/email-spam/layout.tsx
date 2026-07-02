import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Email Spam Test — Content & Subject Analyzer",
  description: "Paste your email and get a deliverability score: spam trigger words, caps ratio, link density, image balance and subject line issues with fixes.",
  alternates: { canonical: "/tools/email-spam" },
  openGraph: {
    title: "Free Email Spam Test — Content & Subject Analyzer",
    description: "Paste your email and get a deliverability score: spam trigger words, caps ratio, link density, image balance and subject line issues with fixes.",
    url: "https://burnedinbox.com/tools/email-spam",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

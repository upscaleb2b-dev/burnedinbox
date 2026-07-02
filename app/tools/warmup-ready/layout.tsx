import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warmup Readiness Checker for Cold Email",
  description: "Answer a short questionnaire to find out if your inboxes are actually ready for campaign volume — or headed for the spam folder.",
  alternates: { canonical: "/tools/warmup-ready" },
  openGraph: {
    title: "Warmup Readiness Checker for Cold Email",
    description: "Answer a short questionnaire to find out if your inboxes are actually ready for campaign volume — or headed for the spam folder.",
    url: "https://burnedinbox.com/tools/warmup-ready",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cold Email Infrastructure Calculator",
  description: "Model your full sending stack: domains, inboxes, warmup pipeline, budget and safe capacity in one calculator.",
  alternates: { canonical: "/tools/infra-calc" },
  openGraph: {
    title: "Cold Email Infrastructure Calculator",
    description: "Model your full sending stack: domains, inboxes, warmup pipeline, budget and safe capacity in one calculator.",
    url: "https://burnedinbox.com/tools/infra-calc",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

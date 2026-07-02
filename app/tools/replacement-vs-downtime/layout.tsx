import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replacement Cost vs Downtime Calculator",
  description: "Compare the cost of pre-warmed replacement infrastructure against the revenue lost while burned domains recover.",
  alternates: { canonical: "/tools/replacement-vs-downtime" },
  openGraph: {
    title: "Replacement Cost vs Downtime Calculator",
    description: "Compare the cost of pre-warmed replacement infrastructure against the revenue lost while burned domains recover.",
    url: "https://burnedinbox.com/tools/replacement-vs-downtime",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

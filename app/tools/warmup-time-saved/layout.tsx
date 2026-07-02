import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warmup Time-Saved Calculator",
  description: "Compare DIY inbox warmup against pre-warmed inboxes: weeks saved, launch dates and the break-even price for your volume.",
  alternates: { canonical: "/tools/warmup-time-saved" },
  openGraph: {
    title: "Warmup Time-Saved Calculator",
    description: "Compare DIY inbox warmup against pre-warmed inboxes: weeks saved, launch dates and the break-even price for your volume.",
    url: "https://burnedinbox.com/tools/warmup-time-saved",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

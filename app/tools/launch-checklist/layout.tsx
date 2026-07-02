import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cold Email Pre-Launch Checklist",
  description: "Interactive checklist covering DNS, authentication, warmup, list quality and volume settings — everything to verify before your first send.",
  alternates: { canonical: "/tools/launch-checklist" },
  openGraph: {
    title: "Cold Email Pre-Launch Checklist",
    description: "Interactive checklist covering DNS, authentication, warmup, list quality and volume settings — everything to verify before your first send.",
    url: "https://burnedinbox.com/tools/launch-checklist",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

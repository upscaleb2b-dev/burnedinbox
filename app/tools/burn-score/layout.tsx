import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Burn Score Calculator — Domain Health Check",
  description: "Score your sending domain's health from volume, bounces, engagement and infrastructure signals. Know if you're burning before placement collapses.",
  alternates: { canonical: "/tools/burn-score" },
  openGraph: {
    title: "Burn Score Calculator — Domain Health Check",
    description: "Score your sending domain's health from volume, bounces, engagement and infrastructure signals. Know if you're burning before placement collapses.",
    url: "https://burnedinbox.com/tools/burn-score",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

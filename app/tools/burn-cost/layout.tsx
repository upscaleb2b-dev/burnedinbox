import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Burned Inbox Cost Calculator",
  description: "Calculate the true cost of burned sending infrastructure: replacement, downtime, pipeline loss and client churn risk.",
  alternates: { canonical: "/tools/burn-cost" },
  openGraph: {
    title: "Burned Inbox Cost Calculator",
    description: "Calculate the true cost of burned sending infrastructure: replacement, downtime, pipeline loss and client churn risk.",
    url: "https://burnedinbox.com/tools/burn-cost",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

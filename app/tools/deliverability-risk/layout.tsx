import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deliverability Risk Score Calculator",
  description: "Model your cold email setup across 8 risk factors and get a prioritized list of what to fix before launching.",
  alternates: { canonical: "/tools/deliverability-risk" },
  openGraph: {
    title: "Deliverability Risk Score Calculator",
    description: "Model your cold email setup across 8 risk factors and get a prioritized list of what to fix before launching.",
    url: "https://burnedinbox.com/tools/deliverability-risk",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

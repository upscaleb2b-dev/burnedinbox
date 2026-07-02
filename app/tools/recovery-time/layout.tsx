import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Recovery Time Estimator",
  description: "Estimate how long your burned domain needs to recover based on damage severity, blacklist status and sending history.",
  alternates: { canonical: "/tools/recovery-time" },
  openGraph: {
    title: "Domain Recovery Time Estimator",
    description: "Estimate how long your burned domain needs to recover based on damage severity, blacklist status and sending history.",
    url: "https://burnedinbox.com/tools/recovery-time",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency Client Capacity Calculator",
  description: "Model how many cold email clients your agency's infrastructure can support before deliverability risk stacks up.",
  alternates: { canonical: "/tools/client-capacity" },
  openGraph: {
    title: "Agency Client Capacity Calculator",
    description: "Model how many cold email clients your agency's infrastructure can support before deliverability risk stacks up.",
    url: "https://burnedinbox.com/tools/client-capacity",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

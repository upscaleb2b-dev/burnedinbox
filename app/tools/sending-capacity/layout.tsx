import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sending Capacity Calculator",
  description: "Calculate how many leads per month your cold email infrastructure can actually reach at safe sending limits.",
  alternates: { canonical: "/tools/sending-capacity" },
  openGraph: {
    title: "Sending Capacity Calculator",
    description: "Calculate how many leads per month your cold email infrastructure can actually reach at safe sending limits.",
    url: "https://burnedinbox.com/tools/sending-capacity",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

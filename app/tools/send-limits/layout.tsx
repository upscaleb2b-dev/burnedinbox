import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safe Send Limits Calculator by Provider",
  description: "Get safe daily sending caps per inbox for Google Workspace and Microsoft 365, with ramp schedules that protect your domains.",
  alternates: { canonical: "/tools/send-limits" },
  openGraph: {
    title: "Safe Send Limits Calculator by Provider",
    description: "Get safe daily sending caps per inbox for Google Workspace and Microsoft 365, with ramp schedules that protect your domains.",
    url: "https://burnedinbox.com/tools/send-limits",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

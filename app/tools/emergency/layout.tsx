import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cold Email Emergency Calculator",
  description: "Infrastructure burned mid-campaign? Calculate downtime cost, recovery timelines and replacement options in one place.",
  alternates: { canonical: "/tools/emergency" },
  openGraph: {
    title: "Cold Email Emergency Calculator",
    description: "Infrastructure burned mid-campaign? Calculate downtime cost, recovery timelines and replacement options in one place.",
    url: "https://burnedinbox.com/tools/emergency",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

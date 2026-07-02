import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free BIMI Record Checker — Logo & VMC Validation",
  description: "Check your BIMI record, verify your SVG logo URL and VMC certificate are reachable, and confirm the DMARC p=reject requirement for Gmail logo display.",
  alternates: { canonical: "/tools/bimi" },
  openGraph: {
    title: "Free BIMI Record Checker — Logo & VMC Validation",
    description: "Check your BIMI record, verify your SVG logo URL and VMC certificate are reachable, and confirm the DMARC p=reject requirement for Gmail logo display.",
    url: "https://burnedinbox.com/tools/bimi",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

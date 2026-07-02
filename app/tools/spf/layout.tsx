import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free SPF Record Checker & Generator",
  description: "Look up and validate any domain's SPF record, or build a correct one with includes for Google, Microsoft 365, SendGrid and more. Instant grading with fixes.",
  alternates: { canonical: "/tools/spf" },
  openGraph: {
    title: "Free SPF Record Checker & Generator",
    description: "Look up and validate any domain's SPF record, or build a correct one with includes for Google, Microsoft 365, SendGrid and more. Instant grading with fixes.",
    url: "https://burnedinbox.com/tools/spf",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

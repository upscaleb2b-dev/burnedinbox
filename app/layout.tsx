import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Burned Inbox — Email Deliverability & Inbox Placement Tester",
  description: "Test whether your emails land in the inbox or spam. Free inbox placement test, spam score checker, SPF/DKIM/DMARC analysis for email marketers.",
  keywords: "inbox placement test, email deliverability test, spam test, email spam checker, SPF DKIM DMARC, email blacklist check, sender reputation",
  openGraph: {
    title: "Burned Inbox — Is Your Email Landing in Spam?",
    description: "Send a test email and see instantly whether it lands in the inbox or spam. Free deliverability tester.",
    url: "https://burnedinbox.com",
    siteName: "Burned Inbox",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://burnedinbox.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

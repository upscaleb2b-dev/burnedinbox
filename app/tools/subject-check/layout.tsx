import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Subject Line Spam Tester",
  description: "Test email subject lines for spam trigger words, fake Re:/Fwd: prefixes, promotional language and length issues before you send.",
  alternates: { canonical: "/tools/subject-check" },
  openGraph: {
    title: "Free Subject Line Spam Tester",
    description: "Test email subject lines for spam trigger words, fake Re:/Fwd: prefixes, promotional language and length issues before you send.",
    url: "https://burnedinbox.com/tools/subject-check",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

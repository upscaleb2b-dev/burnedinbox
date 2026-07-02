import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DKIM Record Checker — Auto-Discover Selectors",
  description: "Check DKIM records across 16+ common selectors, validate key type and length (1024 vs 2048-bit RSA), and detect revoked or test-mode keys.",
  alternates: { canonical: "/tools/dkim" },
  openGraph: {
    title: "Free DKIM Record Checker — Auto-Discover Selectors",
    description: "Check DKIM records across 16+ common selectors, validate key type and length (1024 vs 2048-bit RSA), and detect revoked or test-mode keys.",
    url: "https://burnedinbox.com/tools/dkim",
    siteName: "Burned Inbox",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

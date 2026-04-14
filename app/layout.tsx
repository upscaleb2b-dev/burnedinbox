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
  icons: {
    icon: [
      { url: "/favicon.ico",    sizes: "any" },
      { url: "/favicon.svg",    type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icon.png", sizes: "64x64", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GH6YRN6LNR" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GH6YRN6LNR');`,
          }}
        />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1825568108268829');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display:"none" }} src="https://www.facebook.com/tr?id=1825568108268829&ev=PageView&noscript=1" alt="" />
        </noscript>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://burnedinbox.com"),
  title: {
    default: "Burned Inbox — Email Deliverability & Inbox Placement Tester",
    template: "%s — BurnedInbox",
  },
  description: "Free cold email placement tester. Check if your emails land in the inbox or spam, and run SPF, DKIM, DMARC and blacklist checks — no account required.",
  applicationName: "BurnedInbox",
  keywords: "inbox placement test, cold email deliverability, email spam test, email deliverability checker, SPF DKIM DMARC checker, email blacklist check, burned domain, sender reputation",
  authors: [{ name: "BurnedInbox", url: "https://burnedinbox.com" }],
  creator: "BurnedInbox",
  publisher: "BurnedInbox",
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "Burned Inbox — Is Your Email Landing in Spam?",
    description: "Free cold email placement tester with SPF, DKIM, DMARC and blacklist checks. See where your email lands before your campaigns pay for it.",
    url: "https://burnedinbox.com",
    siteName: "Burned Inbox",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burned Inbox — Is Your Email Landing in Spam?",
    description: "Free cold email placement tester with SPF, DKIM, DMARC and blacklist checks.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
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
      <body>
        {children}
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-GH6YRN6LNR" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GH6YRN6LNR');`,
          }}
        />
        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1825568108268829');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display:"none" }} src="https://www.facebook.com/tr?id=1825568108268829&ev=PageView&noscript=1" alt="" />
        </noscript>
        {/* X (Twitter) Pixel */}
        <Script id="x-pixel" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','r5gy0');`,
          }}
        />
      </body>
    </html>
  );
}

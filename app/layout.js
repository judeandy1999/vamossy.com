import { Source_Serif_4, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/site/AppShell";
import ClientAuthProvider from "@/components/providers/client-auth-provider";
import ErrorBoundary from "@/components/error-boundary";
import Script from "next/script";
import { generateSiteMetadata, generatePersonSchema, generateWebsiteSchema } from "@/utils/seo";
import { SITE } from "@/lib/site";

const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = generateSiteMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonSchema()) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied'
            });
            gtag('config', '${SITE.gaId}', { anonymize_ip: true });
          `}
        </Script>
      </head>
      <body className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <ErrorBoundary>
          <ClientAuthProvider>
            <AppShell>{children}</AppShell>
          </ClientAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

import "./globals.css";
import localFont from 'next/font/local';
import Header from "@/components/shared/header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsentProvider } from "@/contexts/cookie-consent-context";
import CookieConsentBanner from "@/components/ui/cookie-consent-banner";
import Script from 'next/script';

export const metadata = {
  title: "Vamossy",
  description: "YOUR AI-POWERED ECOMMERCE GROWTH CONSULTING AGENCY",
  verification: {
    google: "NlE98BHOIRMISy-mkyutFS59QmEzKPr-EKQBgd_NdOc",
  },
};

const proximaNova = localFont({
  src: [
    {
      path: '../public/fonts/ProximaNovaRegular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ProximaNova-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/ProximaNova-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/ProximaNova-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={proximaNova.className}>
      <body className={`${proximaNova.className}`}>
        {/* Google Analytics 4 - Consent Mode */}
        <Script
          id="ga-consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
              });
              gtag('js', new Date());
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0MPGTS19F3"
          strategy="beforeInteractive"
        />
        
        <CookieConsentProvider>
          <Header />
          <div className="height-[100vh] z-4">
            {children}
            <SpeedInsights />
          </div>
          <CookieConsentBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}

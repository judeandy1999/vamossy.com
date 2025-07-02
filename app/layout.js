import "./globals.css";
import localFont from 'next/font/local';
import Header from "@/components/shared/header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsentProvider } from "@/contexts/cookie-consent-context";
import CookieConsentBanner from "@/components/ui/cookie-consent-banner";

export const metadata = {
  title: "Vamossy",
  description: "YOUR AI-POWERED ECOMMERCE GROWTH CONSULTING AGENCY",
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

import "./globals.css";
import localFont from 'next/font/local';
// import Header from "@/components/shared/header";
import { CookieConsentProvider } from "@/contexts/cookie-consent-context";
import ClientAuthProvider from "@/components/providers/client-auth-provider";
import CookieConsentBanner from "@/components/ui/cookie-consent-banner";
import Script from 'next/script';
import Navbar from "@/components/shared/navbar";
import ErrorBoundary from "@/components/error-boundary";
import FooterV2 from "@/components/shared/footer-v2";

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
      <body className={`${proximaNova.className}`} suppressHydrationWarning={true}>
        {/* Google Analytics 4 - Consent Mode */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GCCXJQB3L7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GCCXJQB3L7');
          `}
        </Script>
        
        <ErrorBoundary>
          <ClientAuthProvider>
            <Navbar />
            <div className="height-[100vh] z-4">
              {children}
            </div>
            <FooterV2 />
          </ClientAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

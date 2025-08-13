import "./globals.css";
import localFont from 'next/font/local';
import ClientAuthProvider from "@/components/providers/client-auth-provider";
import Script from 'next/script';
import Navbar from "@/components/shared/navbar";
import ErrorBoundary from "@/components/error-boundary";
import FooterV2 from "@/components/shared/footer-v2";
import CookieConsentBanner from "@/components/shared/consent-banner-v2";

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
        {/* Consent Mode Default - Must be first */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            var defaultConsent = 'denied';
            try {
              if (typeof window !== 'undefined') {
                var saved = localStorage.getItem('cookie-consent:v1');
                if (saved === 'accepted') {
                  defaultConsent = 'granted';
                }
              }
            } catch (e) {}
            
            gtag('consent', 'default', {
              'analytics_storage': defaultConsent,
              'ad_storage': defaultConsent,
              'ad_user_data': defaultConsent,
              'ad_personalization': defaultConsent
            });
          `}
        </Script>

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GCCXJQB3L7"
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', 'G-GCCXJQB3L7', { 
              anonymize_ip: true 
            });
          `}
        </Script>
        
        <ErrorBoundary>
          <ClientAuthProvider>
            <Navbar />
            <div className="height-[100vh] z-4">
              {children}
            </div>
            <FooterV2 />
            <CookieConsentBanner />
          </ClientAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

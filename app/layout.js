import "./globals.css";
import localFont from 'next/font/local';
import ClientAuthProvider from "@/components/providers/client-auth-provider";
import Script from 'next/script';
import Navbar from "@/components/shared/navbar";
import ErrorBoundary from "@/components/error-boundary";
import FooterV2 from "@/components/shared/footer-v2";
import CookieConsentBanner from "@/components/shared/consent-banner-v2";

export const metadata = {
  title: "Vamossy Digital",
  description: "Dominate the DTC Supplement Market. The Proven AI, SEO & Marketing Partner for Food & Vitamin Brands",
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

        {/* Tidio Chat */}
        <Script
          src="//code.tidio.co/m4uaqdxnzzjolkznzwwrqsy1otnfdyxo.js"
          strategy="afterInteractive"
        />

        {/* Cal.com Script */}
        <Script id="cal-embed" strategy="afterInteractive">
          {`
            (function (C, A, L) { 
              let p = function (a, ar) { a.q.push(ar); }; 
              let d = C.document; 
              C.Cal = C.Cal || function () { 
                let cal = C.Cal; 
                let ar = arguments; 
                if (!cal.loaded) { 
                  cal.ns = {}; 
                  cal.q = cal.q || []; 
                  d.head.appendChild(d.createElement("script")).src = A; 
                  cal.loaded = true; 
                } 
                if (ar[0] === L) { 
                  const api = function () { p(api, arguments); }; 
                  const namespace = ar[1]; 
                  api.q = api.q || []; 
                  if(typeof namespace === "string"){
                    cal.ns[namespace] = cal.ns[namespace] || api;
                    p(cal.ns[namespace], ar);
                    p(cal, ["initNamespace", namespace]);
                  } else p(cal, ar); 
                  return;
                } 
                p(cal, ar); 
              }; 
            })(window, "https://app.cal.com/embed/embed.js", "init");
            
            Cal("init", "consultation", {origin:"https://app.cal.com"});
            Cal.ns.consultation("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
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

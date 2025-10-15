import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared-components/Navbar";
import Footer from "@/components/shared-components/Footer";
import CookieConsentBanner from "@/components/shared-components/CookieConsentBanner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vamossy - Your Ecommerce Growth Partner",
  description: "Vamossy is your dedicated partner in eCommerce growth, providing tailored solutions to elevate your online business.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Initialize with consent mode */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8Y6KGXJE9K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Initialize with denied consent by default
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied'
            });
            
            // Configure Google Analytics
            gtag('config', 'G-8Y6KGXJE9K');
          `}
        </Script>

        {/* Cal.com embed script */}
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
            
            Cal("init", "discovery-call", {origin:"https://app.cal.com"});
            Cal.ns["discovery-call"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
          `}
        </Script>
        <Script src="//code.tidio.co/watsvndw7fxjw3m5rfw96b7cwimfzwbm.js" async></Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}

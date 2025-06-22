import PageWrapper from '@/components/page-wrapper';
import ContactUs from '@/components/homepage/contact-us';
import ContactHero from '@/components/contact/contact-hero';
import WhatWeBelieve from '@/components/contact/what-we-believe';
import Footer from '@/components/shared/footer';


export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
          <div className="fixed inset-0 z-0">
            <img
              src="/homepage/hero-bg.webp"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          </div>
          <div className="relative z-10">
            <ContactHero />
            <WhatWeBelieve />
            <ContactUs />
            <Footer />
          </div>
        </div>
  );
}
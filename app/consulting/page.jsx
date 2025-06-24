import React from 'react';
import Footer from '@/components/shared/footer';
import ConsultingHero from '@/components/consulting/consulting-hero';
import ExpertiseSection from '@/components/consulting/expertise-framework';
import OurProcess from '@/components/consulting/our-process';
import WhyClientsWorkWithUs from '@/components/consulting/why-clients-work-with-us';
import LetsBuild from '@/components/consulting/lets-build';


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
        <ConsultingHero />
        <ExpertiseSection />
        <OurProcess />
        <WhyClientsWorkWithUs />
        <LetsBuild />
        <Footer />
      </div>
    </div>
  );
}
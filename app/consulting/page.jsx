import React from 'react';
import Footer from '@/components/shared/footer';
import ConsultingHero from '@/components/consulting/consulting-hero';


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
        <Footer />
      </div>
    </div>
  );
}
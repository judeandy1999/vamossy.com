import AboutHero from '@/components/about/about-hero';
import AboutBeliefSection from '@/components/about/who-and-what';
import React from 'react';
import Footer from '@/components/shared/footer';
import FounderCard from '@/components/about/founder-card';
import { founder } from '@/data/data';
import Compare from '@/components/about/compare';
import AiSystemWork from '@/components/about/ai-system-work';
import BrandWorkWithUs from '@/components/about/brand-work-with-us';

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
        <AboutHero />
        <AboutBeliefSection />
        <FounderCard founder={founder} />
        <Compare />
        <AiSystemWork />
        <BrandWorkWithUs />
        <Footer />
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import ServicesHero from '@/components/services/services-hero';
import Footer from '@/components/shared/footer';
import TieredServices from '@/components/services/tiered-services-page';
import TierPackagesSection from '@/components/services/tier-package-section';
import ProofThroughPerspective from "@/components/homepage/proof-through-perspective";
import BeAnEarlyAdopter from '@/components/services/be-an-early-adopter';
import TalkWithUs from '@/components/services/talk-with-us';
import ContactUs from '@/components/homepage/contact-us';
import ServicesLiveCaseStudies from '@/components/services/article-services';
import HeroServicesCarousel from '@/components/services/services-carousel';
import GoogleCalendarModal from "@/components/ui/google-calendar";

export default function Page() {

  const [showCalendar, setShowCalendar] = useState(false);
  
      const handleBookNowClick = (e) => {
          e.preventDefault();
          setShowCalendar(true);
      };
  
      const handleCloseCalendar = () => {
          setShowCalendar(false);
      };

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
        <section className="relative h-[100vh] z-10">
          <HeroServicesCarousel onBookNowClick={handleBookNowClick} />
        </section>
        {/* <ServicesHero /> */}
        <TieredServices />
        {/* <BeAnEarlyAdopter /> */}
        <TalkWithUs />
        {/* <ProofThroughPerspective />
        <TierPackagesSection />
        <ServicesLiveCaseStudies />
        <ContactUs variant={'gray-gradient'} cardVariant={'normal'} /> */}
        <Footer />
      </div>

      <GoogleCalendarModal
        isOpen={showCalendar}
        onClose={handleCloseCalendar}
      />
    </div>
  );
}
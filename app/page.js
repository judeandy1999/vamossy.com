'use client';

import { useState } from 'react';
import Hero from "@/components/homepage/hero";
import Footer from "@/components/shared/footer";
import WhoWeHelp from "@/components/homepage/who-we-help";
import ContactUs from "@/components/homepage/contact-us";
import UniqueSolutions from "@/components/homepage/unique-solutions";
import TieredServices from "@/components/homepage/tiered-services";
import ProofThroughPerspective from "@/components/homepage/proof-through-perspective";
import LiveCaseStudies from "@/components/homepage/article-section";
import Carousel from "@/components/homepage/carousel";
import GoogleCalendarModal from "@/components/ui/google-calendar";
import HowWeDrive from '@/components/homepage/how-we-drive';

export default function Home() {
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
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
        </div>

        <div className="relative">
          {/* Add Carousel Section */}
          <section className="relative h-[65vh] mt-[8vh] z-10">
            <Carousel onBookNowClick={handleBookNowClick} />
          </section>
          {/* <Hero /> */}
          <WhoWeHelp />
          <HowWeDrive />
          <UniqueSolutions />
          <TieredServices />
          <ProofThroughPerspective />
          <LiveCaseStudies />
          <ContactUs/>
          <Footer />
        </div>

        <GoogleCalendarModal
          isOpen={showCalendar}
          onClose={handleCloseCalendar}
        />
      </div>
    );
}

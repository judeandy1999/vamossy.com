'use client';

import Image from "next/image";
import Hero from "@/components/homepage/hero";
import MarketingFeatures from "@/components/homepage/marketing-features";
import NeedHelp from "@/components/shared/need-help";
import OurStory from "@/components/homepage/our-story";
import RemarkableResults from "@/components/homepage/remarkable-results";
import TeamSection from "@/components/homepage/team-section";
import Footer from "@/components/shared/footer";
import OurServices from "@/components/homepage/our-services";
import PainPoints from "@/components/homepage/pain-points";
import LiveCaseStudies from "@/components/homepage/live-case-study";
import NewHorizons from "@/components/homepage/new-horizon-section";
import OurValues from "@/components/homepage/our-values";
import WhoWeHelp from "@/components/homepage/who-we-help";
import { Contact } from "lucide-react";
import ContactUs from "@/components/homepage/contact-us";
import UniqueSolutions from "@/components/homepage/unique-solutions";
import TieredServices from "@/components/homepage/tiered-services";
import ProofThroughPerspective from "@/components/homepage/proof-through-perspective";

export default function Home() {
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

        <div className="relative">
          <Hero />
          <WhoWeHelp />
          <UniqueSolutions />
          <TieredServices />
          <ProofThroughPerspective />
          {/* <MarketingFeatures />
          <OurServices />
          <PainPoints />
          <LiveCaseStudies /> */}
          <ContactUs />
          <Footer />
        </div>
      </div>
    );
}

'use client';

import Hero from "@/components/homepage/hero";
import Footer from "@/components/shared/footer";
import WhoWeHelp from "@/components/homepage/who-we-help";
import GrowWithConfidence from "@/components/homepage/grow-with-confidence";
import ContactUs from "@/components/homepage/contact-us";
import UniqueSolutions from "@/components/homepage/unique-solutions";
import TieredServices from "@/components/homepage/tiered-services";
import ProofThroughPerspective from "@/components/homepage/proof-through-perspective";
import LiveCaseStudies from "@/components/homepage/article-section";
import WhyClients from "@/components/homepage/why-clients";
import FrameworkSection from "@/components/homepage/our-framework";

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
          <GrowWithConfidence />
          <FrameworkSection />
          <UniqueSolutions />
          <TieredServices />
          <ProofThroughPerspective />
          <WhyClients />
          <LiveCaseStudies />
          <Footer />
        </div>
      </div>
    );
}

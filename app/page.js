'use client';

import Image from "next/image";
import Hero from "@/components/homepage/hero";
import MarketingFeatures from "@/components/homepage/marketing-features";
import NeedHelp from "@/components/ui/need-help";
import OurStory from "@/components/homepage/our-story";
import RemarkableResults from "@/components/homepage/remarkable-results";
import TeamSection from "@/components/homepage/team-section";
import Footer from "@/components/ui/footer";
import { useEffect } from "react";
import { getUser } from '@/utils/authService';
import { useSendToHubSpot } from '@/hooks/useSendToHubSpot';
import OurServices from "@/components/homepage/our-services";

export default function Home() {
    const { sendToHubSpot } = useSendToHubSpot();

    useEffect(() => {
      const fetchUser = async () => {
        const { user } = await getUser();
        if (user) {
          await sendToHubSpot(user);
        }
      };
    
      fetchUser();
    }, []);

    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Full page background */}
        <div className="fixed inset-0 z-0">
          <img
            src="/homepage/hero-bg.webp"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Page content with relative positioning */}
        <div className="relative z-10">
          <Hero />
          <MarketingFeatures />
          <OurServices />
          <OurStory />
          <RemarkableResults />
          <TeamSection />
          <Footer />
        </div>
      </div>
    );
}

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
      <>
        <NeedHelp />
        <Hero />
        <MarketingFeatures />
        <OurStory />
        <RemarkableResults />
        <TeamSection />
        <Footer />
      </>
    );
}

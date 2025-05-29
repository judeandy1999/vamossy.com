import Image from "next/image";
import Hero from "@/components/hero";
import MarketingFeatures from "@/components/marketing-features";
import NeedHelp from "@/components/ui/need-help";
import OurStory from "@/components/our-story";

export default function Home() {
    return (
      <>
        <NeedHelp />
        <Hero />
        <MarketingFeatures />
        <OurStory />
      </>
    );
}

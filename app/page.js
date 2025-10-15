import CaseStudies from "@/components/homepage-components/CaseStudies";
import Hero from "@/components/homepage-components/Hero";
import HowWeWork from "@/components/homepage-components/HowWeWork";
import OurFramework from "@/components/homepage-components/OurFramework";
import OurValue from "@/components/homepage-components/OurValues";
import ServicesModels from "@/components/homepage-components/ServiceModels";
import WhoWeHelp from "@/components/homepage-components/WhoWeHelp";
import ProvenFramework from "@/components/homepage-components/ProvenFramework";
import WhyClientsAppreciateUs from "@/components/homepage-components/WhyClientsAppreciateUs";

export default function Home() {
  return (
    <>
      <Hero />
      <HowWeWork />
      <OurValue />
      <WhoWeHelp />
      <ProvenFramework />
      <ServicesModels />
      <OurFramework />
      <WhyClientsAppreciateUs />
      <CaseStudies />
    </>
  );
}

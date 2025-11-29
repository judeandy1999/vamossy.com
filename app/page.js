import CaseStudies from "@/components/homepage-components/CaseStudies";
import Hero from "@/components/homepage-components/Hero";
import HowWeWork from "@/components/homepage-components/HowWeWork";
import OurFramework from "@/components/homepage-components/OurFramework";
import OurValue from "@/components/homepage-components/OurValues";
import ServicesModels from "@/components/homepage-components/ServiceModels";
import WhoWeHelp from "@/components/homepage-components/WhoWeHelp";
import ProvenFramework from "@/components/homepage-components/ProvenFramework";
import WhyClientsAppreciateUs from "@/components/homepage-components/WhyClientsAppreciateUs";
import { generatePageMetadata } from "@/utils/seo";

export const metadata = generatePageMetadata({
  title: "AI-Powered eCommerce Growth Solutions | Vamossy Digital",
  description: "Transform your eCommerce business with our AI-powered growth systems. We engineer profitable, predictable solutions for Shopify, Adobe Commerce, and WooCommerce brands.",
  keywords: [
    "ecommerce consulting",
    "AI-powered growth",
    "Shopify optimization",
    "Adobe Commerce development", 
    "WooCommerce solutions",
    "digital marketing automation",
    "conversion optimization",
    "ecommerce personalization"
  ],
  url: "/",
});

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

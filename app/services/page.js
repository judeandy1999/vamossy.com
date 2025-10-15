import Hero from "@/components/services-components/Hero";
import ServicesSection from "@/components/services-components/ServicesSection";
import WhyChooseVamossy from "@/components/services-components/WhyChooseVamossy";
import EcommerceGrowthPartner from "@/components/services-components/EcommerceGrowthPartner";
import CTASection from "@/components/services-components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyChooseVamossy />
      <EcommerceGrowthPartner />
      <CTASection />
    </>
  );
}

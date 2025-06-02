import ServicesHero from '@/components/services/services-hero';
import NeedHelp from '@/components/ui/need-help';
import Footer from '@/components/ui/footer';
import AwardsSection from '@/components/services/awards-section';
import DigitalMarketingServices from '@/components/services/digital-marketing-services';
import ServicesPromoSection from '@/components/services/services-promo-section';
import { promoSections } from "@/data/data";
import TrustedBySection from '@/components/services/trustedby-section';

export default function Page() {
  
  return (
    <div>
      <NeedHelp/>
      <ServicesHero />
      <AwardsSection />
      <DigitalMarketingServices />
      {promoSections.map((section, index) => (
        <ServicesPromoSection key={index} {...section} />
      ))}
      <TrustedBySection />

      <Footer />
    </div>
  );
}
import ServicesHero from '@/components/services-hero';
import NeedHelp from '@/components/ui/need-help';
import Footer from '@/components/footer';
import AwardsSection from '@/components/awards-section';
import DigitalMarketingServices from '@/components/digital-marketing-services';
import ServicesPromoSection from '@/components/services-promo-section';
import { promoSections } from "@/data/data";
import TrustedBySection from '@/components/trustedby-section';

export default function Page() {
  
  return (
    <div className='pt-12'>
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
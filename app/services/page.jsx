import ServicesHero from '@/components/services/services-hero';
import Footer from '@/components/shared/footer';
import TieredServices from '@/components/services/tiered-services-page';
import TierPackagesSection from '@/components/services/tier-package-section';
import ProofThroughPerspective from "@/components/homepage/proof-through-perspective";
import BeAnEarlyAdopter from '@/components/services/be-an-early-adopter';
import TalkWithUs from '@/components/services/talk-with-us';
import ContactUs from '@/components/homepage/contact-us';

export default function Page() {
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
      <div className="relative z-10">
        <ServicesHero />
        <TieredServices />
        <BeAnEarlyAdopter />
        <TalkWithUs />
        <ProofThroughPerspective />
        <TierPackagesSection />
        <ContactUs />
        <Footer />
      </div>
    </div>
  );
}
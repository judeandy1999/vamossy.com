import { tierPackages } from "@/data/data";
import TierPackage from "./tier-package";
import Tier2Package from "./tier2-package";
import Tier3Package from "./tier3-package";

export default function TierPackagesSection() {
  return (
    <div>
      {tierPackages.map((tier) =>
        tier.id === 2 ? (
          <Tier2Package key={tier.id} />
        ) : tier.id === 3 ? (
          <Tier3Package
            key={tier.id}
          />
        ) : (
          <TierPackage
            key={tier.id}
            title={tier.title}
            subtitle={tier.subtitle}
            cards={tier.cards}
            whatsIncluded={tier.whatsIncluded}
            embeddedAISystems={tier.embeddedAISystems}
            deliverables={tier.deliverables}
          />
        )
      )}
    </div>
  );
}
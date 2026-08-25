import Link from "next/link";
import { SEVEN_LAYER_GOVERNANCE } from "@/lib/sevenLayerGovernance";

export default function SevenLayerDiagram({ linkTo = "anchor" }) {
  return (
    <figure className="layer-figure">
      <figcaption className="layer-caption">
        The seven layers, in the order given by the author. This listing does
        not assert a causal, hierarchical, circular, or other relationship
        beyond that stated order.
      </figcaption>
      <ol className="layer-stack" aria-label="Seven governance layers">
        {SEVEN_LAYER_GOVERNANCE.layers.map((layer) => {
          const href =
            linkTo === "page" ? layer.path : layer.href;
          return (
            <li key={layer.slug} className="layer-band">
              <Link href={href}>
                <span className="layer-num">Layer {layer.number}</span>
                <span className="layer-name">{layer.name}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/utils/seo";
import {
  SEVEN_LAYER_GOVERNANCE,
  getSevenLayer,
  layerHasMaterial,
} from "@/lib/sevenLayerGovernance";
import { SITE, absUrl } from "@/lib/site";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import ResearchView from "@/components/site/ResearchView";

export function generateStaticParams() {
  return SEVEN_LAYER_GOVERNANCE.layers.map((layer) => ({ layer: layer.slug }));
}

export async function generateMetadata({ params }) {
  const { layer: slug } = await params;
  const layer = getSevenLayer(slug);
  if (!layer) return {};
  return generatePageMetadata({
    title: `${layer.heading} — Seven-Layer Governance`,
    description: `${layer.heading} in Gergely Vámossy's seven-layer governance architecture. This layer page is a placeholder while the research program is in preparation.`,
    keywords: [
      "seven-layer governance",
      layer.name,
      "governance architecture",
    ],
    url: layer.path,
    authors: [SEVEN_LAYER_GOVERNANCE.author],
  });
}

const FIELD_GROUPS = [
  { key: "description", label: "Description" },
  { key: "formalDefinition", label: "Formal definition" },
  { key: "methodology", label: "Methodology" },
  { key: "equations", label: "Equations" },
  { key: "proofs", label: "Proofs" },
  { key: "evidence", label: "Evidence" },
  { key: "experiments", label: "Experiments" },
  { key: "datasets", label: "Datasets" },
  { key: "references", label: "References" },
  { key: "dependencies", label: "Dependencies" },
  { key: "relatedLayers", label: "Related layers" },
  { key: "openQuestions", label: "Open questions" },
  { key: "artifacts", label: "Artifacts" },
  { key: "notes", label: "Research notes" },
  { key: "diagrams", label: "Diagrams" },
];

function isFilled(value) {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

export default async function SevenLayerPage({ params }) {
  const { layer: slug } = await params;
  const layer = getSevenLayer(slug);
  if (!layer) notFound();

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
    { name: SEVEN_LAYER_GOVERNANCE.title, url: SEVEN_LAYER_GOVERNANCE.path },
    { name: layer.heading, url: layer.path },
  ];

  const index = SEVEN_LAYER_GOVERNANCE.layers.findIndex((item) => item.slug === slug);
  const prev = SEVEN_LAYER_GOVERNANCE.layers[index - 1];
  const next = SEVEN_LAYER_GOVERNANCE.layers[index + 1];

  return (
    <div className="page">
      <ResearchView title={layer.heading} path={layer.path} />
      <JsonLd
        data={[
          generateBreadcrumbSchema(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: layer.heading,
            url: absUrl(layer.path),
            isPartOf: {
              "@type": "ResearchProject",
              name: SEVEN_LAYER_GOVERNANCE.title,
              url: absUrl(SEVEN_LAYER_GOVERNANCE.path),
            },
            author: {
              "@type": "Person",
              name: SITE.author.name,
            },
            creativeWorkStatus: "In development",
            position: layer.number,
          },
        ]}
      />
      <article className="site-wrap" style={{ maxWidth: "760px" }}>
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
        <p className="kicker">
          {SEVEN_LAYER_GOVERNANCE.title} · Layer {layer.number} of{" "}
          {SEVEN_LAYER_GOVERNANCE.layers.length}
        </p>
        <h1>{layer.heading}</h1>
        <p className="lede">
          Permanent URL for this layer in the author&apos;s seven-layer
          governance architecture. Content fields are empty until source
          material is supplied.
        </p>
        <dl className="pub-meta">
          <dt>Author</dt>
          <dd>{SEVEN_LAYER_GOVERNANCE.author}</dd>
          <dt>Validation status</dt>
          <dd>{layer.validationStatus.replace("_", " ")}</dd>
          <dt>Program status</dt>
          <dd>{SEVEN_LAYER_GOVERNANCE.status.label}</dd>
        </dl>

        {layerHasMaterial(layer) ? (
          <p>{layer.description}</p>
        ) : (
          <p className="placeholder">
            No description has been supplied for {layer.name} yet. This page
            holds the structured slots for later definitions, evidence, and
            artifacts.
          </p>
        )}

        <h2>Content fields</h2>
        <dl className="field-list">
          {FIELD_GROUPS.map((field) => (
            <div key={field.key}>
              <dt>{field.label}</dt>
              <dd>
                {isFilled(layer[field.key])
                  ? Array.isArray(layer[field.key])
                    ? layer[field.key].join("; ")
                    : layer[field.key]
                  : "Not yet supplied"}
              </dd>
            </div>
          ))}
        </dl>

        <nav className="artifact-links" aria-label="Layer navigation" style={{ marginTop: "2rem" }}>
          {prev && (
            <Link className="artifact-link" href={prev.path}>
              Previous: {prev.name}
            </Link>
          )}
          {next && (
            <Link className="artifact-link" href={next.path}>
              Next: {next.name}
            </Link>
          )}
          <Link className="artifact-link" href={SEVEN_LAYER_GOVERNANCE.path}>
            Architecture overview
          </Link>
        </nav>
      </article>
    </div>
  );
}

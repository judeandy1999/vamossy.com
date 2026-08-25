import Link from "next/link";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/utils/seo";
import { SEVEN_LAYER_GOVERNANCE, layerHasMaterial } from "@/lib/sevenLayerGovernance";
import { SITE, absUrl } from "@/lib/site";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import PublicationHeader from "@/components/site/PublicationHeader";
import ResearchView from "@/components/site/ResearchView";
import SevenLayerDiagram from "@/components/site/SevenLayerDiagram";

const PATH = SEVEN_LAYER_GOVERNANCE.path;

export const metadata = generatePageMetadata({
  title: "Seven-Layer Governance Architecture",
  description:
    "Gergely Vámossy's seven-layer governance architecture in preparation: Mathematics, Physics, Chemistry, Biology, Evolution, Human Qualia, and God / Electromagnetic Governance.",
  keywords: [
    "seven-layer governance",
    "governance architecture",
    "mathematical governance",
    "physical governance",
    "biological governance",
    "evolutionary governance",
    "human qualia",
    "electromagnetic governance",
    "AI governance",
    "epistemic infrastructure",
  ],
  url: PATH,
  authors: [SEVEN_LAYER_GOVERNANCE.author],
});

function researchProjectSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    name: SEVEN_LAYER_GOVERNANCE.title,
    alternateName: SEVEN_LAYER_GOVERNANCE.authorTerm,
    description:
      "A seven-layer governance architecture described by Gergely Vámossy. Research in preparation; layer definitions and evidence have not yet been supplied on this site.",
    url: absUrl(PATH),
    creator: {
      "@type": "Person",
      name: SITE.author.name,
      email: SITE.author.email,
      affiliation: SITE.author.affiliation,
      url: absUrl("/about"),
    },
    author: {
      "@type": "Person",
      name: SITE.author.name,
    },
    creativeWorkStatus: SEVEN_LAYER_GOVERNANCE.status.creativeWorkStatus,
    version: SEVEN_LAYER_GOVERNANCE.version,
    keywords: "seven-layer governance, governance architecture",
    hasPart: {
      "@type": "ItemList",
      name: "Seven governance layers",
      numberOfItems: SEVEN_LAYER_GOVERNANCE.layers.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: SEVEN_LAYER_GOVERNANCE.layers.map((layer) => ({
        "@type": "ListItem",
        position: layer.number,
        name: layer.heading,
        url: absUrl(layer.path),
        item: {
          "@type": "CreativeWork",
          name: layer.name,
          url: absUrl(layer.path),
          creativeWorkStatus: "In development",
        },
      })),
    },
    isRelatedTo: SEVEN_LAYER_GOVERNANCE.relatedResearch.map((item) => ({
      "@type": "CreativeWork",
      name: item.title,
      url: absUrl(item.href),
    })),
  };
}

function phaseLabel(status) {
  if (status === "in_progress") return "In progress";
  if (status === "complete") return "Complete";
  return "Not started";
}

export default function SevenLayerGovernancePage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
    { name: SEVEN_LAYER_GOVERNANCE.title, url: PATH },
  ];

  return (
    <div className="page">
      <ResearchView title={SEVEN_LAYER_GOVERNANCE.title} path={PATH} />
      <JsonLd data={[generateBreadcrumbSchema(crumbs), researchProjectSchema()]} />
      <article className="site-wrap">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
        <PublicationHeader
          kicker="Research program"
          title={SEVEN_LAYER_GOVERNANCE.title}
          subtitle={SEVEN_LAYER_GOVERNANCE.subtitle}
          author={SEVEN_LAYER_GOVERNANCE.author}
          affiliation={SEVEN_LAYER_GOVERNANCE.affiliation}
          version={SEVEN_LAYER_GOVERNANCE.version}
          type={SEVEN_LAYER_GOVERNANCE.type}
        />

        <section className="status-panel" aria-labelledby="research-status">
          <h2 id="research-status">Research Status</h2>
          <dl className="pub-meta">
            <dt>Research Status</dt>
            <dd>{SEVEN_LAYER_GOVERNANCE.status.label}</dd>
            <dt>Current phase</dt>
            <dd>{SEVEN_LAYER_GOVERNANCE.status.currentPhase}</dd>
            <dt>Framework</dt>
            <dd>{SEVEN_LAYER_GOVERNANCE.status.framework}</dd>
            <dt>Publication</dt>
            <dd>No final paper has been published on this page.</dd>
          </dl>
        </section>

        <section>
          <h2 id="overview">Overview</h2>
          <p>
            This page introduces a seven-layer governance architecture under
            development by {SEVEN_LAYER_GOVERNANCE.author}. The layers, in the
            stated order, are Mathematics, Physics, Chemistry, Biology,
            Evolution, Human Qualia, and God / Electromagnetic Governance.
          </p>
          <p>
            Formal definitions, evidence, and a full publication will be added
            as the research preparation period proceeds.
          </p>
        </section>

        <section>
          <h2 id="architecture">Architecture</h2>
          <SevenLayerDiagram />
        </section>

        <section>
          <h2 id="the-seven-layers">The Seven Layers</h2>
          <p className="muted">
            Each layer has an on-page section and a permanent URL for later
            definitions and artifacts.
          </p>
          {SEVEN_LAYER_GOVERNANCE.layers.map((layer) => (
            <section
              key={layer.slug}
              id={layer.slug}
              className="layer-section"
              aria-labelledby={`${layer.slug}-heading`}
            >
              <h3 id={`${layer.slug}-heading`}>{layer.heading}</h3>
              {layerHasMaterial(layer) ? (
                <p>{layer.description}</p>
              ) : (
                <p className="placeholder">Material forthcoming.</p>
              )}
              <p>
                <Link href={layer.path}>Open layer page</Link>
              </p>
            </section>
          ))}
        </section>

        <section>
          <h2 id="development-structure">Development structure</h2>
          <ol className="phase-list">
            {SEVEN_LAYER_GOVERNANCE.developmentPhases.map((phase) => (
              <li key={phase.id}>
                <strong>
                  Phase {phase.id} — {phase.name}
                </strong>
                <span className="muted"> · {phaseLabel(phase.status)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 id="related-research">Related research</h2>
          <ul>
            {SEVEN_LAYER_GOVERNANCE.relatedResearch.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}

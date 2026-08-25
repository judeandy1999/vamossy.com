import { Suspense } from "react";
import { generatePageMetadata } from "@/utils/seo";
import { PUBLICATIONS, publicationPath } from "@/lib/publications";
import { COMPONENTS, PATTERNS, TOOLKIT_SECTIONS } from "@/lib/toolkit";
import { ONTOLOGY, ONTOLOGY_PARTS, ontologyPartPath } from "@/lib/ontology";
import { SEVEN_LAYER_GOVERNANCE } from "@/lib/sevenLayerGovernance";
import SearchClient from "@/components/site/SearchClient";

export const metadata = generatePageMetadata({
  title: "Search",
  description: "Search Gergely Vámossy's research publications, toolkit documentation, and Mathematics Ontology Bible sections.",
  url: "/search",
});

const INDEX = [
  {
    title: "Home",
    href: "/",
    type: "Page",
    text: "Gergely Vámossy AI LLM governance research publication platform",
  },
  {
    title: "About",
    href: "/about",
    type: "Page",
    text: "Gergely Vámossy QIERA gergo@qiera.io independent researcher",
  },
  ...PUBLICATIONS.map((item) => ({
    title: item.title,
    href: publicationPath(item),
    type: item.type,
    text: `${item.description} ${item.keywords?.join(" ") || ""}`,
  })),
  ...TOOLKIT_SECTIONS.map((item) => ({
    title: `Toolkit: ${item.label}`,
    href: item.href,
    type: "Toolkit",
    text: item.label,
  })),
  ...COMPONENTS.map((item) => ({
    title: item.title,
    href: `/llm-governance-toolkit/${item.slug}`,
    type: "Component",
    text: `${item.summary} ${item.file}`,
  })),
  ...PATTERNS.map((item) => ({
    title: item.title,
    href: `/llm-governance-toolkit/${item.slug}`,
    type: "Pattern",
    text: item.summary,
  })),
  {
    title: ONTOLOGY.title,
    href: "/research/mathematics-ontology-bible",
    type: "Reference",
    text: ONTOLOGY.subtitle,
  },
  ...ONTOLOGY_PARTS.map((part) => ({
    title: part.heading,
    href: ontologyPartPath(part.slug),
    type: "Ontology",
    text: part.nav,
  })),
  {
    title: SEVEN_LAYER_GOVERNANCE.title,
    href: SEVEN_LAYER_GOVERNANCE.path,
    type: "Research program",
    text: `seven-layer governance ${SEVEN_LAYER_GOVERNANCE.layers.map((layer) => layer.name).join(" ")}`,
  },
  ...SEVEN_LAYER_GOVERNANCE.layers.map((layer) => ({
    title: layer.heading,
    href: layer.path,
    type: "Governance layer",
    text: layer.name,
  })),
];

export default function SearchPage() {
  return (
    <div className="page">
      <div className="site-wrap" style={{ maxWidth: "760px" }}>
        <p className="kicker">Search</p>
        <h1>Search the research site</h1>
        <Suspense fallback={<p>Loading search…</p>}>
          <SearchClient index={INDEX} />
        </Suspense>
      </div>
    </div>
  );
}

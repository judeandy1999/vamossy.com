import { generatePageMetadata, generateBreadcrumbSchema } from "@/utils/seo";
import { PUBLICATIONS } from "@/lib/publications";
import PublicationList from "@/components/site/PublicationList";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";

export const metadata = generatePageMetadata({
  title: "Research / Publications",
  description:
    "Publication index for Gergely Vámossy's AI/LLM governance research, including the seven-layer governance program in preparation, Non-Self-Approving AI-Assisted Derivation, the Mathematics Ontology Bible, QIERA, and related papers and notes.",
  keywords: [
    "research",
    "publications",
    "LLM governance",
    "mathematical ontology",
    "QIERA",
  ],
  url: "/research",
});

export default function ResearchIndexPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
  ];

  return (
    <div className="page">
      <JsonLd data={generateBreadcrumbSchema(crumbs)} />
      <div className="site-wrap">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
        <p className="kicker">Index</p>
        <h1>Research / Publications</h1>
        <p className="lede">
          Each item has a permanent URL and can be read as HTML. Canonical
          files are linked where they exist. Future papers can be added to this
          index without changing the URL scheme.
        </p>
        <PublicationList items={PUBLICATIONS} />
      </div>
    </div>
  );
}

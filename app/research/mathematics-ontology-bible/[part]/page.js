import { notFound } from "next/navigation";
import Link from "next/link";
import { generatePageMetadata, generateBreadcrumbSchema, generateScholarlyArticleSchema } from "@/utils/seo";
import { ONTOLOGY, ONTOLOGY_PARTS, getOntologyPart, ontologyPartPath } from "@/lib/ontology";
import { readContent, splitMarkdownSections } from "@/lib/content";
import MarkdownBody from "@/components/site/MarkdownBody";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import OntologyNav from "@/components/site/OntologyNav";
import JsonLd from "@/components/site/JsonLd";
import ResearchView from "@/components/site/ResearchView";

export function generateStaticParams() {
  return ONTOLOGY_PARTS.map((part) => ({ part: part.slug }));
}

export async function generateMetadata({ params }) {
  const { part: slug } = await params;
  const part = getOntologyPart(slug);
  if (!part) return {};
  return generatePageMetadata({
    title: `${part.heading} — ${ONTOLOGY.title}`,
    description: `${part.heading} from The Mathematics Ontology Bible by ${ONTOLOGY.author}. Version ${ONTOLOGY.version}.`,
    keywords: ["mathematical ontology", part.nav, "checkability"],
    url: ontologyPartPath(slug),
    type: "article",
    publishedTime: ONTOLOGY.datePublished,
    authors: [ONTOLOGY.author],
  });
}

export default async function OntologyPartPage({ params }) {
  const { part: slug } = await params;
  const part = getOntologyPart(slug);
  if (!part) notFound();

  const markdown = readContent(ONTOLOGY.file);
  const sections = splitMarkdownSections(markdown, /^## /);
  const section = sections.find((item) => item.heading === part.heading);
  if (!section) notFound();

  const index = ONTOLOGY_PARTS.findIndex((item) => item.slug === slug);
  const prev = ONTOLOGY_PARTS[index - 1];
  const next = ONTOLOGY_PARTS[index + 1];
  const path = ontologyPartPath(slug);
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
    { name: ONTOLOGY.title, url: "/research/mathematics-ontology-bible" },
    { name: part.nav, url: path },
  ];

  return (
    <div className="page">
      <ResearchView title={part.heading} path={path} />
      <JsonLd
        data={[
          generateBreadcrumbSchema(crumbs),
          generateScholarlyArticleSchema({
            title: `${part.heading} — ${ONTOLOGY.title}`,
            description: part.heading,
            url: path,
            datePublished: ONTOLOGY.datePublished,
            version: ONTOLOGY.version,
            keywords: ["mathematical ontology"],
          }),
        ]}
      />
      <div className="site-wrap split split-nav">
        <OntologyNav current={slug} />
        <article>
          <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
          <p className="kicker">
            {ONTOLOGY.title} · Version {ONTOLOGY.version}
          </p>
          <MarkdownBody>{section.body}</MarkdownBody>
          <nav className="artifact-links" aria-label="Part navigation" style={{ marginTop: "2rem" }}>
            {prev && (
              <Link className="artifact-link" href={ontologyPartPath(prev.slug)}>
                Previous: {prev.nav}
              </Link>
            )}
            {next && (
              <Link className="artifact-link" href={ontologyPartPath(next.slug)}>
                Next: {next.nav}
              </Link>
            )}
            <Link className="artifact-link" href="/research/mathematics-ontology-bible">
              Overview
            </Link>
          </nav>
        </article>
      </div>
    </div>
  );
}

import Link from "next/link";
import { generatePageMetadata, generateScholarlyArticleSchema, generateBreadcrumbSchema } from "@/utils/seo";
import { ONTOLOGY, ONTOLOGY_PARTS, ontologyPartPath } from "@/lib/ontology";
import { readContent, splitMarkdownSections } from "@/lib/content";
import MarkdownBody from "@/components/site/MarkdownBody";
import PublicationHeader from "@/components/site/PublicationHeader";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import OntologyNav from "@/components/site/OntologyNav";
import JsonLd from "@/components/site/JsonLd";
import ResearchView from "@/components/site/ResearchView";

export const metadata = generatePageMetadata({
  title: ONTOLOGY.title,
  description: `${ONTOLOGY.subtitle}. Canonical reference by ${ONTOLOGY.author} / ${ONTOLOGY.affiliation}, version ${ONTOLOGY.version}.`,
  keywords: [
    "mathematical ontology",
    "checkability",
    "logical foundations",
    "set theory",
    "epistemic infrastructure",
    "LLM governance",
  ],
  url: "/research/mathematics-ontology-bible",
  type: "article",
  publishedTime: ONTOLOGY.datePublished,
  authors: [ONTOLOGY.author],
});

function prefaceAndPrimer(markdown) {
  const sections = splitMarkdownSections(markdown, /^## /);
  const preface = sections.find((section) => section.heading.startsWith("Preface"));
  const primer = sections.find((section) =>
    section.heading.startsWith("Ontological Positions")
  );
  return { preface, primer };
}

export default function OntologyHubPage() {
  const markdown = readContent(ONTOLOGY.file);
  const { preface, primer } = prefaceAndPrimer(markdown);
  const path = "/research/mathematics-ontology-bible";
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
    { name: ONTOLOGY.title, url: path },
  ];

  const artifacts = [
    { href: path, label: "Read online" },
    {
      href: ONTOLOGY.docx,
      label: "Download Word",
      download: true,
      fileName: "Mathematics_Ontology_Bible.docx",
      fileType: "docx",
    },
    {
      href: ONTOLOGY.markdown,
      label: "Download Markdown",
      download: true,
      fileName: "Mathematics_Ontology_Bible.md",
      fileType: "md",
    },
    { href: "/llm-governance-toolkit", label: "LLM Governance Toolkit" },
  ];

  return (
    <div className="page">
      <ResearchView title={ONTOLOGY.title} path={path} />
      <JsonLd
        data={[
          generateBreadcrumbSchema(crumbs),
          generateScholarlyArticleSchema({
            title: ONTOLOGY.title,
            description: ONTOLOGY.subtitle,
            url: path,
            datePublished: ONTOLOGY.datePublished,
            version: ONTOLOGY.version,
            keywords: ["mathematical ontology", "checkability", "epistemic infrastructure"],
            downloadUrl: ONTOLOGY.docx,
          }),
        ]}
      />
      <div className="site-wrap split split-nav">
        <OntologyNav current="" />
        <article>
          <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
          <PublicationHeader
            kicker="Reference"
            title={ONTOLOGY.title}
            subtitle={ONTOLOGY.subtitle}
            author={ONTOLOGY.author}
            affiliation={ONTOLOGY.affiliation}
            dateLabel={ONTOLOGY.dateLabel}
            version={ONTOLOGY.version}
            type="Canonical reference"
            artifacts={artifacts}
          />

          <section>
            <h2>Overview</h2>
            <p>
              This is a complete ontological map of mathematics — a reference that
              answers, for every major domain: what objects exist here, what
              structures govern them, what can be proven, what is left open, and
              how this domain depends on or gives rise to others. Three commitments
              run through every section: ontological honesty, checkability, and
              dependency.
            </p>
            <p>
              The document is part of a larger program — the LLM Governance
              Toolkit&apos;s epistemic infrastructure — and{" "}
              <Link href={ontologyPartPath("epistemic-mathematics")}>Part XII</Link>{" "}
              connects mathematics explicitly to that program.{" "}
              <Link href={ontologyPartPath("appendix-toolkit-crosswalk")}>
                Appendix C
              </Link>{" "}
              cross-references mathematical concepts to toolkit components.
            </p>
          </section>

          {preface && (
            <section>
              <MarkdownBody>{preface.body}</MarkdownBody>
              <p>
                <Link href={ontologyPartPath("preface")}>Open the preface page</Link>
              </p>
            </section>
          )}

          <section>
            <h2>Table of contents</h2>
            <ol>
              {ONTOLOGY_PARTS.map((part) => (
                <li key={part.slug}>
                  <Link href={ontologyPartPath(part.slug)}>{part.heading}</Link>
                </li>
              ))}
            </ol>
          </section>

          {primer && (
            <section>
              <h2>Key concepts</h2>
              <p className="muted">
                The primer records live positions — Platonism, formalism,
                structuralism, intuitionism, empiricism — and states that this
                document uses the language of structural Platonism without settling
                whether structures exist beyond human minds.
              </p>
              <p>
                <Link href={ontologyPartPath("ontological-positions")}>
                  Read ontological positions
                </Link>
                {" · "}
                <Link href={ontologyPartPath("epistemic-mathematics")}>
                  Epistemic / checkability concepts
                </Link>
              </p>
            </section>
          )}

          <section>
            <h2>Citation</h2>
            <pre className="cite">
{`${ONTOLOGY.author} (${ONTOLOGY.datePublished.slice(0, 4)}). ${ONTOLOGY.title}: ${ONTOLOGY.subtitle}. Version ${ONTOLOGY.version}. ${ONTOLOGY.affiliation}. https://vamossy.com${path}`}
            </pre>
          </section>
        </article>
      </div>
    </div>
  );
}

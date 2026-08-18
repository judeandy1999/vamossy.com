import { notFound } from "next/navigation";
import { generatePageMetadata, generateScholarlyArticleSchema, generateBreadcrumbSchema } from "@/utils/seo";
import { getRenderablePublications, getPublication, publicationPath } from "@/lib/publications";
import { readContent } from "@/lib/content";
import MarkdownBody from "@/components/site/MarkdownBody";
import PublicationHeader from "@/components/site/PublicationHeader";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import ResearchView from "@/components/site/ResearchView";
import Link from "next/link";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return getRenderablePublications().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pub = getPublication(slug);
  if (!pub) return {};
  return generatePageMetadata({
    title: pub.title,
    description: pub.description,
    keywords: pub.keywords || [],
    url: publicationPath(pub),
    type: "article",
    publishedTime: pub.datePublished,
    authors: [pub.author],
  });
}

export default async function ResearchArticlePage({ params }) {
  const { slug } = await params;
  const pub = getPublication(slug);
  if (!pub || !pub.file) notFound();

  const markdown = readContent(pub.file);
  const path = publicationPath(pub);
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
    { name: pub.title, url: path },
  ];

  const artifacts = [
    { href: path, label: "Read online" },
    ...(pub.pdf
      ? [{ href: pub.pdf, label: "Download PDF", download: true, fileName: pub.pdf.split("/").pop(), fileType: "pdf" }]
      : []),
    ...(pub.docx
      ? [{ href: pub.docx, label: "Download Word", download: true, fileName: pub.docx.split("/").pop(), fileType: "docx" }]
      : []),
    ...(pub.markdown
      ? [{ href: pub.markdown, label: "Download Markdown", download: true, fileName: pub.markdown.split("/").pop(), fileType: "md" }]
      : []),
    { href: SITE.github, label: "View source / repository" },
  ];

  const citation = `${pub.author} (${pub.datePublished?.slice(0, 4) || "2026"}). ${pub.title}. ${SITE.url}${path}`;

  return (
    <div className="page">
      <ResearchView title={pub.title} path={path} />
      <JsonLd
        data={[
          generateBreadcrumbSchema(crumbs),
          generateScholarlyArticleSchema({
            title: pub.title,
            description: pub.description,
            url: path,
            datePublished: pub.datePublished,
            version: pub.version,
            keywords: pub.keywords || [],
            downloadUrl: pub.pdf || pub.docx || pub.markdown,
          }),
        ]}
      />
      <article className="site-wrap">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
        <PublicationHeader
          kicker={pub.type}
          title={pub.title}
          subtitle={pub.subtitle}
          author={pub.author}
          affiliation={pub.affiliation}
          dateLabel={pub.dateLabel}
          version={pub.version}
          type={pub.type}
          artifacts={artifacts}
        />
        <MarkdownBody>{markdown}</MarkdownBody>

        <section className="section" style={{ borderBottom: "none" }}>
          <h2>Related research</h2>
          <ul>
            <li>
              <Link href="/llm-governance-toolkit">LLM Governance Toolkit</Link>
            </li>
            <li>
              <Link href="/research/mathematics-ontology-bible">
                The Mathematics Ontology Bible
              </Link>
            </li>
            <li>
              <Link href="/research">All publications</Link>
            </li>
          </ul>
          <h2>Citation</h2>
          <pre className="cite">{citation}</pre>
        </section>
      </article>
    </div>
  );
}

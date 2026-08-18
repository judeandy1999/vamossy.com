import Link from "next/link";
import { generatePageMetadata } from "@/utils/seo";
import { PUBLICATIONS, publicationPath } from "@/lib/publications";
import JsonLd from "@/components/site/JsonLd";
import { SITE, absUrl } from "@/lib/site";

export const metadata = generatePageMetadata({
  title: "Gergely Vámossy — AI/LLM Governance Research",
  description:
    "Research publication platform for Gergely Vámossy's work on AI/LLM governance, epistemic infrastructure, mathematical ontology, and machine-checkable non-self-approval.",
  keywords: [
    "Gergely Vámossy",
    "LLM governance",
    "AI governance",
    "mathematical ontology",
    "non-self-approval",
    "QIERA",
  ],
  url: "/",
});

const TOPICS = [
  "AI/LLM governance",
  "Epistemic infrastructure",
  "Mathematical ontology",
  "Machine-checkable governance",
  "AI-assisted reasoning",
  "Human authority and validation",
];

export default function HomePage() {
  const featured = PUBLICATIONS.filter((item) => item.featured);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: SITE.title,
          url: absUrl("/"),
          about: "AI/LLM governance research by Gergely Vámossy",
        }}
      />
      <section className="hero">
        <div className="site-wrap">
          <p className="kicker">Research / publication</p>
          <h1>Gergely Vámossy</h1>
          <p className="hero-lede">
            Work on AI/LLM governance, epistemic infrastructure, mathematical
            ontology, and machine-checkable methods that let a model reason
            without letting it rule. This site is a research publication
            platform: each artifact has a permanent URL, crawlable HTML, and a
            link to its canonical download where one exists.
          </p>
          <ul className="hero-links">
            <li>
              <Link href="/llm-governance-toolkit">LLM Governance Toolkit</Link>
            </li>
            <li>
              <Link href="/research/non-self-approving-ai-assisted-derivation">
                Non-Self-Approving AI-Assisted Derivation
              </Link>
            </li>
            <li>
              <Link href="/research/mathematics-ontology-bible">
                Mathematics Ontology Bible
              </Link>
            </li>
            <li>
              <Link href="/research">Research / Publications</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="site-wrap">
          <h2>Research focus</h2>
          <ul className="topic-list">
            {TOPICS.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: "1.2rem", maxWidth: "62ch" }}>
            The method published here governs authority, not correctness. It
            keeps adoption separate from validation, reports unresolved
            dependencies in the open, and treats human signature slots as
            load-bearing. Where a source marks a claim as a candidate or a
            recommendation, this site keeps that status.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-wrap">
          <h2>Featured publications</h2>
          <ul className="pub-list">
            {featured.map((item) => (
              <li key={item.slug} className="pub-item">
                <p className="pub-type">
                  {item.type} · {item.dateLabel}
                </p>
                <h3 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "1.35rem" }}>
                  <Link href={publicationPath(item)}>{item.title}</Link>
                </h3>
                <p>{item.description}</p>
                <p className="pub-actions">
                  <Link href={publicationPath(item)}>Read online</Link>
                  {item.pdf && (
                    <>
                      {" · "}
                      <a href={item.pdf}>Download PDF</a>
                    </>
                  )}
                  {item.docx && (
                    <>
                      {" · "}
                      <a href={item.docx}>Download Word</a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

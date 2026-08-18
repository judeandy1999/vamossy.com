import Link from "next/link";
import { generatePageMetadata, generatePersonSchema, generateBreadcrumbSchema } from "@/utils/seo";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import ArtifactLinks from "@/components/site/ArtifactLinks";
import { SITE } from "@/lib/site";

export const metadata = generatePageMetadata({
  title: "About Gergely Vámossy",
  description:
    "Gergely Vámossy / QIERA. Independent research on AI/LLM governance, epistemic infrastructure, and mathematical ontology. Contact: gergo@qiera.io.",
  keywords: ["Gergely Vámossy", "QIERA", "LLM governance"],
  url: "/about",
});

export default function AboutPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ];

  return (
    <div className="page">
      <JsonLd data={[generateBreadcrumbSchema(crumbs), generatePersonSchema()]} />
      <div className="site-wrap" style={{ maxWidth: "720px" }}>
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
        <p className="kicker">About</p>
        <h1>Gergely Vámossy</h1>
        <p className="lede">
          Independent researcher. The supplied papers identify the author as Gergely
          Vámossy, affiliated with QIERA, and in places as a self-taught practitioner
          writing applied synthesis rather than novel theory.
        </p>

        <h2>Research focus</h2>
        <ul>
          <li>AI/LLM governance</li>
          <li>Epistemic infrastructure</li>
          <li>Mathematical ontology</li>
          <li>Machine-checkable governance</li>
          <li>AI-assisted reasoning with human-only authority</li>
        </ul>

        <h2>QIERA</h2>
        <p>
          QIERA appears in the source materials as the affiliation on the Mathematics
          Ontology Bible and as the name of an epistemic-governance overlay for LLM
          workflows. The overlay wraps thinking, not doing: it produces artifacts, not
          actions, and keeps human authority absolute. See{" "}
          <Link href="/research/qiera-epistemic-governance-framework">
            QIERA — An Epistemic-Governance Overlay for LLM Workflows
          </Link>
          .
        </p>

        <h2>Contact</h2>
        <p>
          Email published in the research documents:{" "}
          <a href={`mailto:${SITE.author.email}`}>{SITE.author.email}</a>
        </p>
        <ArtifactLinks
          items={[
            {
              href: `mailto:${SITE.author.email}`,
              label: "Email gergo@qiera.io",
              kind: "contact",
              method: "email",
            },
            { href: SITE.github, label: "GitHub repository" },
          ]}
        />
        <p className="muted">
          This page uses only information present in the supplied research materials.
          It does not add biography, credentials, or affiliations beyond those sources.
        </p>
      </div>
    </div>
  );
}

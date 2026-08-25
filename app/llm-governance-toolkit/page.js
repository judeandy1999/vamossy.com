import Link from "next/link";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/utils/seo";
import { TOOLKIT, componentGroups } from "@/lib/toolkit";
import { readContent } from "@/lib/content";
import MarkdownBody from "@/components/site/MarkdownBody";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import ToolkitNav from "@/components/site/ToolkitNav";
import JsonLd from "@/components/site/JsonLd";
import ArtifactLinks from "@/components/site/ArtifactLinks";
import { SITE } from "@/lib/site";

export const metadata = generatePageMetadata({
  title: "LLM Governance Toolkit",
  description: TOOLKIT.description,
  keywords: [
    "LLM governance toolkit",
    "AI governance",
    "non-self-approval",
    "knowledge maturity",
    "Goodhart auditor",
  ],
  url: "/llm-governance-toolkit",
});

export default function ToolkitOverviewPage() {
  const readme = readContent("toolkit/README.md");
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "LLM Governance Toolkit", url: "/llm-governance-toolkit" },
  ];
  const groups = componentGroups();

  return (
    <div className="page">
      <JsonLd
        data={[
          generateBreadcrumbSchema(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: TOOLKIT.title,
            description: TOOLKIT.description,
            url: `${SITE.url}/llm-governance-toolkit`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Python",
            license: "https://opensource.org/licenses/MIT",
            author: {
              "@type": "Person",
              name: SITE.author.name,
            },
            codeRepository: SITE.github,
          },
        ]}
      />
      <div className="site-wrap split split-nav">
        <ToolkitNav current="" />
        <article>
          <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
          <p className="kicker">Toolkit</p>
          <h1>{TOOLKIT.title}</h1>
          <p className="lede">{TOOLKIT.description}</p>
          <ArtifactLinks
            items={[
              { href: SITE.github, label: "View source / repository" },
              { href: "/llm-governance-toolkit/downloads", label: "Downloads" },
              {
                href: "/research/non-self-approving-ai-assisted-derivation",
                label: "Main paper",
              },
              {
                href: "/research/seven-layer-governance",
                label: "Seven-layer governance",
              },
            ]}
          />

          <section>
            <h2>Components at a glance</h2>
            {groups.map((group) => (
              <div key={group.name}>
                <h3>{group.name}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/llm-governance-toolkit/${item.slug}`}>{item.title}</Link>
                      {" — "}
                      {item.summary}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <MarkdownBody>{readme}</MarkdownBody>
        </article>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/utils/seo";
import {
  TOOLKIT,
  TOOLKIT_SECTIONS,
  COMPONENTS,
  PATTERNS,
  getComponent,
  getPattern,
  githubBlob,
  componentGroups,
} from "@/lib/toolkit";
import { PUBLICATIONS, publicationPath } from "@/lib/publications";
import { ONTOLOGY, ontologyPartPath } from "@/lib/ontology";
import { readContent, contentExists, splitMarkdownSections } from "@/lib/content";
import MarkdownBody from "@/components/site/MarkdownBody";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import ToolkitNav from "@/components/site/ToolkitNav";
import JsonLd from "@/components/site/JsonLd";
import ArtifactLinks from "@/components/site/ArtifactLinks";
import { SITE } from "@/lib/site";

const SECTION_SLUGS = TOOLKIT_SECTIONS.map((item) => item.slug).filter(Boolean);

export function generateStaticParams() {
  return [
    ...SECTION_SLUGS.map((slug) => ({ slug })),
    ...COMPONENTS.map((item) => ({ slug: item.slug })),
    ...PATTERNS.map((item) => ({ slug: item.slug })),
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const section = TOOLKIT_SECTIONS.find((item) => item.slug === slug);
  const component = getComponent(slug);
  const pattern = getPattern(slug);
  const title = component?.title || pattern?.title || section?.label || slug;
  const description =
    component?.summary || pattern?.summary || `${title} in the LLM Governance Toolkit.`;
  return generatePageMetadata({
    title: `${title} — LLM Governance Toolkit`,
    description,
    keywords: ["LLM governance toolkit", title],
    url: `/llm-governance-toolkit/${slug}`,
  });
}

function readmeSection(heading, { startsWith = false } = {}) {
  const sections = splitMarkdownSections(readContent("toolkit/README.md"), /^## /);
  const match = sections.find((item) =>
    startsWith ? item.heading.startsWith(heading) : item.heading === heading
  );
  return match?.body || "";
}

function SectionPage({ slug, crumbs }) {
  if (slug === "architecture") {
    return (
      <>
        <h1>Architecture</h1>
        <p className="lede">
          The toolkit is one family of applied AI-governance components, not a stack of
          unrelated kits. The source map is the Governance Family architecture note.
        </p>
        <MarkdownBody>{readContent("papers/Governance_Family_Architecture.md")}</MarkdownBody>
      </>
    );
  }

  if (slug === "principles") {
    return (
      <>
        <h1>Governance principles</h1>
        <MarkdownBody>{readmeSection("The one idea underneath all of it")}</MarkdownBody>
        <MarkdownBody>{readmeSection("The reachability of the ground truth")}</MarkdownBody>
        <MarkdownBody>
          {readmeSection("Honest positioning (read this before publishing or presenting)")}
        </MarkdownBody>
      </>
    );
  }

  if (slug === "components") {
    const groups = componentGroups();
    return (
      <>
        <h1>Components</h1>
        <p className="lede">
          Descriptions below are taken from the toolkit README, architecture index, and
          accompanying design notes. They do not claim capabilities beyond those sources.
        </p>
        {groups.map((group) => (
          <section key={group.name}>
            <h2>{group.name}</h2>
            <div className="component-grid">
              {group.items.map((item) => (
                <article key={item.slug} className="component-card">
                  <h3>
                    <Link href={`/llm-governance-toolkit/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="muted">
                    <code>
                      {item.dir}/{item.file}
                    </code>
                  </p>
                  <p>{item.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </>
    );
  }

  if (slug === "methodology") {
    return (
      <>
        <h1>Methodology</h1>
        <MarkdownBody>{readmeSection("What's here")}</MarkdownBody>
        <MarkdownBody>{readmeSection("The consolidation layer")}</MarkdownBody>
        <MarkdownBody>{readmeSection("Quick start")}</MarkdownBody>
        <p>
          Self-tests are run as <code>python &lt;file&gt;.py</code>. No dependencies
          beyond the Python standard library for the core tools. The compliance layer
          additionally needs PyYAML and jsonschema.
        </p>
      </>
    );
  }

  if (slug === "examples") {
    const examples = PUBLICATIONS.filter((item) =>
      ["Case study", "Study", "Results"].includes(item.type)
    );
    return (
      <>
        <h1>Examples</h1>
        <p className="lede">
          Worked examples from the main paper and runnable case studies shipped with
          the toolkit.
        </p>
        <h2>From the main paper</h2>
        <ul>
          <li>
            <Link href="/research/non-self-approving-ai-assisted-derivation">
              Foundational-primitive derivation
            </Link>
          </li>
          <li>
            <Link href="/research/non-self-approving-ai-assisted-derivation">
              High-consequence assessment (consciousness, sentience, ASI)
            </Link>
          </li>
        </ul>
        <h2>Case studies and results</h2>
        <ul>
          {examples.map((item) => (
            <li key={item.slug}>
              <Link href={publicationPath(item)}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (slug === "verification") {
    return (
      <>
        <h1>Tests / verification</h1>
        <p className="lede">
          Every tool runs its own self-test. Published result notes are reproduced
          below as HTML.
        </p>
        <p>
          <Link href="/research/empirical-stress-test">
            Empirical stress test of the governance toolkit
          </Link>
          {" · "}
          <Link href="/research/capable-agent-cage-stress-test">
            Capable-agent cage stress test
          </Link>
        </p>
        <MarkdownBody>{readContent("papers/Stress_Test_Results.md")}</MarkdownBody>
      </>
    );
  }

  if (slug === "research-crosswalk") {
    const appendix = splitMarkdownSections(
      readContent("ontology/Math_Ontology_Bible.md"),
      /^## /
    ).find((item) => item.heading.startsWith("Appendix C"));
    return (
      <>
        <h1>Research crosswalk</h1>
        <ul>
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
            <Link href={ontologyPartPath("appendix-toolkit-crosswalk")}>
              Appendix C — math-to-toolkit map
            </Link>
          </li>
          <li>
            <Link href="/research/ref-literature-crosswalk">
              Foundational ontology literature crosswalk
            </Link>
          </li>
          <li>
            <Link href="/research/cem-sai-consciousness-crosswalk">
              Consciousness / sentience / ASI crosswalk
            </Link>
          </li>
          <li>
            <Link href="/research/assurance-case-integrity-crosswalk">
              Assurance-case integrity crosswalk
            </Link>
          </li>
        </ul>
        {appendix && <MarkdownBody>{appendix.body}</MarkdownBody>}
      </>
    );
  }

  if (slug === "compliance") {
    const compliance = contentExists("toolkit/compliance/README.md")
      ? readContent("toolkit/compliance/README.md")
      : "";
    return (
      <>
        <h1>Compliance layer</h1>
        <MarkdownBody>{readmeSection("Compliance layer", { startsWith: true })}</MarkdownBody>
        {compliance && <MarkdownBody>{compliance}</MarkdownBody>}
        <p className="muted">
          Mapping a control to an article is not a conformity assessment, and none of
          it is legal advice. Source: toolkit README and compliance-toolkit docs.
        </p>
      </>
    );
  }

  if (slug === "downloads") {
    return (
      <>
        <h1>Downloads</h1>
        <p className="lede">
          Canonical research files are published here. The development ZIP is not
          mirrored onto the site. Source code lives in the public GitHub repository.
        </p>
        <ArtifactLinks
          items={[
            {
              href: "/downloads/non-self-approving-ai-assisted-derivation.pdf",
              label: "Download paper PDF",
              download: true,
              fileName: "non-self-approving-ai-assisted-derivation.pdf",
              fileType: "pdf",
            },
            {
              href: "/downloads/Mathematics_Ontology_Bible.docx",
              label: "Download Mathematics Ontology Bible (Word)",
              download: true,
              fileName: "Mathematics_Ontology_Bible.docx",
              fileType: "docx",
            },
            {
              href: "/downloads/Mathematics_Ontology_Bible.md",
              label: "Download Mathematics Ontology Bible (Markdown)",
              download: true,
              fileName: "Mathematics_Ontology_Bible.md",
              fileType: "md",
            },
            { href: SITE.github, label: "View source / repository" },
          ]}
        />
      </>
    );
  }

  return null;
}

export default async function ToolkitSlugPage({ params }) {
  const { slug } = await params;
  const section = TOOLKIT_SECTIONS.find((item) => item.slug === slug);
  const component = getComponent(slug);
  const pattern = getPattern(slug);
  if (!section && !component && !pattern) notFound();

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "LLM Governance Toolkit", url: "/llm-governance-toolkit" },
    {
      name: component?.title || pattern?.title || section?.label || slug,
      url: `/llm-governance-toolkit/${slug}`,
    },
  ];

  let body = null;
  if (component) {
    const note = component.note && contentExists(component.note)
      ? readContent(component.note)
      : "";
    body = (
      <>
        <h1>{component.title}</h1>
        <p className="lede">{component.summary}</p>
        <dl className="pub-meta">
          <dt>File</dt>
          <dd>
            <code>
              {component.dir}/{component.file}
            </code>
          </dd>
          <dt>Group</dt>
          <dd>{component.group}</dd>
        </dl>
        <ArtifactLinks
          items={[
            {
              href: githubBlob(component.dir, component.file),
              label: "View source on GitHub",
            },
            { href: "/llm-governance-toolkit", label: "Toolkit overview" },
          ]}
        />
        {component.figure && (
          <p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={component.figure}
              alt={`${component.title} figure from the toolkit source materials`}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </p>
        )}
        {note ? (
          <MarkdownBody>{note}</MarkdownBody>
        ) : (
          <p className="muted">
            No separate design note is published for this file. The description
            above is taken from the toolkit README and architecture index. See the
            source on GitHub for the implementation and self-test.
          </p>
        )}
      </>
    );
  } else if (pattern) {
    body = (
      <>
        <h1>{pattern.title}</h1>
        <p className="lede">{pattern.summary}</p>
        {pattern.related && (
          <p>
            Related paper: <Link href={pattern.related}>read the HTML publication</Link>
          </p>
        )}
        <MarkdownBody>{readContent(pattern.file)}</MarkdownBody>
      </>
    );
  } else {
    body = <SectionPage slug={slug} crumbs={crumbs} />;
    if (!body) notFound();
  }

  return (
    <div className="page">
      <JsonLd data={generateBreadcrumbSchema(crumbs)} />
      <div className="site-wrap split split-nav">
        <ToolkitNav current={section ? slug : "components"} />
        <article>
          <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.url }))} />
          {body}
        </article>
      </div>
    </div>
  );
}

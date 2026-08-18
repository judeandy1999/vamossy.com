import { PUBLICATIONS, publicationPath } from "@/lib/publications";
import { COMPONENTS, PATTERNS, TOOLKIT_SECTIONS } from "@/lib/toolkit";
import { ONTOLOGY_PARTS, ontologyPartPath } from "@/lib/ontology";
import { SITE, absUrl } from "@/lib/site";

export default function sitemap() {
  const lastModified = new Date("2026-08-18");
  const routes = [
    { url: absUrl("/"), priority: 1, changeFrequency: "weekly" },
    { url: absUrl("/research"), priority: 0.9, changeFrequency: "weekly" },
    { url: absUrl("/llm-governance-toolkit"), priority: 0.9, changeFrequency: "weekly" },
    { url: absUrl("/about"), priority: 0.6, changeFrequency: "monthly" },
    { url: absUrl("/search"), priority: 0.3, changeFrequency: "monthly" },
  ];

  for (const pub of PUBLICATIONS) {
    routes.push({
      url: absUrl(publicationPath(pub)),
      lastModified: pub.datePublished ? new Date(pub.datePublished) : lastModified,
      changeFrequency: "monthly",
      priority: pub.featured ? 0.85 : 0.7,
    });
  }

  for (const section of TOOLKIT_SECTIONS) {
    if (section.href && section.href !== "/llm-governance-toolkit") {
      routes.push({
        url: absUrl(section.href),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.65,
      });
    }
  }

  for (const component of COMPONENTS) {
    routes.push({
      url: absUrl(`/llm-governance-toolkit/${component.slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  for (const pattern of PATTERNS) {
    routes.push({
      url: absUrl(`/llm-governance-toolkit/${pattern.slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  for (const part of ONTOLOGY_PARTS) {
    routes.push({
      url: absUrl(ontologyPartPath(part.slug)),
      lastModified: new Date("2026-08-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  const seen = new Set();
  return routes.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  }).map((entry) => ({
    ...entry,
    lastModified: entry.lastModified || lastModified,
  }));
}

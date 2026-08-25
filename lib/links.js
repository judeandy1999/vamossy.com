import { PUBLICATIONS, publicationPath } from "./publications";
import { COMPONENTS, PATTERNS, TOOLKIT_SECTIONS } from "./toolkit";
import { ONTOLOGY_PARTS, ontologyPartPath } from "./ontology";
import { SEVEN_LAYER_GOVERNANCE } from "./sevenLayerGovernance";

const FILE_MAP = {
  "non_self_approving_derivation.md":
    "/research/non-self-approving-ai-assisted-derivation",
  "Math_Ontology_Bible.md": "/research/mathematics-ontology-bible",
  "QIERA_Epistemic_Governance_Framework.md":
    "/research/qiera-epistemic-governance-framework",
  "REF_Literature_Crosswalk.md": "/research/ref-literature-crosswalk",
  "CEM_SAI_Consciousness_Crosswalk.md":
    "/research/cem-sai-consciousness-crosswalk",
  "Governance_Family_Architecture.md": "/research/governance-family-architecture",
  "README_goodhart_auditor.md": "/llm-governance-toolkit/goodhart-auditor",
  "README_knowledge_maturity.md": "/llm-governance-toolkit/knowledge-maturity",
};

for (const pub of PUBLICATIONS) {
  if (pub.file) {
    const name = pub.file.split("/").pop();
    FILE_MAP[name] = publicationPath(pub);
  }
}

for (const component of COMPONENTS) {
  FILE_MAP[component.file] = `/llm-governance-toolkit/${component.slug}`;
  if (component.note) {
    FILE_MAP[component.note.split("/").pop()] =
      `/llm-governance-toolkit/${component.slug}`;
  }
}

for (const pattern of PATTERNS) {
  FILE_MAP[pattern.file.split("/").pop()] =
    `/llm-governance-toolkit/${pattern.slug}`;
}

const IMAGE_MAP = {
  "decoupling_monitor_fig.png": "/images/toolkit/decoupling_monitor_fig.png",
  "ground_truth_auditor_fig.png": "/images/toolkit/ground_truth_auditor_fig.png",
  "optimal_timing_fig.png": "/images/toolkit/optimal_timing_fig.png",
};

export function rewriteHref(href = "") {
  if (!href || href.startsWith("#") || href.startsWith("mailto:")) return href;
  if (/^https?:\/\//i.test(href)) return href;

  const cleaned = href.split("?")[0].split("#")[0];
  const name = cleaned.split("/").pop();
  if (FILE_MAP[name]) {
    const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
    return `${FILE_MAP[name]}${hash}`;
  }
  if (IMAGE_MAP[name]) return IMAGE_MAP[name];
  if (name.endsWith(".py")) {
    return `https://github.com/Gergo89/llm-governance-toolkit`;
  }
  return href;
}

export function allPublicRoutes() {
  const routes = new Set([
    "/",
    "/research",
    "/about",
    "/search",
    "/llm-governance-toolkit",
    "/research/mathematics-ontology-bible",
    "/research/seven-layer-governance",
  ]);

  for (const pub of PUBLICATIONS) routes.add(publicationPath(pub));
  for (const section of TOOLKIT_SECTIONS) {
    if (section.href) routes.add(section.href);
  }
  for (const component of COMPONENTS) {
    routes.add(`/llm-governance-toolkit/${component.slug}`);
  }
  for (const pattern of PATTERNS) {
    routes.add(`/llm-governance-toolkit/${pattern.slug}`);
  }
  for (const part of ONTOLOGY_PARTS) {
    routes.add(ontologyPartPath(part.slug));
  }
  for (const layer of SEVEN_LAYER_GOVERNANCE.layers) {
    routes.add(layer.path);
  }
  return [...routes];
}

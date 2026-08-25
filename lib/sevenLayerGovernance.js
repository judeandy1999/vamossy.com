/**
 * Seven-Layer Governance Architecture
 *
 * Structured content model for a research program in preparation.
 * Fill the empty fields as Gergely supplies material. Do not invent
 * descriptions, relationships, evidence, or validation status.
 */

const EMPTY_LAYER_FIELDS = {
  description: null,
  formalDefinition: null,
  evidence: [],
  equations: [],
  proofs: [],
  references: [],
  dependencies: [],
  relatedLayers: [],
  openQuestions: [],
  validationStatus: "not_supplied",
  artifacts: [],
  notes: [],
  diagrams: [],
  methodology: null,
  experiments: [],
  datasets: [],
};

function defineLayer(number, slug, name) {
  return {
    number,
    slug,
    name,
    heading: `Layer ${number} — ${name}`,
    href: `/research/seven-layer-governance#${slug}`,
    path: `/research/seven-layer-governance/${slug}`,
    ...EMPTY_LAYER_FIELDS,
  };
}

export const SEVEN_LAYER_GOVERNANCE = {
  slug: "seven-layer-governance",
  path: "/research/seven-layer-governance",
  title: "Seven-Layer Governance Architecture",
  subtitle: "A research framework in preparation",
  author: "Gergely Vámossy",
  affiliation: "QIERA",
  authorTerm: "god infra",
  type: "Research program",
  version: "0.1-prep",
  status: {
    label: "Preparation / Research Development",
    currentPhase: "1-month preparation",
    framework: "Seven-layer governance architecture",
    creativeWorkStatus: "In development",
  },
  developmentPhases: [
    {
      id: 1,
      name: "Research preparation",
      status: "in_progress",
    },
    {
      id: 2,
      name: "Layer definitions",
      status: "not_started",
    },
    {
      id: 3,
      name: "Formal mathematical/technical framework",
      status: "not_started",
    },
    {
      id: 4,
      name: "Evidence and validation",
      status: "not_started",
    },
    {
      id: 5,
      name: "Full publication",
      status: "not_started",
    },
  ],
  layers: [
    defineLayer(1, "mathematics", "Mathematics"),
    defineLayer(2, "physics", "Physics"),
    defineLayer(3, "chemistry", "Chemistry"),
    defineLayer(4, "biology", "Biology"),
    defineLayer(5, "evolution", "Evolution"),
    defineLayer(6, "human-qualia", "Human Qualia"),
    defineLayer(7, "god-electromagnetic-governance", "God / Electromagnetic Governance"),
  ],
  relatedResearch: [
    {
      href: "/llm-governance-toolkit",
      title: "LLM Governance Toolkit",
    },
    {
      href: "/research/mathematics-ontology-bible",
      title: "The Mathematics Ontology Bible",
    },
    {
      href: "/research/non-self-approving-ai-assisted-derivation",
      title: "Non-Self-Approving AI-Assisted Derivation",
    },
    {
      href: "/research",
      title: "Research / Publications",
    },
  ],
};

export function getSevenLayer(slug) {
  return SEVEN_LAYER_GOVERNANCE.layers.find((layer) => layer.slug === slug);
}

export function layerHasMaterial(layer) {
  return Boolean(
    layer.description ||
      layer.formalDefinition ||
      layer.methodology ||
      layer.evidence.length ||
      layer.equations.length ||
      layer.proofs.length ||
      layer.references.length ||
      layer.artifacts.length ||
      layer.notes.length ||
      layer.diagrams.length ||
      layer.experiments.length ||
      layer.datasets.length
  );
}

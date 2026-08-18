export const ONTOLOGY = {
  slug: "mathematics-ontology-bible",
  title: "The Mathematics Ontology Bible",
  subtitle: "A Complete Map of Mathematical Structure, from Foundations to Frontiers",
  author: "Gergely Vámossy",
  affiliation: "QIERA",
  email: "gergo@qiera.io",
  version: "1.0",
  datePublished: "2026-08-01",
  dateLabel: "August 2026",
  license: "MIT. All mathematical content is in the public domain.",
  file: "ontology/Math_Ontology_Bible.md",
  docx: "/downloads/Mathematics_Ontology_Bible.docx",
  markdown: "/downloads/Mathematics_Ontology_Bible.md",
};

export const ONTOLOGY_PARTS = [
  {
    slug: "preface",
    heading: "Preface: What This Document Is",
    nav: "Preface",
  },
  {
    slug: "ontological-positions",
    heading: "Ontological Positions: A Primer",
    nav: "Ontological positions",
  },
  {
    slug: "logical-foundations",
    heading: "Part I: Logical Foundations",
    nav: "I. Logical foundations",
  },
  {
    slug: "set-theory",
    heading: "Part II: Set Theory and the Axiom System",
    nav: "II. Set theory",
  },
  {
    slug: "category-theory",
    heading: "Part III: Category Theory — The Language of Structure",
    nav: "III. Category theory",
  },
  {
    slug: "number-hierarchy",
    heading: "Part IV: The Number Hierarchy",
    nav: "IV. Number hierarchy",
  },
  {
    slug: "algebraic-structures",
    heading: "Part V: Algebraic Structures",
    nav: "V. Algebraic structures",
  },
  {
    slug: "geometric-and-topological-structures",
    heading: "Part VI: Geometric and Topological Structures",
    nav: "VI. Geometry and topology",
  },
  {
    slug: "analysis",
    heading: "Part VII: Analysis",
    nav: "VII. Analysis",
  },
  {
    slug: "combinatorics-and-discrete-mathematics",
    heading: "Part VIII: Combinatorics and Discrete Mathematics",
    nav: "VIII. Combinatorics",
  },
  {
    slug: "computational-mathematics-and-logic",
    heading: "Part IX: Computational Mathematics and Logic",
    nav: "IX. Computation and logic",
  },
  {
    slug: "metamathematics",
    heading: "Part X: Metamathematics — Proof Theory and Model Theory",
    nav: "X. Metamathematics",
  },
  {
    slug: "mathematics-and-physical-reality",
    heading: "Part XI: The Bridge — Mathematics and Physical Reality",
    nav: "XI. Mathematics and reality",
  },
  {
    slug: "epistemic-mathematics",
    heading: "Part XII: Epistemic Mathematics — The Governance Layer",
    nav: "XII. Epistemic mathematics",
  },
  {
    slug: "appendix-symbol-glossary",
    heading: "Appendix A: Symbol Glossary",
    nav: "Appendix A. Symbols",
  },
  {
    slug: "appendix-key-theorems",
    heading: "Appendix B: Key Theorems Index",
    nav: "Appendix B. Theorems",
  },
  {
    slug: "appendix-toolkit-crosswalk",
    heading: "Appendix C: Cross-Reference to the LLM Governance Toolkit",
    nav: "Appendix C. Toolkit crosswalk",
  },
];

export function getOntologyPart(slug) {
  return ONTOLOGY_PARTS.find((part) => part.slug === slug);
}

export function ontologyPartPath(slug) {
  return `/research/mathematics-ontology-bible/${slug}`;
}

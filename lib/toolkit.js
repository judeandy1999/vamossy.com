import { SITE } from "./site";

export const TOOLKIT = {
  title: "LLM Governance Toolkit",
  description:
    "Practical, honestly-scoped tools and patterns for making LLM and agent workflows trustworthy — by making their limits explicit and keeping a human holding the pen.",
  repo: SITE.github,
  license: "MIT",
  copyright: "Copyright (c) 2026 Gergo Vamossy / QIERA",
};

export const TOOLKIT_SECTIONS = [
  { slug: "", label: "Overview", href: "/llm-governance-toolkit" },
  { slug: "architecture", label: "Architecture", href: "/llm-governance-toolkit/architecture" },
  { slug: "principles", label: "Governance principles", href: "/llm-governance-toolkit/principles" },
  { slug: "components", label: "Components", href: "/llm-governance-toolkit/components" },
  { slug: "methodology", label: "Methodology", href: "/llm-governance-toolkit/methodology" },
  { slug: "examples", label: "Examples", href: "/llm-governance-toolkit/examples" },
  { slug: "verification", label: "Tests / verification", href: "/llm-governance-toolkit/verification" },
  {
    slug: "research-crosswalk",
    label: "Research crosswalk",
    href: "/llm-governance-toolkit/research-crosswalk",
  },
  { slug: "compliance", label: "Compliance layer", href: "/llm-governance-toolkit/compliance" },
  { slug: "downloads", label: "Downloads", href: "/llm-governance-toolkit/downloads" },
];

export const COMPONENTS = [
  {
    slug: "goodhart-auditor",
    file: "goodhart_auditor.py",
    dir: "tools",
    note: "toolkit/notes/README_goodhart_auditor.md",
    title: "Goodhart auditor",
    group: "Epistemic / integrity",
    summary:
      "An epistemic linter: flags fields/metrics whose name claims a verified property (reviewed, verified) that nothing actually checks.",
  },
  {
    slug: "knowledge-maturity",
    file: "knowledge_maturity.py",
    dir: "tools",
    note: "toolkit/notes/README_knowledge_maturity.md",
    title: "Knowledge maturity",
    group: "Epistemic / integrity",
    summary:
      "A deterministic evidence-maturity classifier: rates how much evidentiary work stands behind a claim (not whether it is true), with critical gates that quantity cannot buy past.",
  },
  {
    slug: "decoupling-monitor",
    file: "decoupling_monitor.py",
    dir: "tools",
    note: null,
    title: "Decoupling monitor",
    group: "Epistemic / integrity",
    summary:
      "A Goodhart-in-the-wild monitor: watches a reported proxy against an independent truth signal and alerts when the proxy keeps improving while the truth degrades.",
    figure: "/images/toolkit/decoupling_monitor_fig.png",
  },
  {
    slug: "ground-truth-auditor",
    file: "ground_truth_auditor.py",
    dir: "tools",
    note: null,
    title: "Ground-truth auditor",
    group: "Epistemic / integrity",
    summary:
      "Checks whether the truth signal a decoupling monitor relies on is actually independent of the proxy, so you know whether a decoupling alarm means anything.",
    figure: "/images/toolkit/ground_truth_auditor_fig.png",
  },
  {
    slug: "eval-gaming-detector",
    file: "eval_gaming_detector.py",
    dir: "tools",
    note: null,
    title: "Eval-gaming detector",
    group: "Epistemic / integrity",
    summary:
      "A defensive eval-gaming / sandbagging detector. Flags when a model-evaluation score is decoupled from true capability. Abstract scores only; no techniques.",
  },
  {
    slug: "optimal-timing",
    file: "optimal_timing.py",
    dir: "tools",
    note: null,
    title: "Optimal timing",
    group: "Decision",
    summary:
      "An optimal-stopping timing layer: from a cost structure and an evidence model, it solves the Bayes-optimal act-or-wait boundary on the posterior.",
    figure: "/images/toolkit/optimal_timing_fig.png",
  },
  {
    slug: "option-space",
    file: "option_space.py",
    dir: "tools",
    note: "toolkit/notes/Option_Space_Design_Note.md",
    title: "Option space",
    group: "Decision",
    summary:
      "Option-set integrity governor: Pareto frontier (no blended score), decoy/completeness flags, non-self-approval. Governs the set before the choice.",
  },
  {
    slug: "governed-decision",
    file: "governed_decision.py",
    dir: "tools",
    note: "toolkit/notes/Governed_Decision_Design_Note.md",
    title: "Governed decision",
    group: "Decision",
    summary:
      "Composes trust, maturity, timing, safety, and authority into one governed decision. Never emits ACTED. Human authority remains the final slot.",
  },
  {
    slug: "containment-guard",
    file: "containment_guard.py",
    dir: "patterns",
    note: "toolkit/patterns/agent_containment_pattern.md",
    title: "Containment guard",
    group: "Containment",
    summary:
      "A fail-closed guard that rejects any agent action which is not human-authorized, reversible, bounded, and logged.",
  },
  {
    slug: "capable-agent-cage",
    file: "capable_agent_cage.py",
    dir: "tools",
    note: "toolkit/notes/Capable_Agent_Cage_Note.md",
    title: "Capable-agent cage",
    group: "Containment",
    summary:
      "A fail-closed boundary over capable-agent proposals. The cage's decision space is small enough to enumerate; stress-test results are published separately.",
  },
  {
    slug: "soi-pipeline",
    file: "soi_pipeline.py",
    dir: "soi",
    note: "toolkit/soi/SOI-000_Scientific_Knowledge_Governance_Infrastructure.md",
    title: "Scientific knowledge-governance pipeline",
    group: "Consolidation",
    summary:
      "One deterministic function that assigns a claim's epistemic-status order (PROVISIONAL → WORKING_BASIS → MULTI_DOMAIN_TESTED → VALIDATED → CANONICAL_CANDIDATE). It orders claims by status, never by truth.",
  },
  {
    slug: "determinism-governor",
    file: "determinism_governor.py",
    dir: "tools",
    note: "toolkit/notes/Determinism_Governor_Design_Note.md",
    title: "Determinism governor",
    group: "Meta-governors",
    summary:
      "Tries to refute a component's determinism claim (repeat, dict-reorder, order-free, inconsistent-raise) plus a source-smell linter.",
  },
  {
    slug: "sos-determinism-governor",
    file: "sos_determinism_governor.py",
    dir: "tools",
    note: "toolkit/notes/SoS_Determinism_Governor_Design_Note.md",
    title: "System-of-systems determinism governor",
    group: "Meta-governors",
    summary:
      "Determinism at component and system level, reconciling robust / fragile / system-nondeterministic verdicts.",
  },
  {
    slug: "dimensional-governor",
    file: "dimensional_governor.py",
    dir: "tools",
    note: "toolkit/notes/Dimensional_Governor_Design_Note.md",
    title: "Dimensional governor",
    group: "Meta-governors",
    summary:
      "Generalizes the refutation engine to a finite, declared set of behavioral dimensions (determinism, purity, idempotence, monotonicity, boundedness, order-invariance).",
  },
  {
    slug: "fixed-point-governor",
    file: "fixed_point_governor.py",
    dir: "tools",
    note: "toolkit/notes/Fixed_Point_Governor_Note.md",
    title: "Fixed-point governor",
    group: "Mathematics / ontology",
    summary:
      "Detects well-founded versus ungrounded governance towers. Ensures governance chains bottom out at human authority.",
  },
  {
    slug: "dependency-graph",
    file: "dependency_graph.py",
    dir: "tools",
    note: "toolkit/notes/Dependency_Graph_Note.md",
    title: "Dependency graph",
    group: "Mathematics / ontology",
    summary:
      "Traces root causes and checks that explanations are well-founded rather than circular.",
  },
  {
    slug: "temporal-governor",
    file: "temporal_governor.py",
    dir: "tools",
    note: "toolkit/notes/Temporal_Governor_Note.md",
    title: "Temporal governor",
    group: "Mathematics / ontology",
    summary: "Enforces tense-to-verifiability mapping so forecasts are not treated as facts.",
  },
  {
    slug: "math-to-reality",
    file: "math_to_reality.py",
    dir: "tools",
    note: "toolkit/notes/Math_to_Reality_Note.md",
    title: "Math-to-reality map",
    group: "Mathematics / ontology",
    summary:
      "Governance-layer mapping between mathematical structure and claims about physical or operational reality.",
  },
  {
    slug: "qualia-report-governor",
    file: "qualia_report_governor.py",
    dir: "tools",
    note: "toolkit/notes/Qualia_Report_Governor_Note.md",
    title: "Qualia report governor",
    group: "Unverifiable claims",
    summary:
      "Handles experience-claims where no third-person ground truth exists. The honest verdict is permanently unverifiable, not a failed check.",
  },
  {
    slug: "taxonomy-builder",
    file: "taxonomy_builder.py",
    dir: "tools",
    note: "toolkit/notes/Taxonomy_Builder_Note.md",
    title: "Taxonomy builder",
    group: "Applications",
    summary: "Builds and validates taxonomies; used in the log-severity case study.",
  },
  {
    slug: "postmortem-infra",
    file: "postmortem_infra.py",
    dir: "tools",
    note: "toolkit/notes/Postmortem_Infra_Note.md",
    title: "Postmortem integrity",
    group: "Applications",
    summary:
      "Checks whether a postmortem is honest in structure — not whether its conclusions are correct.",
  },
  {
    slug: "telemetry-infra",
    file: "telemetry_infra.py",
    dir: "tools",
    note: "toolkit/notes/Telemetry_Infra_Note.md",
    title: "Telemetry infrastructure",
    group: "Applications",
    summary: "Telemetry and alerting infrastructure used with timing and decoupling checks.",
  },
  {
    slug: "temporal-telemetry",
    file: "temporal_telemetry.py",
    dir: "tools",
    note: "toolkit/notes/Temporal_Telemetry_Note.md",
    title: "Temporal telemetry",
    group: "Applications",
    summary: "Temporal telemetry accompanying the temporal governor.",
  },
  {
    slug: "temporal-decision-seam",
    file: "temporal_decision_seam.py",
    dir: "tools",
    note: "toolkit/notes/Temporal_Decision_Seam_Note.md",
    title: "Temporal decision seam",
    group: "Decision",
    summary: "The seam at which temporal claims meet human authorization.",
  },
  {
    slug: "governed-switch",
    file: "governed_switch.py",
    dir: "patterns",
    note: "toolkit/patterns/Governed_Switch_Note.md",
    title: "Governed switch",
    group: "Patterns",
    summary: "A governed switch pattern for changing regimes without silent self-authorization.",
  },
  {
    slug: "white-raven-governor",
    file: "white_raven_governor.py",
    dir: "tools",
    note: "toolkit/notes/White_Raven_Governor_Note.md",
    title: "White-raven governor",
    group: "Epistemic / integrity",
    summary: "Governor accompanying the raven taxonomy for rare confirming/disconfirming cases.",
  },
  {
    slug: "raven-taxonomy",
    file: "raven_taxonomy.py",
    dir: "tools",
    note: "toolkit/notes/Raven_Taxonomy_Note.md",
    title: "Raven taxonomy",
    group: "Epistemic / integrity",
    summary: "Taxonomy for confirmation and disconfirmation cases used by the white-raven governor.",
  },
  {
    slug: "tokenization-taxonomy",
    file: "tokenization_taxonomy.py",
    dir: "tools",
    note: "toolkit/notes/Tokenization_Taxonomy_Note.md",
    title: "Tokenization taxonomy",
    group: "Applications",
    summary: "Taxonomy and notes on tokenization as a representational proxy.",
  },
  {
    slug: "words-vs-numbers",
    file: "words_vs_numbers.py",
    dir: "tools",
    note: "toolkit/notes/Words_vs_Numbers_Formalization.md",
    title: "Words vs numbers",
    group: "Applications",
    summary: "Formalization of the gap between verbal claims and numeric checks.",
  },
  {
    slug: "fractal-recursion",
    file: "fractal_recursion.py",
    dir: "tools",
    note: "toolkit/notes/Fractal_Recursion_Note.md",
    title: "Fractal recursion",
    group: "Mathematics / ontology",
    summary: "Notes on fractal recursion as used by the toolkit's structural checks.",
  },
  {
    slug: "fractal-prerequisite",
    file: "fractal_prerequisite.py",
    dir: "tools",
    note: "toolkit/notes/Fractal_Prerequisite_Note.md",
    title: "Fractal prerequisite",
    group: "Mathematics / ontology",
    summary: "Prerequisite structure for the fractal recursion notes.",
  },
  {
    slug: "time-infra",
    file: "time_infra.py",
    dir: "tools",
    note: "toolkit/notes/Time_Infra_Note.md",
    title: "Time infrastructure",
    group: "Applications",
    summary: "Time infrastructure accompanying temporal governance.",
  },
  {
    slug: "freedom-infra",
    file: "freedom_infra.py",
    dir: "tools",
    note: "toolkit/notes/Freedom_Infra_Note.md",
    title: "Freedom infrastructure",
    group: "Applications",
    summary: "Infrastructure note on freedom as used in the toolkit's option and authority model.",
  },
  {
    slug: "free-will-infra",
    file: "free_will_infra.py",
    dir: "tools",
    note: "toolkit/notes/Free_Will_Infra_Note.md",
    title: "Free-will infrastructure",
    group: "Applications",
    summary: "Infrastructure note on free-will claims and their governance status.",
  },
  {
    slug: "layered-sciences",
    file: "sciences_layers.py",
    dir: "tools",
    note: "toolkit/notes/Layered_Sciences_Note.md",
    title: "Layered sciences",
    group: "Mathematics / ontology",
    summary: "Notes on layered sciences and dependency between domains.",
  },
  {
    slug: "em-family",
    file: "em_field.py",
    dir: "tools",
    note: "toolkit/notes/EM_Family_Notes.md",
    title: "EM family",
    group: "Applications",
    summary: "Notes on the electromagnetism / energy-matter family of checks.",
  },
  {
    slug: "duality-water-flow",
    file: "water_infra.py",
    dir: "tools",
    note: "toolkit/notes/Duality_Water_Flow_Bounds_Notes.md",
    title: "Duality / water-flow bounds",
    group: "Applications",
    summary: "Notes on duality and water-flow bounds used as a structured example domain.",
  },
];

export const PATTERNS = [
  {
    slug: "non-self-approving-derivation",
    title: "Non-self-approving derivation",
    file: "toolkit/patterns/non_self_approving_derivation.md",
    summary:
      "Letting an AI do deep derivation while making it structurally unable to certify its own conclusions.",
    related: "/research/non-self-approving-ai-assisted-derivation",
  },
  {
    slug: "agent-containment",
    title: "Agent containment",
    file: "toolkit/patterns/agent_containment_pattern.md",
    summary:
      "Composing agents so non-autonomy is structural, not behavioral — they propose; a gate and a human authorize.",
  },
  {
    slug: "federation",
    title: "Federation",
    file: "toolkit/patterns/federation_pattern.md",
    summary:
      "System-of-systems composition with artifact-only exchange and no shared memory, so capability scales without creating one opaque super-agent.",
  },
];

export function getComponent(slug) {
  return COMPONENTS.find((item) => item.slug === slug);
}

export function getPattern(slug) {
  return PATTERNS.find((item) => item.slug === slug);
}

export function githubBlob(dir, file) {
  return `${SITE.github}/blob/main/${dir}/${file}`;
}

export function componentGroups() {
  const groups = [];
  for (const component of COMPONENTS) {
    let group = groups.find((item) => item.name === component.group);
    if (!group) {
      group = { name: component.group, items: [] };
      groups.push(group);
    }
    group.items.push(component);
  }
  return groups;
}

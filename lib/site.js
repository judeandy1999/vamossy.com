export const SITE = {
  name: "Gergely Vámossy",
  shortName: "Vámossy",
  title: "Gergely Vámossy — AI/LLM Governance Research",
  description:
    "Research by Gergely Vámossy on AI/LLM governance, epistemic infrastructure, mathematical ontology, and machine-checkable non-self-approval.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vamossy.com",
  author: {
    name: "Gergely Vámossy",
    affiliation: "QIERA",
    email: "gergo@qiera.io",
  },
  github: "https://github.com/Gergo89/llm-governance-toolkit",
  gaId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "G-8Y6KGXJE9K",
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/llm-governance-toolkit", label: "LLM Governance Toolkit" },
  { href: "/research/mathematics-ontology-bible", label: "Mathematics Ontology" },
  { href: "/about", label: "About" },
];

export function absUrl(path = "/") {
  const base = SITE.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

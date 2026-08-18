import Link from "next/link";
import { ONTOLOGY_PARTS, ontologyPartPath } from "@/lib/ontology";

export default function OntologyNav({ current }) {
  return (
    <nav className="side-nav" aria-label="Mathematics Ontology Bible">
      <p className="side-nav-label">Contents</p>
      <ul>
        <li>
          <Link
            href="/research/mathematics-ontology-bible"
            aria-current={current === "" ? "page" : undefined}
          >
            Overview
          </Link>
        </li>
        {ONTOLOGY_PARTS.map((part) => (
          <li key={part.slug}>
            <Link
              href={ontologyPartPath(part.slug)}
              aria-current={current === part.slug ? "page" : undefined}
            >
              {part.nav}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

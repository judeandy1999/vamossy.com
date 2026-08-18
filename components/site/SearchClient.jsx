"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SearchClient({ index }) {
  const params = useSearchParams();
  const initial = params.get("q") || "";
  const [query, setQuery] = useState(initial);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index
      .filter((item) =>
        `${item.title} ${item.text} ${item.type}`.toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [index, query]);

  return (
    <>
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="q" className="muted">
          Query
        </label>
        <input
          id="q"
          className="search-box"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Governance, ontology, non-self-approval…"
          autoFocus
        />
      </form>
      <p className="muted">
        {query.trim().length < 2
          ? "Enter at least two characters."
          : `${results.length} matching items.`}
      </p>
      <ul className="pub-list">
        {results.map((item) => (
          <li key={item.href + item.title} className="pub-item">
            <p className="pub-type">{item.type}</p>
            <h2>
              <Link href={item.href}>{item.title}</Link>
            </h2>
          </li>
        ))}
      </ul>
    </>
  );
}

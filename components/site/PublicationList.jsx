import Link from "next/link";
import { publicationPath } from "@/lib/publications";

export default function PublicationList({ items }) {
  return (
    <ul className="pub-list">
      {items.map((item) => {
        const href = publicationPath(item);
        return (
          <li key={item.slug} className="pub-item">
            <p className="pub-type">
              {item.type}
              {item.dateLabel ? ` · ${item.dateLabel}` : ""}
            </p>
            <h2>
              <Link href={href}>{item.title}</Link>
            </h2>
            {item.subtitle && <p className="pub-sub">{item.subtitle}</p>}
            <p>{item.description}</p>
            <p className="pub-byline">
              {item.author}
              {item.version ? ` · Version ${item.version}` : ""}
            </p>
            <p className="pub-actions">
              <Link href={href}>Read online</Link>
              {item.pdf && (
                <>
                  {" · "}
                  <a href={item.pdf}>Download PDF</a>
                </>
              )}
              {item.docx && (
                <>
                  {" · "}
                  <a href={item.docx}>Download Word</a>
                </>
              )}
              <span className="perm"> · {href}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

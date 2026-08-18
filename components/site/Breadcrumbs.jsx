import Link from "next/link";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.name}`}>
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined}>{item.name}</span>
              ) : (
                <Link href={item.href}>{item.name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

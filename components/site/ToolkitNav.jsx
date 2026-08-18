import Link from "next/link";
import { TOOLKIT_SECTIONS } from "@/lib/toolkit";

export default function ToolkitNav({ current }) {
  return (
    <nav className="side-nav" aria-label="Toolkit sections">
      <p className="side-nav-label">Toolkit</p>
      <ul>
        {TOOLKIT_SECTIONS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current === item.slug ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

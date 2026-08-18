import Link from "next/link";
import { SITE, NAV } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-wrap footer-grid">
        <div>
          <p className="footer-name">{SITE.author.name}</p>
          <p className="footer-meta">
            {SITE.author.affiliation} · Independent research on AI/LLM governance
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-links">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a href={SITE.github} rel="noopener noreferrer">
                Source repository
              </a>
            </li>
          </ul>
        </nav>
        <p className="footer-note">
          Canonical research artifacts remain downloadable. The toolkit source is
          published on GitHub under the MIT License. This site does not claim
          scientific validation where the source marks work as a candidate,
          recommendation, or working basis.
        </p>
      </div>
    </footer>
  );
}

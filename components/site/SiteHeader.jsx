"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "@/lib/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-wrap header-inner">
        <Link href="/" className="wordmark" aria-label="Gergely Vámossy, home">
          <span className="wordmark-name">Vámossy</span>
          <span className="wordmark-sub">Research</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "nav-link is-active" : "nav-link"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/search" className="nav-link nav-search">
            Search
          </Link>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav site-wrap" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="mobile-link"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/search" className="mobile-link" onClick={() => setOpen(false)}>
            Search
          </Link>
        </nav>
      )}
    </header>
  );
}

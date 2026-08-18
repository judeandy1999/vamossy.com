"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import CookieBanner from "./CookieBanner";

const APP_PREFIXES = [
  "/user-dashboard",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export default function AppShell({ children }) {
  const pathname = usePathname() || "/";
  const isApp = APP_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isApp) {
    return children;
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <CookieBanner />
    </>
  );
}

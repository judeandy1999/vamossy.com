import { SITE } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/user-dashboard/",
          "/api/",
          "/admin/",
          "/login",
          "/signup",
          "/private/",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

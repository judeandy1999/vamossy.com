import { generatePageMetadata } from "@/utils/seo";
import { SITE } from "@/lib/site";

export const metadata = generatePageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy information for vamossy.com, including Google Analytics 4 and contact details published in the research materials.",
  url: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="page">
      <article className="site-wrap research-prose">
        <h1>Privacy Policy</h1>
        <p>Last updated: 18 August 2026</p>
        <p>
          vamossy.com publishes research by {SITE.author.name}. Reading the
          public research pages does not require an account.
        </p>
        <h2>Analytics</h2>
        <p>
          If you accept analytics cookies, the site uses Google Analytics 4
          (measurement ID configured via <code>NEXT_PUBLIC_GA4_MEASUREMENT_ID</code>)
          to record page views, research publication views, file downloads,
          outbound repository clicks, and contact clicks. Analytics storage is
          denied until you accept.
        </p>
        <h2>Contact</h2>
        <p>
          The email published in the research documents is{" "}
          <a href={`mailto:${SITE.author.email}`}>{SITE.author.email}</a>.
        </p>
      </article>
    </div>
  );
}

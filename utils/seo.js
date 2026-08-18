import { SITE, absUrl } from "@/lib/site";

export function generateSiteMetadata() {
  return {
    title: {
      default: SITE.title,
      template: `%s | ${SITE.shortName}`,
    },
    description: SITE.description,
    keywords: [
      "LLM governance",
      "AI governance",
      "AI-assisted reasoning",
      "epistemic infrastructure",
      "mathematical ontology",
      "machine-checkable governance",
      "non-self-approval",
      "human-in-the-loop governance",
      "AI safety",
      "knowledge maturity",
      "reproducibility",
      "validation",
    ],
    authors: [{ name: SITE.author.name, url: absUrl("/about") }],
    creator: SITE.author.name,
    publisher: SITE.author.affiliation,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      title: SITE.title,
      description: SITE.description,
      siteName: SITE.name,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: SITE.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.title,
      description: SITE.description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image = "/opengraph-image",
  url = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  authors = [SITE.author.name],
  noIndex = false,
}) {
  const fullUrl = absUrl(url);

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: authors.map((author) => ({ name: author })),
    openGraph: {
      title,
      description,
      url: fullUrl,
      type,
      siteName: SITE.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateCaseStudyMetadata(caseStudy) {
  return generatePageMetadata({
    title: caseStudy.seo?.metaTitle || caseStudy.title,
    description: caseStudy.seo?.metaDescription || "",
    keywords: caseStudy.tags || [],
    url: caseStudy.seo?.url || "/",
    type: "article",
    noIndex: true,
  });
}

export function generateArticleMetadata(article) {
  return generatePageMetadata({
    title: article.title,
    description: article.excerpt || article.summary,
    keywords: article.tags || [],
    url: `/articles/${article.id}`,
    type: "article",
    publishedTime: article.created_at,
    modifiedTime: article.updated_at || article.created_at,
    noIndex: true,
  });
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.author.name,
    url: absUrl("/about"),
    email: SITE.author.email,
    affiliation: {
      "@type": "Organization",
      name: SITE.author.affiliation,
    },
    jobTitle: "Independent researcher",
    knowsAbout: [
      "LLM governance",
      "AI governance",
      "epistemic infrastructure",
      "mathematical ontology",
      "machine-checkable governance",
    ],
    sameAs: [SITE.github],
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.author.affiliation,
    url: SITE.url,
    founder: {
      "@type": "Person",
      name: SITE.author.name,
    },
    email: SITE.author.email,
    sameAs: [SITE.github],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.title,
    url: SITE.url,
    description: SITE.description,
    author: {
      "@type": "Person",
      name: SITE.author.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absUrl(crumb.url),
    })),
  };
}

export function generateScholarlyArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  version,
  keywords = [],
  downloadUrl,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: title,
    name: title,
    description,
    url: absUrl(url),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absUrl(url),
    },
    author: {
      "@type": "Person",
      name: SITE.author.name,
      email: SITE.author.email,
      affiliation: SITE.author.affiliation,
      url: absUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE.author.affiliation,
      url: SITE.url,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    version,
    keywords: keywords.join(", "),
    inLanguage: "en",
    license: "https://opensource.org/licenses/MIT",
    ...(downloadUrl && {
      encoding: {
        "@type": "MediaObject",
        contentUrl: absUrl(downloadUrl),
      },
    }),
  };
}

export function generateArticleSchema(article) {
  return generateScholarlyArticleSchema({
    title: article.title,
    description: article.excerpt || article.summary || article.description,
    url: article.url || `/research/${article.slug}`,
    datePublished: article.datePublished || article.created_at,
    dateModified: article.dateModified || article.updated_at,
    keywords: article.keywords || article.tags || [],
  });
}

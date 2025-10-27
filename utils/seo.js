// SEO utility functions
export function generateSiteMetadata() {
  return {
    title: {
      default: "Vamossy Digital - AI-Powered eCommerce Growth Solutions",
      template: "%s | Vamossy Digital"
    },
    description: "Transform your eCommerce business with AI-powered growth systems. We engineer profitable, predictable solutions for Shopify, Adobe Commerce, and WooCommerce brands.",
    keywords: [
      "ecommerce consulting",
      "AI-powered growth",
      "Shopify optimization",
      "Adobe Commerce development",
      "WooCommerce solutions",
      "digital marketing",
      "conversion optimization",
      "ecommerce automation"
    ],
    authors: [{ name: "Vamossy Digital Team" }],
    creator: "Vamossy Digital",
    publisher: "Vamossy Digital",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: '/',
      title: 'Vamossy Digital - AI-Powered eCommerce Growth Solutions',
      description: 'Transform your eCommerce business with AI-powered growth systems. We engineer profitable, predictable solutions for Shopify, Adobe Commerce, and WooCommerce brands.',
      siteName: 'Vamossy Digital',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Vamossy Digital - eCommerce Growth Solutions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Vamossy Digital - AI-Powered eCommerce Growth Solutions',
      description: 'Transform your eCommerce business with AI-powered growth systems.',
      images: ['/og-image.png'],
      creator: '@vamossydigital',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image = '/og-image.png',
  url = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = ['Vamossy Digital Team'],
  noIndex = false
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com';
  const fullUrl = `${baseUrl}${url}`;
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: authors.map(author => ({ name: author })),
    openGraph: {
      title,
      description,
      url: fullUrl,
      type,
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
      card: 'summary_large_image',
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
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateCaseStudyMetadata(caseStudy) {
  return generatePageMetadata({
    title: caseStudy.seo.metaTitle,
    description: caseStudy.seo.metaDescription,
    keywords: caseStudy.tags,
    url: caseStudy.seo.url,
    type: 'article',
    publishedTime: caseStudy.publishedDate,
    modifiedTime: caseStudy.publishedDate,
    noIndex: true // Prevent all case studies from being indexed
  });
}

export function generateArticleMetadata(article) {
  return generatePageMetadata({
    title: article.title,
    description: article.excerpt || article.summary,
    keywords: article.tags || [],
    url: `/articles/${article.id}`,
    type: 'article',
    publishedTime: article.created_at,
    modifiedTime: article.updated_at || article.created_at,
  });
}

// Schema.org structured data generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vamossy Digital",
    "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com',
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com'}/logo.png`,
    "description": "AI-powered eCommerce growth solutions for modern brands",
    "sameAs": [
      "https://www.linkedin.com/company/vamossy-digital",
      "https://twitter.com/vamossydigital"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vamossy Digital",
    "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com',
    "description": "AI-powered eCommerce growth solutions for modern brands",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com'}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com'}${crumb.url}`
    }))
  };
}

export function generateArticleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || article.summary,
    "image": article.image || '/og-image.png',
    "author": {
      "@type": "Organization",
      "name": "Vamossy Digital"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vamossy Digital",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com'}/logo.png`
      }
    },
    "datePublished": article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com'}/articles/${article.id}`
    }
  };
}

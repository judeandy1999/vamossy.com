export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/case-studies/',  // Prevent indexing of all case studies
        '/articles/',
        '/user-dashboard/',
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

// Browser Console Commands for Testing SEO

// 1. Check if meta tags are present
console.log('Meta Title:', document.querySelector('title')?.textContent);
console.log('Meta Description:', document.querySelector('meta[name="description"]')?.content);
console.log('OG Title:', document.querySelector('meta[property="og:title"]')?.content);
console.log('OG Description:', document.querySelector('meta[property="og:description"]')?.content);
console.log('OG URL:', document.querySelector('meta[property="og:url"]')?.content);

// 2. Check for structured data
const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
  .map(script => {
    try {
      return JSON.parse(script.textContent);
    } catch (e) {
      return null;
    }
  })
  .filter(Boolean);
console.log('Structured Data:', structuredData);

// 3. Check canonical URL
console.log('Canonical URL:', document.querySelector('link[rel="canonical"]')?.href);

// 4. Check robots meta
console.log('Robots:', document.querySelector('meta[name="robots"]')?.content);

// 5. Check if page is mobile-friendly
console.log('Viewport:', document.querySelector('meta[name="viewport"]')?.content);

// 6. Check for lang attribute
console.log('Page Language:', document.documentElement.lang);

// 7. Check for duplicate IDs (bad for SEO)
const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  console.warn('Duplicate IDs found:', duplicateIds);
} else {
  console.log('No duplicate IDs found ✓');
}

// 8. Check for images without alt text
const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt]), img[alt=""]'));
if (imagesWithoutAlt.length > 0) {
  console.warn('Images without alt text:', imagesWithoutAlt);
} else {
  console.log('All images have alt text ✓');
}

// 9. Check for broken internal links
const internalLinks = Array.from(document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]'));
console.log('Internal links count:', internalLinks.length);

// 10. Page performance metrics (if available)
if ('performance' in window) {
  const navigation = performance.getEntriesByType('navigation')[0];
  console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
  console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
}

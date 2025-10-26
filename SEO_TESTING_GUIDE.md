# SEO Testing Checklist

## After Deployment - Test These URLs:

### 1. Homepage
- URL: `https://yourdomain.com/`
- Check: Meta title, description, Open Graph tags
- Expected: "AI-Powered eCommerce Growth Solutions | Vamossy Digital"

### 2. Case Study Pages
- URL: `https://yourdomain.com/case-studies/shopify-subscription-snack-box-ai`
- Check: Dynamic metadata, structured data, breadcrumbs
- Expected: "Subscription Snack Box — Shopify | AI Personalization Case Study | Vamossy Digital"

### 3. Article Pages (if you have articles in your database)
- URL: `https://yourdomain.com/articles/[article-id]`
- Check: Article schema, breadcrumbs, dynamic metadata

### 4. Case Studies Listing
- URL: `https://yourdomain.com/case-studies`
- Check: Meta tags for listing page

## Browser Testing Tools:

### View Page Source (Right-click → View Page Source):
Look for these elements:

1. **Meta Tags:**
```html
<title>Your Page Title | Vamossy Digital</title>
<meta name="description" content="Your page description">
<meta property="og:title" content="Your page title">
<meta property="og:description" content="Your page description">
<meta property="og:url" content="https://yourdomain.com/page-url">
```

2. **Structured Data (JSON-LD):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Vamossy Digital"
}
</script>
```

## Online Testing Tools:

### Meta Tags Testing:
1. **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

### Structured Data Testing:
1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Schema.org Validator:** https://validator.schema.org/
3. **Structured Data Testing Tool:** https://search.google.com/structured-data/testing-tool

### SEO Analysis:
1. **Lighthouse (built into Chrome DevTools):**
   - Press F12 → Lighthouse tab → Generate report
   - Look for SEO score and recommendations

2. **WebPageTest:** https://www.webpagetest.org/
3. **GTmetrix:** https://gtmetrix.com/

## Browser Extensions for Testing:
1. **SEO META in 1 CLICK** - Chrome extension
2. **Web Developer** - Firefox/Chrome extension
3. **SEOquake** - Chrome extension

## What to Look For:

### ✅ Success Indicators:
- Unique meta titles and descriptions on each page
- Open Graph tags present
- Structured data validates without errors
- Fast loading times
- Mobile-friendly design
- No duplicate content issues

### ❌ Issues to Fix:
- Missing or duplicate meta tags
- Structured data errors
- Slow loading times
- Mobile usability issues
- Broken internal links

## Command Line Testing (after deployment):

### Test sitemap (create one if needed):
```bash
curl https://yourdomain.com/sitemap.xml
```

### Test robots.txt:
```bash
curl https://yourdomain.com/robots.txt
```

## Performance Monitoring:
1. Set up Google Analytics 4
2. Monitor Core Web Vitals
3. Track organic search traffic
4. Monitor click-through rates from search results

## Next Steps After Testing:
1. Submit sitemap to Google Search Console
2. Request indexing for new/updated pages
3. Monitor search rankings for target keywords
4. Set up regular SEO audits

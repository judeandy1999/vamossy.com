export function getAllPosts() {
  return [
    {
      slug: 'intro-to-seo',
      title: 'Intro to SEO',
      excerpt: 'Understand how search engine optimization can transform your web visibility.',
      content: 'Search Engine Optimization (SEO) is the practice of optimizing your website to increase its visibility when people search for products or services related to your business on Google, Bing, and other search engines. Good SEO involves keyword research, on-page SEO, high-quality content creation, and backlinks.\n\nIt also includes improving user experience, ensuring fast load times, and mobile responsiveness. SEO is a long-term investment that can yield significant results in brand awareness, website traffic, and lead generation.'
    },
    {
      slug: 'digital-strategy',
      title: 'Digital Strategy 101',
      excerpt: 'Build a strong foundation for your digital brand with effective strategy.',
      content: 'A solid digital strategy outlines your goals, target audience, digital channels, and key performance indicators (KPIs). It helps align your marketing efforts with business outcomes, using tools like customer personas, content calendars, and conversion funnels.\n\nIncorporating analytics, competitive analysis, and platform selection ensures your campaigns are data-driven and adaptive. An agile digital strategy evolves with market shifts and customer behavior.'
    },
    {
      slug: 'social-media-growth',
      title: 'Social Media Growth Tactics',
      excerpt: 'Learn proven techniques to grow your brand on social media.',
      content: 'Growing your presence on social media involves consistency, engagement, and value. Use data-driven content strategies, respond to comments, collaborate with influencers, and track analytics. Platforms like Instagram, TikTok, and LinkedIn each have unique opportunities for growth.\n\nVideo content, trending topics, and community-building activities enhance visibility. Strategic use of hashtags, posting schedules, and paid promotions also accelerate growth.'
    },
    {
      slug: 'email-marketing-secrets',
      title: 'Email Marketing Secrets',
      excerpt: 'Increase your open and click-through rates with expert tips.',
      content: 'Craft compelling subject lines, segment your audience, and deliver personalized content. Use A/B testing, mobile-optimized templates, and calls-to-action to improve campaign performance.\n\nRegularly analyze performance metrics and remove inactive subscribers to maintain high deliverability rates. Automate follow-ups and welcome sequences for better engagement.'
    },
    {
      slug: 'content-marketing-framework',
      title: 'Content Marketing Framework',
      excerpt: 'A step-by-step system to drive traffic through content.',
      content: 'Define your audience, set SMART goals, and use a content calendar. Create a mix of blog posts, videos, and infographics optimized for SEO. Promote content through email and social media.\n\nTrack performance with analytics tools, repurpose high-performing content, and continuously test new formats. Content should inform, inspire, and influence.'
    },
    {
      slug: 'ppc-advertising-tips',
      title: 'PPC Advertising Tips',
      excerpt: 'Maximize your return on ad spend with smarter PPC strategies.',
      content: 'Pay-per-click advertising lets you reach your audience quickly with targeted ads. Use negative keywords, precise audience targeting, and compelling ad copy to improve conversion rates.\n\nOptimize landing pages and track conversions through UTM tags and A/B testing. Continuous refinement leads to better cost-efficiency and ROI.'
    },
    {
      slug: 'local-seo-strategies',
      title: 'Local SEO Strategies',
      excerpt: 'Boost visibility for your business in local search results.',
      content: 'Claim your Google Business Profile, maintain NAP consistency, and gather reviews to build local trust. Local backlinks and citations also improve rankings.\n\nCreate locally relevant content and participate in community events online and offline. Local SEO is key for service-based and brick-and-mortar businesses.'
    },
    {
      slug: 'conversion-rate-optimization',
      title: 'Conversion Rate Optimization',
      excerpt: 'Turn visitors into customers with CRO best practices.',
      content: 'Optimize calls-to-action, streamline checkout processes, and test layouts to improve conversion rates. Heatmaps and user behavior tools offer insights into friction points.\n\nUse social proof, scarcity messaging, and clear value propositions to nudge users toward action. CRO enhances ROI without increasing traffic.'
    },
    {
      slug: 'influencer-marketing-guide',
      title: 'Influencer Marketing Guide',
      excerpt: 'Leverage influencers to expand your brand reach.',
      content: 'Partner with influencers whose values align with your brand. Provide creative freedom, track engagement metrics, and build long-term relationships.\n\nMicro-influencers often offer better ROI than mega-stars due to stronger community bonds. Use unique promo codes and trackable links to measure success.'
    },
    {
      slug: 'analytics-and-tracking',
      title: 'Analytics and Tracking for Marketers',
      excerpt: 'Understand what’s working and what’s not in your campaigns.',
      content: 'Use tools like Google Analytics, Hotjar, and Facebook Pixel to measure traffic, behavior, and conversions. Set up goals, events, and funnels for granular insights.\n\nData-driven decisions help allocate budget efficiently and refine your marketing efforts. Regular reporting improves stakeholder trust and transparency.'
    }
  ];
}

export function getPostBySlug(slug) {
  return getAllPosts().find(post => post.slug === slug);
}
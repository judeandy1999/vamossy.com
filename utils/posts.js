export function getAllPosts() {
  return [
    { slug: 'intro-to-seo', title: 'Intro to SEO', content: 'SEO is ...' },
    { slug: 'digital-strategy', title: 'Digital Strategy 101', content: 'Start with ...' }
  ];
}

export function getPostBySlug(slug) {
  return getAllPosts().find(post => post.slug === slug);
}
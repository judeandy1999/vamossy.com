import Link from 'next/link';
import { getAllPosts } from '@/utils/posts';
import PageWrapper from '@/components/page-wrapper';

export default function BlogIndex() {

  const posts = getAllPosts();

  return (
    <PageWrapper title="Digital Marketing Wiki" subtitle="Explore our blog for the latest insights and strategies in digital marketing." color="blog">
      <div className="grid md:grid-cols-2 gap-8">
        {posts.map(post => (
          <div key={post.slug} className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-2 text-black-600">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-gray-600 mb-4">{post.excerpt || 'Explore the topic in detail...'}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
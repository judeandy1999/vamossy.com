import { getPostBySlug, getAllPosts } from '@/utils/posts';
import Head from 'next/head';
import PageWrapper from '@/components/page-wrapper';

export default async function Page({ params }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <Head>
        <title>{post.title} | Digital Marketing Wiki</title>
      </Head>
      <PageWrapper title={post.title} subtitle="Explore insights and tactics from our expert team." color="blog">
        <article className="prose prose-lg max-w-3xl mx-auto text-gray-800">
          <p className="text-gray-600 text-base italic mb-6">Last updated on {new Date().toLocaleDateString()}</p>
          <div className="space-y-6">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>
      </PageWrapper>
    </>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}
import { getPostBySlug, getAllPosts } from '@/utils/posts';

export default async function Page({ params }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <div>{post.content}</div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}
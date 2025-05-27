import Link from 'next/link';
import { getAllPosts } from '@/utils/posts';

export default function BlogIndex() {

  const posts = getAllPosts();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Digital Marketing Wiki</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
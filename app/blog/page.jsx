// app/blog/page.jsx
import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function Page() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-500">Failed to load posts: {error.message}</p>
  }

  console.log('Fetched posts:', posts)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

      {posts.length === 0 && <p>No published posts yet.</p>}

      <ul className="space-y-6">
        {posts.map(post => (
          <li key={post.id} className="border-b pb-4">
            <a href={`/blog/${post.slug}`} className="text-xl font-semibold text-blue-600 hover:underline">
              {post.title}
            </a>
            <p className="text-gray-700 text-sm mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-800 line-clamp-3">{post.content?.slice(0, 150)}...</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

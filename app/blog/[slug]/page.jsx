// app/blog/[slug]/page.jsx
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

// Create Supabase client (Server Component safe)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function BlogPostPage({ params }) {
  const { slug } = params

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) {
    return notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="prose prose-lg text-gray-900">
        {post.content}
      </div>
    </article>
  )
}

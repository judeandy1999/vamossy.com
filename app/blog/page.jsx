// app/blog/page.jsx
import { supabase } from '@/utils/client';

export default async function Page() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')

  if (error) {
    return <p className="text-red-500">Failed to load posts: {error.message}</p>
  }

  console.log('Fetched posts:', articles)

  return (
    <div className="max-w-3xl mx-auto px-4 pt-14 py-10">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

      {articles.length === 0 && <p>No published posts yet.</p>}

      <ul className="space-y-6">
        {articles.length === 0 ? (
          <p>No articles published yet.</p>
        ) : (
          <ul className="space-y-6">
            {articles.map(article => (
              <li key={article.id} className="border-b pb-4">
                <a
                  href={`/blog/${article.id}`}
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {article.title || 'Untitled'}
                </a>
                <p className="text-gray-700 text-sm mt-1">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-800 line-clamp-3">
                  {article.preview}...
                </p>
              </li>
            ))}
          </ul>
        )}
      </ul>
    </div>
  )
}

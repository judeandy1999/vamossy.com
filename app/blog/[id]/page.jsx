import { notFound } from 'next/navigation'
import { supabase } from '@/utils/client';

export default async function BlogPostPage({ params }) {
  const { id } = params

  const { data, error } = await supabase
  .from('articles')
  .select('*')
  .eq('id', id)
  .single();

  if (error || !data) {
    return notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10 pt-[10rem]">
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {new Date(data.created_at).toLocaleDateString()}
      </p>
      <div className="prose prose-lg text-gray-900">
        <article
        className="prose max-w-4xl mx-auto p-6"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
      </div>
    </article>
  )
}

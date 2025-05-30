import { supabase } from '@/utils/client';

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const full = searchParams.get('full') === 'true';

  const { data, error } = await supabase
    .from('articles')
    .select(full
      ? 'id, title, preview, created_at, content'
      : 'id, title, preview, created_at'
    )
    .eq('id', id)
    .single();

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      'Content-Type': 'application/json',
    },
  });
}

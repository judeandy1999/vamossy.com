import { supabase } from '@/utils/client';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return Response.json(data);
}

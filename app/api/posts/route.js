import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('posts').select('*')
  if (error) return new Response(error.message, { status: 500 })
  return Response.json(data)
}
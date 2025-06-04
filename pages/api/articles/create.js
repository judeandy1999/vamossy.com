import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, preview, content, user_email, wiki, tab } = req.body;

    const { data, error } = await supabase
      .from('articles')
      .insert([{ title, preview, content, user_email, wiki, tab }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

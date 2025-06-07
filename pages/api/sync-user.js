import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name, avatar_url } = req.body;

  const { error } = await supabase.from('users').upsert(
    {
      email,
      name,
      avatar_url,
      role: 'user',
      tier: 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'email' }
  );

  if (error) {
    console.error('Error inserting/updating user:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'User synced!' });
}

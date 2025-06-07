import { supabase } from '@/utils/client';

export async function createArticle(newArticle) {
  // Get the Supabase access token
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  const res = await fetch('/api/articles/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
    },
    body: JSON.stringify(newArticle),
  });

  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to create article');
  }

  return res.json();
}

export async function updateArticle(updatedArticle) {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  const res = await fetch(`/api/articles/${updatedArticle.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
    },
    body: JSON.stringify(updatedArticle),
  });

  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to update article');
  }

  return res.json();
}

export async function deleteArticle(id) {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  const res = await fetch(`/api/articles/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to delete article');
  }

  return res.json();
}

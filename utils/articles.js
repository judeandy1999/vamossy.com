import { supabase } from '@/utils/client';

export async function createArticle(newArticle) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    // Only send article data, NO tabs
    const articleData = {
      title: newArticle.title,
      content: newArticle.has_tabs ? '' : newArticle.content,
      wiki_id: newArticle.wiki_id,
      has_tabs: newArticle.has_tabs,
      user_email: newArticle.user_email
    };

    const res = await fetch('/api/articles/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
      },
      body: JSON.stringify(articleData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to create article');
    }

    const article = await res.json();
    return article;
  } catch (error) {
    console.error('Create article error:', error);
    throw error;
  }
}

export async function updateArticle(updatedArticle) {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  // Only send article data, NO tabs
  const articleData = {
    id: updatedArticle.id,
    title: updatedArticle.title,
    content: updatedArticle.has_tabs ? '' : updatedArticle.content,
    wiki_id: updatedArticle.wiki_id,
    has_tabs: updatedArticle.has_tabs,
    user_email: updatedArticle.user_email
  };

  const res = await fetch(`/api/articles/${updatedArticle.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
    },
    body: JSON.stringify(articleData), // Only article data, no tabs
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

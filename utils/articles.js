export async function createArticle(newArticle) {
  const res = await fetch('/api/articles/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newArticle),
  });

  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to create article');
  }

  return res.json();
}

export async function updateArticle(updatedArticle) {
  const res = await fetch(`/api/articles/${updatedArticle.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedArticle),
  });

  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to update article');
  }

  return res.json();
}

export async function deleteArticle(id) {
  const res = await fetch(`/api/articles/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to delete article');
  }

  return res.json();
}


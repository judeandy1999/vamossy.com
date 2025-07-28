import mammoth from 'mammoth';

export async function extractDocxText(arrayBuffer) {
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value.trim();
}

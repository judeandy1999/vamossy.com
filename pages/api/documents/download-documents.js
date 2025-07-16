import { supabaseAdmin } from '@/utils/storageClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const segments = path.split('/');
    if (segments.length < 2) {
      return res.status(400).json({ error: 'Invalid file path' });
    }
    const bucket = segments[0];
    const fileKey = segments.slice(1).join('/');

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .download(fileKey);

    if (error || !data) {
      return res.status(404).json({ error: 'File not found', details: error?.message });
    }

    const fileName = path.split('/').pop() || 'download';
    const buffer = Buffer.from(await data.arrayBuffer());

    res.setHeader('Content-Type', data.type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
import { supabase } from '@/utils/client';
import { supabaseAdmin } from '@/utils/storageClient';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { user, error: authError } = await verifySupabaseAuth(req);
    if (authError) return res.status(401).json({ error: authError });

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Evaluation ID required' });

    const { data: evaluation, error: evalError } = await supabase
      .from('evaluations')
      .select('id, log_id')
      .eq('id', id)
      .single();

    if (evalError || !evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    const { error: deleteEvalError } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id);

    if (deleteEvalError) throw deleteEvalError;
    if (evaluation.log_id) {

      const { data: log, error: logError } = await supabase
        .from('task_logs')
        .select('id, file_url')
        .eq('id', evaluation.log_id)
        .single();

      if (log && log.file_url) {
        let filePath = null;
        if (log.file_url.startsWith('logs/')) {
          filePath = log.file_url;
        } else {
          const match = log.file_url.match(/(?:\/)?task-logs\/(logs\/[^\/?#]+)$/);
          if (match && match[1]) {
            filePath = decodeURIComponent(match[1]);
          }
        }
        if (filePath) {
          try {
            console.log('Attempting to delete file from bucket:', filePath);
            const removeResult = await supabaseAdmin.storage.from('task-logs').remove([filePath]);
            console.log('Supabase remove result:', removeResult);
            if (removeResult.error) {
              console.error('Error deleting file from bucket:', removeResult.error.message);
              return res.status(500).json({ error: 'Failed to delete file from bucket', details: removeResult.error.message });
            }
          } catch (err) {
            console.error('Exception during file removal:', err);
            return res.status(500).json({ error: 'Exception during file removal', details: err.message });
          }
        } else {
          console.warn('File path extraction failed for:', log.file_url);
        }
      }
      
      await supabase
        .from('task_logs')
        .delete()
        .eq('id', evaluation.log_id);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
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
        const match = log.file_url.match(/\/task-logs\/(.+)$/);
        if (match && match[1]) {
          const filePath = decodeURIComponent(match[1]);
          try {
            await supabaseAdmin.storage.from('task-logs').remove([filePath]);
          } catch (err) {
          }
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
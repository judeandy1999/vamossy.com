// pages/api/gpt-center/scheduler.js
import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  // Verify this is called from a secure source (API key, etc.)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = new Date();
    
    // Find tasks that need to be triggered
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_active', true)
      .lte('next_trigger_at', now.toISOString());

    if (error) throw error;

    for (const task of tasks) {
      // Create task execution
      await supabase
        .from('task_executions')
        .insert({
          task_id: task.id,
          user_id: task.assigned_user_id,
          triggered_at: now.toISOString()
        });

      // Calculate next trigger time
      let nextTrigger = new Date(now);
      switch (task.frequency) {
        case 'daily':
          nextTrigger.setDate(nextTrigger.getDate() + 1);
          break;
        case 'weekly':
          nextTrigger.setDate(nextTrigger.getDate() + 7);
          break;
        case 'monthly':
          nextTrigger.setMonth(nextTrigger.getMonth() + 1);
          break;
        default:
          nextTrigger = null; // One-time task
      }

      // Update next trigger time
      await supabase
        .from('tasks')
        .update({ 
          next_trigger_at: nextTrigger?.toISOString() || null 
        })
        .eq('id', task.id);
    }

    res.status(200).json({ 
      success: true, 
      triggered: tasks.length 
    });

  } catch (error) {
    console.error('Scheduler error:', error);
    res.status(500).json({ error: 'Scheduler failed' });
  }
}
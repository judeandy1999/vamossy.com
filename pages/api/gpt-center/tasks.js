// pages/api/gpt-center/tasks.js
import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';
import { getUserRole } from '@/utils/getUserRole';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;
  
  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  const userRole = await getUserRole(user.email);
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, user, userRole);
    case 'POST':
      return handlePost(req, res, user, userRole);
    case 'PUT':
      return handlePut(req, res, user, userRole, id);
    case 'DELETE':
      return handleDelete(req, res, user, userRole, id);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req, res, user, userRole) {
  try {
    const { all } = req.query;

    let query;
    
    if (all === 'true' && userRole === 'admin') {
      query = supabase
      .from('tasks')
      .select(`
        *,
        task_assignments (
          user_id,
          status,
          users (
            name,
            email
          )
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    } else {
      query = supabase
        .from('tasks')
        .select(`
          *,
          task_assignments!inner (
            user_id,
            status,
            completed_at
          )
        `)
        .eq('is_active', true)
        .eq('task_assignments.user_id', user.id)
        .order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ tasks: data });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

async function handlePost(req, res, user, userRole) {
  try {    
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create tasks' });
    }

    const { title, description, gpt_url, evaluation_prompt, frequency, notification_type, assigned_user_ids } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    if (!Array.isArray(assigned_user_ids) || assigned_user_ids.length === 0) {
      return res.status(400).json({ error: 'At least one user must be assigned' });
    }

    // Insert the task (without assigned_user_id)
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        gpt_url,
        evaluation_prompt,
        frequency,
        notification_type,
        created_by: user.id,
        completed_at: null,
        status: 'pending',
        is_active: true,
      })
      .select()
      .single();

    if (taskError) {
      console.error('Supabase error:', taskError);
      throw taskError;
    }
    
    const assignments = assigned_user_ids.map(user_id => ({
      task_id: task.id,
      user_id,
    }));

    const { error: assignError } = await supabase
      .from('task_assignments')
      .insert(assignments);

    if (assignError) {
      return res.status(500).json({ error: 'Failed to assign users to task' });
    }

    return res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
}

async function handlePut(req, res, user, userRole) {
  try {
    const { id, assigned_user_ids, ...updates } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const isStatusUpdate = updates.hasOwnProperty('status') && Object.keys(updates).length <= 3;
    const isFullUpdate = updates.hasOwnProperty('title') || updates.hasOwnProperty('description');

    if (isFullUpdate) {
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Only admins can update task details' });
      }

      if (updates.title && !updates.title.trim()) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }

      if (updates.description && !updates.description.trim()) {
        return res.status(400).json({ error: 'Description cannot be empty' });
      }

    } else if (isStatusUpdate) {
      const { status, user_id, completed_at } = updates;

      const updateFields = {
        status,
        completed_at
      };

      const { data: updatedAssignments, error: assignmentError } = await supabase
        .from('task_assignments')
        .update(updateFields)
        .eq('task_id', id)
        .eq('user_id', user_id)
        .select();

      if (assignmentError || !updatedAssignments || updatedAssignments.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      } else {
        return res.status(200).json({ task: updatedAssignments[0] });
      }
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found or already deleted' });
    }

    if (Array.isArray(assigned_user_ids)) {
      const { error: deleteError } = await supabase
        .from('task_assignments')
        .delete()
        .eq('task_id', id);

      if (deleteError) {
        return res.status(500).json({ error: 'Failed to remove previous assignees' });
      }

      if (assigned_user_ids.length > 0) {
        const assignments = assigned_user_ids.map(user_id => ({
          task_id: id,
          user_id,
        }));

        const { error: assignError } = await supabase
          .from('task_assignments')
          .insert(assignments);

        if (assignError) {
          return res.status(500).json({ error: 'Failed to assign users to task' });
        }
      }
    }

    return res.status(200).json({ task: updatedTask });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to update task',
      details: error.message 
    });
  }
}

async function handleDelete(req, res, user, userRole, id) {
  try {
    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete tasks' });
    }

    const { error: assignmentError } = await supabase
      .from('task_assignments')
      .delete()
      .eq('task_id', id);

    if (assignmentError) {
      return res.status(500).json({ error: 'Failed to delete task assignments' });
    }

    const { error: taskError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (taskError) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
}
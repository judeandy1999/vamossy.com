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
          users!tasks_assigned_user_id_fkey (
            id,
            email,
            name,
            role
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
    } else {
      query = supabase
        .from('tasks')
        .select('*')
        .eq('assigned_user_id', user.id)
        .eq('is_active', true)
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
    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create tasks' });
    }

    const { title, description, gpt_url, frequency, notification_type, assigned_user_id } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        gpt_url,
        frequency,
        notification_type,
        assigned_user_id,
        created_by: user.id,
        completed_at: null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return res.status(201).json({ task: data });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
}

async function handlePut(req, res, user, userRole) {
  try {
    const { id, ...updates } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    console.log('Updating task:', { taskId: id, updates, userRole });

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

      console.log('Performing full task update');
    } else if (isStatusUpdate) {
      if (userRole !== 'admin') {
        const { data: taskCheck, error: checkError } = await supabase
          .from('tasks')
          .select('assigned_user_id')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (checkError || !taskCheck) {
          return res.status(404).json({ error: 'Task not found' });
        }

        if (taskCheck.assigned_user_id !== user.id) {
          return res.status(403).json({ error: 'You can only update your own tasks' });
        }
      }

      console.log('Performing status update');
    } else {
      return res.status(400).json({ error: 'Invalid update data' });
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Task not found or already deleted' });
    }

    console.log('Task updated successfully:', data.id);
    return res.status(200).json({ task: data });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ 
      error: 'Failed to update task',
      details: error.message 
    });
  }
}

async function handleDelete(req, res, user, userRole, id) {
  try {
    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete tasks' });
    }

    const { error } = await supabase
      .from('tasks')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
}
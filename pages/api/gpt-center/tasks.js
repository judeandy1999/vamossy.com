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

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, user, userRole);
    case 'POST':
      return handlePost(req, res, user, userRole);
    case 'PUT':
      return handlePut(req, res, user, userRole);
    case 'DELETE':
      return handleDelete(req, res, user, userRole);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req, res, user, userRole) {
  try {
    const { all } = req.query;

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('assigned_user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (all && userRole === 'admin') {
      query = supabase
        .from('tasks')
        .select('*, users(email, name)')
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
        created_by: user.id
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
    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update tasks' });
    }

    const { id, ...updates } = req.body;

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ task: data });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
}

async function handleDelete(req, res, user, userRole) {
  try {
    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete tasks' });
    }

    const { id } = req.query;

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
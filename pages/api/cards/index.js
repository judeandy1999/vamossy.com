import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, user);
    case 'POST':
      return handlePost(req, res, user);
    case 'PUT':
      return handlePut(req, res, user);
    case 'DELETE':
      return handleDelete(req, res, user);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req, res, user) {
  try {
    // Get user role from your user management system
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    let query;
    
    if (userData.role === 'admin') {
      // Admin can see all cards with their assignments
      query = supabase
        .from('effort_reward_cards')
        .select(`
          *,
          created_by,
          effort_reward_card_assignments (
            user_id,
            assigned_at
          )
        `);
    } else {
      // Non-admin users can only see cards assigned to them
      query = supabase
        .from('effort_reward_cards')
        .select(`
          *,
          created_by,
          effort_reward_card_assignments!inner (
            user_id,
            assigned_at
          )
        `)
        .eq('effort_reward_card_assignments.user_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      cards: data || [],
      userRole: userData.role
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch cards',
      details: error.message
    });
  }
}

async function handlePost(req, res, user) {
  try {
    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    if (userData.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can create cards'
      });
    }

    const { name, category, description, effort, reward, comment, assigned_user_ids } = req.body;

    if (!name?.trim() || !category?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Name and category are required'
      });
    }

    if (!assigned_user_ids || assigned_user_ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one user must be assigned to the card'
      });
    }

    const cardData = {
      name: name.trim(),
      category: category.trim(),
      description: description?.trim() || '',
      effort: parseInt(effort) || 1,
      reward: parseInt(reward) || 1,
      comment: comment?.trim() || '',
      created_by: user.id
    };

    // Insert the card
    const { data: cardResult, error: cardError } = await supabase
      .from('effort_reward_cards')
      .insert([cardData])
      .select()
      .single();

    if (cardError) throw cardError;

    // Insert card assignments
    const assignments = assigned_user_ids.map(userId => ({
      card_id: cardResult.id,
      user_id: userId
    }));

    const { error: assignmentError } = await supabase
      .from('effort_reward_card_assignments')
      .insert(assignments);

    if (assignmentError) throw assignmentError;

    // Fetch the complete card with assignments
    const { data: completeCard, error: fetchError } = await supabase
      .from('effort_reward_cards')
      .select(`
        *,
        effort_reward_card_assignments (
          user_id,
          assigned_at
        )
      `)
      .eq('id', cardResult.id)
      .single();

    if (fetchError) throw fetchError;

    return res.status(201).json({
      success: true,
      card: completeCard,
      message: 'Card created successfully'
    });
  } catch (error) {
    console.error('Error creating card:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create card',
      details: error.message
    });
  }
}

async function handlePut(req, res, user) {
  try {
    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    if (userData.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can update cards'
      });
    }

    const { id, name, category, description, effort, reward, comment, assigned_user_ids } = req.body;

    if (!id || !name?.trim() || !category?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'ID, name, and category are required'
      });
    }

    const cardData = {
      name: name.trim(),
      category: category.trim(),
      description: description?.trim() || '',
      effort: parseInt(effort) || 1,
      reward: parseInt(reward) || 1,
      comment: comment?.trim() || ''
    };

    // Update the card
    const { data: cardResult, error: cardError } = await supabase
      .from('effort_reward_cards')
      .update(cardData)
      .eq('id', id)
      .select()
      .single();

    if (cardError) throw cardError;

    // Update assignments if provided
    if (assigned_user_ids && assigned_user_ids.length > 0) {
      // Delete existing assignments
      const { error: deleteError } = await supabase
        .from('effort_reward_card_assignments')
        .delete()
        .eq('card_id', id);

      if (deleteError) throw deleteError;

      // Insert new assignments
      const assignments = assigned_user_ids.map(userId => ({
        card_id: id,
        user_id: userId
      }));

      const { error: assignmentError } = await supabase
        .from('effort_reward_card_assignments')
        .insert(assignments);

      if (assignmentError) throw assignmentError;
    }

    // Fetch the complete card with assignments
    const { data: completeCard, error: fetchError } = await supabase
      .from('effort_reward_cards')
      .select(`
        *,
        effort_reward_card_assignments (
          user_id,
          assigned_at
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    return res.status(200).json({
      success: true,
      card: completeCard,
      message: 'Card updated successfully'
    });
  } catch (error) {
    console.error('Error updating card:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update card',
      details: error.message
    });
  }
}

async function handleDelete(req, res, user) {
  try {
    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    if (userData.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete cards'
      });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Card ID is required'
      });
    }

    // Delete the card (assignments will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('effort_reward_cards')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting card:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete card',
      details: error.message
    });
  }
}
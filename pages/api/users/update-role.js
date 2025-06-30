import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';
import { getUserRole } from '@/utils/getUserRole';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, error: authError } = await verifySupabaseAuth(req);
    if (authError) {
      return res.status(401).json({ error: authError });
    }

    // Check if the requesting user is an admin
    const requestingUserRole = await getUserRole(user.email);
    if (requestingUserRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update user roles' });
    }

    const { userId, newRole } = req.body;

    // Validate required fields
    if (!userId || !newRole) {
      return res.status(400).json({ error: 'User ID and new role are required' });
    }

    // Validate role
    const validRoles = ['admin', 'worker', 'user'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, worker, or user' });
    }

    // Prevent users from removing their own admin role (safety check)
    if (user.id === userId && newRole !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own admin privileges' });
    }

    // Update the user's role
    const { data, error } = await supabase
      .from('users')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, email, name, role')
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${newRole}`,
      user: data
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update user role',
      details: error.message
    });
  }
}

import { supabase } from '@/utils/client';
import { z } from 'zod';

const TabSchema = z.object({
  wiki_id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
});

const UpdateTabSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export default async function handler(req, res) {
  try {

    if (req.method === 'GET') {
      const { wiki_id } = req.query;

      const query = supabase.from('tab_options').select('*');
      if (wiki_id) {
        query.eq('wiki_id', wiki_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json({ success: true, data });
    }
    
    if (req.method === 'POST') {
      const parseResult = TabSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid data',
          details: parseResult.error.errors,
        });
      }

      const { wiki_id, name, description } = parseResult.data;
      const { data, error } = await supabase
        .from('tab_options')
        .insert([{ wiki_id, name, description }])
        .select();

      if (error) throw error;

      return res.status(201).json({ success: true, data });
    } 
    
    if (req.method === 'PUT') {
      const parseResult = UpdateTabSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid data',
          details: parseResult.error.errors,
        });
      }

      const { id, name, description } = parseResult.data;
      const { data, error } = await supabase
        .from('tab_options')
        .update({ name, description })
        .eq('id', id)
        .select();
      
      if (error) throw error;

      return res.status(200).json({ success: true, data });
    } 
    
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ success: false, error: 'Invalid tab ID' });
      }

      const { error } = await supabase.from('tab_options').delete().eq('id', id);
      if (error) throw error;

      return res.status(200).json({ success: true, data: { message: `Tab ${id} deleted.` } });
    }  
    
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
}
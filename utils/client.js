import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Prevent token refresh from hanging
    flowType: 'pkce'
  },
  // Set global request timeout
  global: {
    headers: {
      'Content-Type': 'application/json',
    }
  },
  // Ensure requests don't hang
  realtime: {
    timeout: 15000
  }
});

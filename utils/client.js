import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    enabled: false // Disable realtime to prevent connection hanging
  }
});

// If you need realtime for other features, create a separate client
export const supabaseRealtime = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    enabled: true
  }
});

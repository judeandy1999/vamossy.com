import { supabase } from '@/utils/client';

// Google sign-in
export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/create-article` },
  });
};


// Email/password sign-in
export const signInWithEmail = async (email, password) => {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const resetPassword = async (email) => {
  const { data: existingUser } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (!existingUser) {
    return { error: { message: 'No user found with this email.' } };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  });

  return { error };
};

// Check session
export const getSession = async () => {
  return supabase.auth.getSession();
};

// Sign out
export const signOut = async () => {
  return supabase.auth.signOut();
};

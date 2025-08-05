import { supabase } from '@/utils/client';

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/user-dashboard` },
  });

  if (error) {
    return { error };
  }

  return new Promise((resolve) => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { user } = session;
        resolve({ user });
      }
    });
  });
};

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

export const isOAuthUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isOAuth: false, provider: null };
    }

    // Check if user has any OAuth identities
    const oauthIdentities = user.identities?.filter(
      identity => identity.provider !== 'email'
    );

    return {
      isOAuth: oauthIdentities && oauthIdentities.length > 0,
      provider: oauthIdentities?.[0]?.provider || null
    };
  } catch (err) {
    return { isOAuth: false, provider: null };
  }
};

export const signInAndUpdatePassword = async (currentPassword, newPassword) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    const { isOAuth, provider } = await isOAuthUser();
    
    if (isOAuth) {
      return { 
        error: { 
          message: `Cannot change password for ${provider} sign-in. Please manage your password through ${provider}.` 
        } 
      };
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (authError) {
      return { error: { message: 'Current password is incorrect' } };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error };
  } catch (err) {
    return { error: { message: 'An unexpected error occurred' } };
  }
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export async function verifyOtpToken({ email, token }) {
  return await supabase.auth.verifyOtp({ email, token: token, type: 'recovery' });
}

export async function updateUserPassword(password) {
  return await supabase.auth.updateUser({ password });
}


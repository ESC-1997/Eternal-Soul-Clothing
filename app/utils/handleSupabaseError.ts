import { supabase } from '../supabaseClient';

export async function handleSupabaseError(error: any) {
  if (error?.status === 401 || error?.message?.toLowerCase().includes('auth session missing')) {
    await supabase.auth.signOut();
    window.location.reload();
    return true; // handled
  }
  return false; // not handled
} 
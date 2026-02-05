import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials - anon key is safe to expose publicly
const SUPABASE_URL = 'https://cixpattezopxofasfste.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpeHBhdHRlem9weG9mYXNmc3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzE2NDIsImV4cCI6MjA4NTgwNzY0Mn0.ExFJCJCVb0iPn1R1sMHWmStf2gSXWZMBwqXoNc3sJ9g';

// Create Supabase client with hardcoded values
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Always return true since we have hardcoded values
export const isSupabaseConfigured = (): boolean => {
  return true;
};

// Test Supabase connection
export const testConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
};

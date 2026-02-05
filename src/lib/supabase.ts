import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration - using environment variables with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cixpattezopxofasfste.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpeHBhdHRlem9weG9mYXNmc3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzE2NDIsImV4cCI6MjA4NTgwNzY0Mn0.ExFJCJCVb0iPn1R1sMHWmStf2gSXWZMBwqXoNc3sJ9g';

// Debug logging
console.log('🔧 Supabase Configuration:');
console.log('  URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET');
console.log('  Key:', supabaseAnonKey ? 'Set (length: ' + supabaseAnonKey.length + ')' : 'NOT SET');

// Create Supabase client
let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  console.log('✅ Supabase client created successfully');
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error);
  // Create a dummy client that will fail gracefully
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey.startsWith('eyJ'));
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

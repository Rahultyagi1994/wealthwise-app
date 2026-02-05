import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, Investment, Goal, Achievement } from '../types';

interface User {
  id: string;
  email: string;
  name: string;
}

interface UserData {
  profile: UserProfile | null;
  investments: Investment[];
  goals: Goal[];
  achievements: Achievement[];
}

interface AuthContextType {
  user: User | null;
  userData: UserData;
  isLoading: boolean;
  isOnline: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  updateInvestments: (investments: Investment[]) => Promise<void>;
  updateGoals: (goals: Goal[]) => Promise<void>;
  updateAchievements: (achievements: Achievement[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for localStorage fallback
const getLocalData = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const setLocalData = (key: string, data: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>({
    profile: null,
    investments: [],
    goals: [],
    achievements: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline] = useState(isSupabaseConfigured());

  // Load user data from Supabase or localStorage
  const loadUserData = async (userId: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('user_data')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading user data:', error);
          // Fallback to localStorage
          loadLocalUserData(userId);
          return;
        }

        if (data) {
          setUserData({
            profile: data.profile || null,
            investments: data.investments || [],
            goals: data.goals || [],
            achievements: data.achievements || []
          });
        }
      } catch (e) {
        console.error('Supabase error:', e);
        loadLocalUserData(userId);
      }
    } else {
      loadLocalUserData(userId);
    }
  };

  const loadLocalUserData = (userId: string) => {
    setUserData({
      profile: getLocalData(`wealthwise_profile_${userId}`),
      investments: getLocalData(`wealthwise_investments_${userId}`) || [],
      goals: getLocalData(`wealthwise_goals_${userId}`) || [],
      achievements: getLocalData(`wealthwise_achievements_${userId}`) || []
    });
  };

  // Save user data to Supabase or localStorage
  const saveUserData = async (userId: string, data: Partial<UserData>) => {
    const newUserData = { ...userData, ...data };
    setUserData(newUserData);

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('user_data')
          .upsert({
            user_id: userId,
            profile: newUserData.profile,
            investments: newUserData.investments,
            goals: newUserData.goals,
            achievements: newUserData.achievements,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (error) {
          console.error('Error saving to Supabase:', error);
          // Fallback to localStorage
          saveLocalUserData(userId, newUserData);
        }
      } catch (e) {
        console.error('Supabase error:', e);
        saveLocalUserData(userId, newUserData);
      }
    } else {
      saveLocalUserData(userId, newUserData);
    }
  };

  const saveLocalUserData = (userId: string, data: UserData) => {
    if (data.profile) setLocalData(`wealthwise_profile_${userId}`, data.profile);
    setLocalData(`wealthwise_investments_${userId}`, data.investments);
    setLocalData(`wealthwise_goals_${userId}`, data.goals);
    setLocalData(`wealthwise_achievements_${userId}`, data.achievements);
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const currentUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'
            };
            setUser(currentUser);
            await loadUserData(session.user.id);
          }
        } catch (e) {
          console.error('Auth init error:', e);
          checkLocalSession();
        }
      } else {
        checkLocalSession();
      }
      setIsLoading(false);
    };

    const checkLocalSession = () => {
      const savedSession = getLocalData('wealthwise_session');
      const rememberMe = getLocalData('wealthwise_remember');
      
      if (savedSession && rememberMe) {
        setUser(savedSession);
        loadLocalUserData(savedSession.id);
      }
    };

    initAuth();

    // Listen for auth changes if Supabase is configured
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'
          };
          setUser(currentUser);
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserData({ profile: null, investments: [], goals: [], achievements: [] });
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newUser = {
            id: data.user.id,
            email: data.user.email || email,
            name
          };
          setUser(newUser);
          
          // Create initial user data record
          await supabase.from('user_data').insert({
            user_id: data.user.id,
            profile: null,
            investments: [],
            goals: [],
            achievements: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

          return { success: true };
        }
        
        return { success: false, error: 'Failed to create account' };
      } catch (e) {
        console.error('Sign up error:', e);
        return signUpLocal(email, password, name);
      }
    } else {
      return signUpLocal(email, password, name);
    }
  };

  const signUpLocal = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Check if user already exists
    const users = getLocalData('wealthwise_users') || {};
    if (users[email]) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const userId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = { id: userId, email, name };
    
    // Hash password (simple hash for demo - in production use bcrypt)
    const hashedPassword = btoa(password);
    users[email] = { ...newUser, password: hashedPassword };
    setLocalData('wealthwise_users', users);
    
    setUser(newUser);
    setLocalData('wealthwise_session', newUser);
    setLocalData('wealthwise_remember', true);
    
    return { success: true };
  };

  const signIn = async (email: string, password: string, rememberMe: boolean): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const currentUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0]
          };
          setUser(currentUser);
          await loadUserData(data.user.id);
          return { success: true };
        }

        return { success: false, error: 'Failed to sign in' };
      } catch (e) {
        console.error('Sign in error:', e);
        return signInLocal(email, password, rememberMe);
      }
    } else {
      return signInLocal(email, password, rememberMe);
    }
  };

  const signInLocal = async (email: string, password: string, rememberMe: boolean): Promise<{ success: boolean; error?: string }> => {
    const users = getLocalData('wealthwise_users') || {};
    const user = users[email];
    
    if (!user) {
      return { success: false, error: 'No account found with this email' };
    }

    const hashedPassword = btoa(password);
    if (user.password !== hashedPassword) {
      return { success: false, error: 'Incorrect password' };
    }

    const currentUser = { id: user.id, email: user.email, name: user.name };
    setUser(currentUser);
    loadLocalUserData(user.id);
    
    if (rememberMe) {
      setLocalData('wealthwise_session', currentUser);
      setLocalData('wealthwise_remember', true);
    }
    
    return { success: true };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    
    setUser(null);
    setUserData({ profile: null, investments: [], goals: [], achievements: [] });
    localStorage.removeItem('wealthwise_session');
    localStorage.removeItem('wealthwise_remember');
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (e) {
        console.error('Reset password error:', e);
        return { success: false, error: 'Failed to send reset email. Please try again.' };
      }
    } else {
      // For local mode, we'll show instructions
      const users = getLocalData('wealthwise_users') || {};
      const user = users[email];
      
      if (!user) {
        return { success: false, error: 'No account found with this email address.' };
      }

      // In local mode, generate a temporary password and show it
      // In a real app, you'd send an email
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = btoa(tempPassword);
      users[email].password = hashedPassword;
      setLocalData('wealthwise_users', users);
      
      // Show an alert with the new password (only for local/demo mode)
      alert(`🔐 Password Reset (Demo Mode)\n\nYour temporary password is: ${tempPassword}\n\nPlease use this to sign in and then update your password.`);
      
      return { success: true };
    }
  };

  const updateProfile = async (profile: UserProfile) => {
    if (user) {
      await saveUserData(user.id, { profile });
    }
  };

  const updateInvestments = async (investments: Investment[]) => {
    if (user) {
      await saveUserData(user.id, { investments });
    }
  };

  const updateGoals = async (goals: Goal[]) => {
    if (user) {
      await saveUserData(user.id, { goals });
    }
  };

  const updateAchievements = async (achievements: Achievement[]) => {
    if (user) {
      await saveUserData(user.id, { achievements });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isLoading,
        isOnline,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        updateInvestments,
        updateGoals,
        updateAchievements
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Authentication Context — Supabase Auth with real-time session tracking
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { FarmerUser, fetchProfile } from '../services/authService';

interface AuthContextType {
  user: FarmerUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: FarmerUser | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarmerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle app state changes (refresh token)
  useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, []);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (mounted) setUser(profile);
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    // Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await fetchProfile(session.user.id);
          if (mounted) setUser(profile);
        } catch {
          if (mounted) setUser(null);
        } finally {
          if (mounted) setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      } catch {
        setUser(null);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      setUser,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

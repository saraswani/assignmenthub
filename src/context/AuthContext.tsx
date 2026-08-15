import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserSession } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  session: UserSession;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openLoginModal: boolean;
  setOpenLoginModal: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'assignment_hub_admin_session_v3';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && typeof parsed.isAdmin === 'boolean') {
          return parsed;
        }
      }
    } catch {
      // Fallback on parse error
    }
    return { isAdmin: false };
  });

  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session:', e);
    }
  }, [session]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const newSession: UserSession = { isAdmin: true, email: data.user.email };
          setSession(newSession);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Supabase login failed' };
      }
    }

    // Default admin fallback validation
    const trimmedEmail = email.trim().toLowerCase();
    if ((trimmedEmail === 'admin@assignmenthub.edu' || trimmedEmail === 'admin') && pass === 'admin123') {
      const newSession: UserSession = { isAdmin: true, email: 'admin@assignmenthub.edu' };
      setSession(newSession);
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials. Try admin@assignmenthub.edu / admin123' };
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setSession({ isAdmin: false });
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, openLoginModal, setOpenLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

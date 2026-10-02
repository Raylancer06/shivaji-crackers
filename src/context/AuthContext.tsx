"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { supabase } from '@/lib/supabase/client';

export interface CustomerUser {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  role?: string;
  address_line?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface AuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isLoading: boolean;
  login: (loginInput: string, password: string) => Promise<CustomerUser>;
  register: (formData: Record<string, any>) => Promise<CustomerUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<CustomerUser | null>;
  updateUser: (userData: CustomerUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'sivaji_token';
const USER_KEY = 'sivaji_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Clear all customer session storage
  const clearSessionStorage = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      // Ignore
    }
    setToken(null);
    setUser(null);
  }, []);

  // Logout method
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    clearSessionStorage();
  }, [clearSessionStorage]);

  // Refresh profile from Supabase
  const refreshProfile = useCallback(async (): Promise<CustomerUser | null> => {
    try {
      const res = await api.getProfile();
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        return res.data;
      }
      return null;
    } catch (err: any) {
      return null;
    }
  }, []);

  // Initialize session on mount + listen to Supabase auth state changes
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentSession = sessionData?.session;

        if (currentSession?.user) {
          const accessToken = currentSession.access_token;
          setToken(accessToken);
          localStorage.setItem(TOKEN_KEY, accessToken);

          // Get profile
          const profileRes = await api.getProfile().catch(() => null);
          if (isMounted && profileRes?.data) {
            setUser(profileRes.data);
            localStorage.setItem(USER_KEY, JSON.stringify(profileRes.data));
          } else if (isMounted) {
            const fallbackUser: CustomerUser = {
              id: currentSession.user.id,
              name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0] || 'Customer',
              email: currentSession.user.email || '',
              phone: currentSession.user.user_metadata?.phone || '',
              role: currentSession.user.user_metadata?.role || 'customer',
            };
            setUser(fallbackUser);
            localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
          }
        } else {
          if (isMounted) {
            clearSessionStorage();
          }
        }
      } catch (err) {
        if (isMounted) clearSessionStorage();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // Supabase Auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setToken(session.access_token);
        localStorage.setItem(TOKEN_KEY, session.access_token);
        const profileRes = await api.getProfile().catch(() => null);
        if (profileRes?.data) {
          setUser(profileRes.data);
          localStorage.setItem(USER_KEY, JSON.stringify(profileRes.data));
        }
      } else if (event === 'SIGNED_OUT') {
        clearSessionStorage();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setToken(session.access_token);
        localStorage.setItem(TOKEN_KEY, session.access_token);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [clearSessionStorage]);

  // Login handler
  const login = async (loginInput: string, pass: string): Promise<CustomerUser> => {
    setIsLoading(true);
    try {
      const res = await api.login(loginInput, pass);
      if (res.data?.user) {
        const authUser = res.data.user;
        const authToken = res.data.token;

        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        return authUser;
      }
      throw new Error((res as any)?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (formData: Record<string, any>): Promise<CustomerUser> => {
    setIsLoading(true);
    try {
      const res = await api.register(formData);
      if (res.data?.user) {
        const authUser = res.data.user;
        const authToken = res.data.token;

        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        return authUser;
      }
      throw new Error(res.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: CustomerUser) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export interface CustomerUser {
  id: number;
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
const LEGACY_TOKEN_KEY = 'sivaji_customer_token';
const USER_KEY = 'sivaji_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Clear all customer session storage
  const clearSessionStorage = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      // Handle private browsing or localStorage restrictions
    }
    setToken(null);
    setUser(null);
  }, []);

  // Logout method (real backend logout + frontend state purge)
  const logout = useCallback(async () => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);
    if (currentToken) {
      try {
        await api.logout(currentToken);
      } catch (err) {
        console.warn('Backend logout encountered error, continuing local purge:', err);
      }
    }
    clearSessionStorage();
  }, [token, clearSessionStorage]);

  // Refresh profile from authoritative backend API
  const refreshProfile = useCallback(async (): Promise<CustomerUser | null> => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) : null);
    if (!activeToken) {
      clearSessionStorage();
      return null;
    }

    try {
      const res = await api.getProfile(activeToken);
      if (res?.data) {
        setUser(res.data);
        setToken(activeToken);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        return res.data;
      }
      return null;
    } catch (err: any) {
      console.warn('Authentication token verification failed, resetting session:', err);
      // If 401 or invalid token, immediately purge
      clearSessionStorage();
      return null;
    }
  }, [token, clearSessionStorage]);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
        const savedUserStr = localStorage.getItem(USER_KEY);

        if (!savedToken) {
          if (isMounted) {
            setUser(null);
            setToken(null);
            setIsLoading(false);
          }
          return;
        }

        // Optimistically set cached user to prevent flickering
        if (savedUserStr && isMounted) {
          try {
            const parsed = JSON.parse(savedUserStr);
            setUser(parsed);
            setToken(savedToken);
          } catch (e) {
            // Ignore parse errors
          }
        }

        // Authoritatively verify with backend
        try {
          const res = await api.getProfile(savedToken);
          if (isMounted && res?.data) {
            setUser(res.data);
            setToken(savedToken);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data));
          }
        } catch (err) {
          // Token expired or invalid on backend - purge session
          if (isMounted) {
            clearSessionStorage();
          }
        }
      } catch (e) {
        if (isMounted) clearSessionStorage();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        initAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [clearSessionStorage]);

  // Login handler
  const login = async (loginInput: string, pass: string): Promise<CustomerUser> => {
    setIsLoading(true);
    try {
      const res = await api.login(loginInput, pass);
      if (res.data?.token && res.data?.user) {
        const authToken = res.data.token;
        const authUser = res.data.user;

        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        return authUser;
      }
      throw new Error(res.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (formData: Record<string, any>): Promise<CustomerUser> => {
    setIsLoading(true);
    try {
      const res = await api.register(formData);
      if (res.data?.token && res.data?.user) {
        const authToken = res.data.token;
        const authUser = res.data.user;

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

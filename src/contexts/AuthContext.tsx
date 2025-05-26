import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session in localStorage
    const session = localStorage.getItem('session');
    if (session) {
      setUser(JSON.parse(session));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { session } = await api.auth.signIn(email, password);
      setUser(session.user);
      localStorage.setItem('session', JSON.stringify(session.user));
      navigate('/profile');
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      await api.auth.signUp(username, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    localStorage.removeItem('session');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
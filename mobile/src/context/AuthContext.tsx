import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, LoginPayload, RegisterPayload } from '../api/authApi';
import { User } from '../types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('authUser')
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw));
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(payload) {
      const nextUser = await authApi.login(payload);
      await AsyncStorage.setItem('authUser', JSON.stringify(nextUser));
      setUser(nextUser);
    },
    async register(payload) {
      await authApi.register(payload);
      const nextUser = await authApi.login({ username: payload.username, password: payload.password });
      await AsyncStorage.setItem('authUser', JSON.stringify(nextUser));
      setUser(nextUser);
    },
    async logout() {
      await AsyncStorage.removeItem('authUser');
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

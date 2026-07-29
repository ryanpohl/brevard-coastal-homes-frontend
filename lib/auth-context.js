'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from './api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'bch_auth'; // { token, user }

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Restore session on first load (client-only — localStorage isn't
  // available during server rendering).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setToken(parsed.token || null);
        setUser(parsed.user || null);
      }
    } catch {
      // ignore corrupt/blocked storage
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    try {
      if (nextToken) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore — session just won't survive a refresh
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { token: t, user: u } = await api.login({ email, password });
      persist(t, u);
      return u;
    },
    [persist]
  );

  const register = useCallback(
    async (name, email, password) => {
      const { token: t, user: u } = await api.register({ name, email, password });
      persist(t, u);
      return u;
    },
    [persist]
  );

  const signOut = useCallback(() => persist(null, null), [persist]);

  const updateUser = useCallback((nextUser) => persist(token, nextUser), [persist, token]);

  const value = useMemo(
    () => ({ token, user, signedIn: !!token, ready, login, register, signOut, updateUser }),
    [token, user, ready, login, register, signOut, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

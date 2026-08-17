'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as api from './api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'bch_auth'; // { token, user }

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  // Tracks which storage the current session lives in, so a later
  // persist() call that doesn't know/care about "remember me" (updateUser,
  // below) re-saves to the SAME storage instead of silently upgrading a
  // session-only login into a persistent one. Defaults true (localStorage)
  // to match this app's original always-localStorage behavior for anyone
  // not going through the new remember-me-aware login()/register().
  const rememberRef = useRef(true);

  // Restore session on first load (client-only — localStorage/sessionStorage
  // aren't available during server rendering). Checks localStorage first
  // (a "remember me" session — see persist() below), then falls back to
  // sessionStorage (a session that should end when the browser/tab closes).
  useEffect(() => {
    try {
      const fromLocal = window.localStorage.getItem(STORAGE_KEY);
      const raw = fromLocal || window.sessionStorage.getItem(STORAGE_KEY);
      rememberRef.current = !!fromLocal || !raw; // no existing session yet -> default to remembered
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

  // "Remember me on this machine" (Log In tab, 2026-08-16) — remember=true
  // (the default, and the only behavior this app had before this change)
  // persists to localStorage, which survives closing the browser entirely.
  // remember=false persists to sessionStorage instead, which clears when
  // the tab/browser closes — a real session-vs-persistent distinction
  // rather than a checkbox that doesn't actually do anything. Always
  // clears BOTH storages on every call so switching remember on/off (or
  // signing out) never leaves a stale, contradicting copy behind in the
  // other storage. `remember` defaults to whatever the current session is
  // already using (rememberRef) rather than always true, so calls that
  // don't pass it explicitly (updateUser) don't silently change a
  // session-only login into a persistent one.
  const persist = useCallback((nextToken, nextUser, remember = rememberRef.current) => {
    rememberRef.current = remember;
    setToken(nextToken);
    setUser(nextUser);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      if (nextToken) {
        const storage = remember ? window.localStorage : window.sessionStorage;
        storage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
      }
    } catch {
      // ignore — session just won't survive a refresh
    }
  }, []);

  const login = useCallback(
    async (email, password, remember = true) => {
      const { token: t, user: u } = await api.login({ email, password });
      persist(t, u, remember);
      return u;
    },
    [persist]
  );

  // phone/workingWithAgent added 2026-08-16 alongside the Register tab's
  // new optional fields — see api.js's register() comment.
  const register = useCallback(
    async (name, email, password, phone, workingWithAgent) => {
      const { token: t, user: u } = await api.register({ name, email, password, phone, workingWithAgent });
      persist(t, u, true);
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

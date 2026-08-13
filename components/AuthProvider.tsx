"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEMO_ACCOUNTS,
  ROLE_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  type Role,
  type Session,
} from "@/lib/auth";

type AuthContextValue = {
  session: Session | null;
  ready: boolean;
  login: (role: Role, email: string, password: string) => string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = useCallback((role: Role, email: string, password: string) => {
    const demo = DEMO_ACCOUNTS[role];
    const normalized = email.trim().toLowerCase();
    if (normalized !== demo.email || password !== demo.password) {
      return "Use the demo credentials shown for this role.";
    }
    const next: Session = {
      role,
      email: demo.email,
      name: demo.name,
      org: demo.org,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    setSession(next);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(ROLE_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, ready, login, logout }),
    [session, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

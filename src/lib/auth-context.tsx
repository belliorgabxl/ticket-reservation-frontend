"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@/types/auth";
import { getCurrentUser, logout as logoutApi } from "@/lib/api/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  // Re-fetches /auth/me and updates every consumer immediately. Call this
  // right after login/register succeeds — client-side navigation
  // (router.push) does not remount the layout, so components like the
  // header would otherwise never learn the session changed.
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const current = await getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextValue = {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyResetOtp: (email: string, token: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Map Supabase User to our AuthUser type
  const mapUser = (sbUser: User | null): AuthUser | null => {
    if (!sbUser) return null;
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || "User",
      email: sbUser.email || "",
      role: sbUser.app_metadata?.role || "customer",
    };
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const mappedUser = mapUser(session?.user ?? null);
      setUser(mappedUser);
      setIsAdmin(mappedUser?.role === "admin");
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const mappedUser = mapUser(session?.user ?? null);
      setUser(mappedUser);
      setIsAdmin(mappedUser?.role === "admin");
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function signInWithGoogle(credential: string) {
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
    });
    if (error) throw error;
  }

  async function signUp(name: string, email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  async function verifyResetOtp(email: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });
    if (error) throw error;
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signInWithGoogle, signUp, signOut, resetPassword, verifyResetOtp, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

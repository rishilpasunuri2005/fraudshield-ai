"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { API_URL } from "./api";

interface AuthState {
  token: string | null;
  role: "citizen" | "admin" | null;
  email: string | null;
  fullName: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (data: { email: string; password: string; full_name: string; role: string }) => Promise<{ error?: string }>;
  logout: () => void;
  authHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    if (typeof window === "undefined") return { token: null, role: null, email: null, fullName: null, isAuthenticated: false };
    const token = localStorage.getItem("auth-token");
    const role = localStorage.getItem("auth-role") as AuthState["role"];
    const email = localStorage.getItem("auth-email");
    const fullName = localStorage.getItem("auth-fullname");
    return {
      token,
      role: role === "citizen" || role === "admin" ? role : null,
      email,
      fullName,
      isAuthenticated: Boolean(token),
    };
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { error: data.detail || "Login failed" };
      }
      const data = await res.json();
      localStorage.setItem("auth-token", data.access_token);
      localStorage.setItem("auth-role", data.role);
      localStorage.setItem("auth-email", data.email);
      localStorage.setItem("auth-fullname", data.full_name);
      // Also set the role nav key for topnav compatibility
      localStorage.setItem("user-role", data.role === "admin" ? "police" : data.role);
      setState({ token: data.access_token, role: data.role, email: data.email, fullName: data.full_name, isAuthenticated: true });
      return {};
    } catch {
      return { error: "Unable to connect to server" };
    }
  }, []);

  const signup = useCallback(async (data: { email: string; password: string; full_name: string; role: string }) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return { error: errData.detail || "Signup failed" };
      }
      const result = await res.json();
      localStorage.setItem("auth-token", result.access_token);
      localStorage.setItem("auth-role", result.role);
      localStorage.setItem("auth-email", result.email);
      localStorage.setItem("auth-fullname", result.full_name);
      localStorage.setItem("user-role", result.role === "admin" ? "police" : result.role);
      setState({ token: result.access_token, role: result.role, email: result.email, fullName: result.full_name, isAuthenticated: true });
      return {};
    } catch {
      return { error: "Unable to connect to server" };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-role");
    localStorage.removeItem("auth-email");
    localStorage.removeItem("auth-fullname");
    localStorage.removeItem("user-role");
    setState({ token: null, role: null, email: null, fullName: null, isAuthenticated: false });
  }, []);

  const authHeaders = useCallback(() => {
    return state.token ? { Authorization: `Bearer ${state.token}` } : {};
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, authHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * AuthProvider — manages authentication state for the native app.
 *
 * Uses AsyncStorage to persist the session token between app launches.
 * Talks to the Next.js REST endpoints: /api/auth/login, /api/auth/register, /api/auth/me.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "boletify_auth_token";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  /** Sign in with email/password. Returns the user on success, throws on failure. */
  login: (email: string, password: string) => Promise<User>;
  /** Register a new account and auto sign-in. Returns the user on success, throws on failure. */
  register: (name: string, email: string, password: string) => Promise<User>;
  /** Clear session. */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getApiUrl() {
  return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  // On mount, check for a stored token and validate it
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(TOKEN_KEY);
        if (!stored) {
          setState({ user: null, token: null, loading: false });
          return;
        }

        const res = await fetch(`${getApiUrl()}/api/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` },
        });

        if (res.ok) {
          const user = await res.json();
          setState({ user, token: stored, loading: false });
        } else {
          // Token expired or invalid — clear it
          await AsyncStorage.removeItem(TOKEN_KEY);
          setState({ user: null, token: null, loading: false });
        }
      } catch {
        // Network error — keep token but no user session
        setState({ user: null, token: null, loading: false });
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${getApiUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    setState({ user: data.user, token: data.token, loading: false });
    return data.user;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<User> => {
      // 1. Register
      const regRes = await fetch(`${getApiUrl()}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        throw new Error(regData.error || "Error al crear la cuenta");
      }

      // 2. Auto login
      const loginRes = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        // Registration succeeded but login failed — shouldn't happen normally
        throw new Error("Cuenta creada, pero no se pudo iniciar sesión automáticamente");
      }

      await AsyncStorage.setItem(TOKEN_KEY, loginData.token);
      setState({ user: loginData.user, token: loginData.token, loading: false });
      return loginData.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

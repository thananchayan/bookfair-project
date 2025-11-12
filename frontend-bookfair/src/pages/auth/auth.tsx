// src/auth.tsx
import React, { createContext, useContext, useState, useCallback } from "react";

export type Role = "publisher" | "organizer";
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  companyName?: string;
}

type Ctx = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    companyName: string,
    role: Role
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

const mockUserPublisher: User = {
  id: "pub-1",
  email: "pub@test.com",
  name: "Demo Publisher",
  role: "publisher",
};
const mockUserOrganizer: User = {
  id: "org-1",
  email: "org@test.com",
  name: "Demo Organizer",
  role: "organizer",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, role: Role) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);

    if (password !== "password123") throw new Error("Invalid credentials");
    setUser(role === "publisher" ? mockUserPublisher : mockUserOrganizer);
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string, companyName: string, role: Role) => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setIsLoading(false);

      if (email.includes("error")) throw new Error("Email already in use");
      const newUser: User = {
        id: `new-${role}-${Math.random().toString(36).slice(2, 8)}`,
        email,
        name,
        role,
        ...(role === "publisher" && { companyName }),
      };
      setUser(newUser);
    },
    []
  );

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

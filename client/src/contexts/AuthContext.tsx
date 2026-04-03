import React, { createContext, useState, useContext, ReactNode } from "react";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  completeProfile: (profile: Omit<UserProfile, "id" | "createdAt">) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("citytech_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    // Mock login - in production, call backend
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Store partial user, waiting for profile completion
    localStorage.setItem("citytech_temp_email", email);
  };

  const signup = async (email: string, password: string) => {
    // Mock signup - in production, call backend
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("citytech_temp_email", email);
  };

  const completeProfile = async (profile: Omit<UserProfile, "id" | "createdAt">) => {
    const newUser: UserProfile = {
      ...profile,
      id: `user_${Date.now()}`,
      createdAt: new Date(),
    };
    setUser(newUser);
    localStorage.setItem("citytech_user", JSON.stringify(newUser));
    localStorage.removeItem("citytech_temp_email");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("citytech_user");
    localStorage.removeItem("citytech_temp_email");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, completeProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

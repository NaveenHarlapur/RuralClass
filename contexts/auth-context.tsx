"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface User {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  role: "student" | "teacher";
  college?: string;
  language?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    if (typeof window === "undefined") return;
    
    setIsLoading(true);
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const currentUserRaw = localStorage.getItem("currentUser");
      
      if (isLoggedIn && currentUserRaw) {
        const parsedUser = JSON.parse(currentUserRaw);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser as User);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthContext] Error refreshing user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshUser();
  }, []);

  // Step 7: Logout
  const signOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signOut,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

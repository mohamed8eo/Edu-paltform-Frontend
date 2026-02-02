"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { tokenManager } from "@/app/auth-api";

interface UserData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  lastLoginMethod: string;
  banned: boolean;
  banReason: null | string;
  banExpires: null | string;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setError(null);
      
      // Get token
      const token = tokenManager.getToken();
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      // Add Authorization header
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/me", {
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      console.log("✅ UserContext: User data loaded:", data);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user data");
      console.error("❌ UserContext: Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
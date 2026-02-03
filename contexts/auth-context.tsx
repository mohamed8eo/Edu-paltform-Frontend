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
      
      console.log("🔍 Fetching user data...");
      
      // Get token (checks cookies first, then localStorage)
      const token = tokenManager.getToken();
      
      if (!token) {
        console.log("⚠️ No token found, user not authenticated");
        setUser(null);
        setLoading(false);
        return;
      }

      console.log("✅ Token found, fetching user data");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const response = await fetch("/api/me", {
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        console.log("❌ Failed to fetch user, status:", response.status);
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
    console.log("🚀 UserProvider mounted, fetching user");
    fetchUser();

    // Refetch user when window gains focus (important for OAuth redirects)
    const handleFocus = () => {
      console.log("👀 Window focused, checking for token updates");
      const hasToken = tokenManager.hasToken();
      console.log("Has token:", hasToken);
      
      // Only refetch if we have a token but no user data
      if (hasToken && !user) {
        console.log("🔄 Token exists but no user data, refetching...");
        fetchUser();
      }
    };

    window.addEventListener("focus", handleFocus);
    
    // Also listen for storage changes (in case token is set in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "better-auth.session_token") {
        console.log("💾 Token changed in localStorage, refetching user");
        fetchUser();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
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
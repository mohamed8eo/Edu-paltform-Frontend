"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { tokenManager, authApi } from "@/app/auth-api";

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

      console.log("🔍 UserContext: Fetching user data...");
      console.log("🌐 Current URL:", window.location.href);
      console.log("🍪 Document cookies:", document.cookie);

      // Get token from localStorage if available (email/password auth)
      let token = tokenManager.getToken();
      console.log(
        "🔑 Token from tokenManager:",
        token ? `${token.substring(0, 20)}...` : "null",
      );

      // If no token in localStorage, try to get it from session endpoint
      // This handles the case where token is in HttpOnly cookie (social auth)
      let isSocialAuth = false;
      if (!token) {
        console.log(
          "⚠️ No token in localStorage, checking session endpoint...",
        );
        try {
          const sessionData = await authApi.getSession();
          if (sessionData && sessionData.authenticated) {
            console.log(
              "✅ Session found - this is social auth, will use cookies",
            );
            isSocialAuth = true;
          }
        } catch (sessionError) {
          console.log("❌ Session check failed:", sessionError);
        }
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Only add Authorization header if we have a real token (email/password auth)
      // For social auth (HttpOnly cookie), we don't add Authorization header
      if (token && !isSocialAuth) {
        console.log("✅ Using token from localStorage for API call");
        headers["Authorization"] = `Bearer ${token}`;
      } else if (isSocialAuth) {
        console.log(
          "✅ Using cookies for social auth - no Bearer token needed",
        );
      } else {
        console.log("ℹ️ No token available, will use cookies if available");
      }

      // Always make the request - the API route will check cookies too
      console.log("📡 Calling /api/me...");
      const response = await fetch("/api/me", {
        credentials: "include", // This ensures cookies are sent
        headers,
      });

      console.log("📥 Response status:", response.status);
      console.log("🍪 Cookies after request:", document.cookie);

      if (!response.ok) {
        const errorText = await response.text();
        console.log(
          "❌ Failed to fetch user, status:",
          response.status,
          "Error:",
          errorText,
        );
        setUser(null);
        return;
      }

      const data = await response.json();
      console.log("✅ UserContext: User data loaded:", data);
      setUser(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data",
      );
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
    console.log("🚀 UserProvider: Initial user fetch");

    // Check if we're coming back from OAuth (has token in URL or header)
    const checkForOAuthToken = () => {
      // Check URL search params for token
      const searchParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = searchParams.get("token");

      if (tokenFromUrl) {
        console.log("🔐 OAuth token found in URL, storing in localStorage...");
        tokenManager.setToken(tokenFromUrl);
        // Clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    };

    checkForOAuthToken();
    fetchUser();

    // Refetch when window gains focus (useful after OAuth redirect)
    const handleFocus = () => {
      console.log("👀 Window focused, checking for user updates");
      // Only refetch if we don't have user data yet
      if (!user) {
        fetchUser();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
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

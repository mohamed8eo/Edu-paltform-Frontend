import { NEXT_PUBLIC_BACKEND_URL } from "@/lib/api";

const API_BASE_URL = `${NEXT_PUBLIC_BACKEND_URL}/auth`;

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export type SocialProvider = "google" | "github";

export interface AuthResponse {
  message?: string;
  accessToken: string;
  refresh_token: string;
}

// Token management functions
const TOKEN_KEY = "accessToken";

export const tokenManager = {
  setToken: (token: string) => {
    // Store in localStorage for client-side access
    localStorage.setItem(TOKEN_KEY, token);

    // Also set as cookie for middleware/server-side access
    const cookieAttributes = `path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `${TOKEN_KEY}=${token}; ${cookieAttributes}`;
  },

  setRefreshToken: (token: string) => {
    // Store refresh token as a cookie for backend to read
    const cookieAttributes = `path=/; max-age=${60 * 60 * 24 * 30}`;
    document.cookie = `refresh_token=${token}; ${cookieAttributes}`;
  },

  getToken: (): string | null => {
    // Check localStorage first
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) {
      return localToken;
    }

    // Fallback to cookies
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === TOKEN_KEY) {
        return value;
      }
    }

    return null;
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);

    // Clear auth cookies
    const cookieNames = [TOKEN_KEY, "refresh_token"];
    cookieNames.forEach((name) => {
      document.cookie = `${name}=; path=/; max-age=0`;
      document.cookie = `${name}=; path=/; domain=${window.location.hostname}; max-age=0`;
    });

    sessionStorage.clear();
  },

  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  },
};

async function handleResponse<T>(response: Response): Promise<T> {
  let data;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      );
    }
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
}

// Helper to get headers with auth token
function getAuthHeaders(): HeadersInit {
  const token = tokenManager.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export const authApi = {
  signUp: async (payload: SignUpPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await handleResponse<AuthResponse>(res);

    if (data.accessToken) {
      tokenManager.setToken(data.accessToken);
    }
    if (data.refresh_token) {
      tokenManager.setRefreshToken(data.refresh_token);
    }

    return data;
  },

  signIn: async (payload: SignInPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await handleResponse<AuthResponse>(res);

    if (data.accessToken) {
      tokenManager.setToken(data.accessToken);
    }
    if (data.refresh_token) {
      tokenManager.setRefreshToken(data.refresh_token);
    }

    return data;
  },

  /**
   * Redirect to the backend OAuth login URL for Google or GitHub.
   * The backend will redirect the user to the provider,
   * then callback redirects to the frontend with ?token=<access_token>
   */
  signInSocial: (provider: SocialProvider) => {
    const loginUrl = `${NEXT_PUBLIC_BACKEND_URL}/auth/${provider}/login`;
    window.location.href = loginUrl;
  },

  signOut: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/sign-out`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
      });
    } catch {
      // Continue to clear local data even if backend fails
    }

    // Clear all local auth data
    tokenManager.removeToken();

    // Force a complete page reload to clear all React state
    window.location.href = "/";
  },

  refreshToken: async (): Promise<{ access_token: string; refresh_token?: string } | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return null;

      const data = await res.json();

      if (data.access_token) {
        tokenManager.setToken(data.access_token);
      }
      if (data.refresh_token) {
        tokenManager.setRefreshToken(data.refresh_token);
      }

      return data;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return tokenManager.hasToken();
  },

  getAuthHeaders,
};

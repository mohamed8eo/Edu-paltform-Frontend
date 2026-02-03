const API_BASE_URL = "http://localhost:8080/auth";

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SendOtpPayload {
  email: string;
  type: "email-verification";
}

export interface VerifyOtpPayload {
  email: string;
  type: "email-verification";
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

export type SocialProvider = "google" | "github";

export interface SignInSocialPayload {
  provider: SocialProvider;
  callbackURL?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  userId: string;
  userRole: string;
  userLastLoginMethod: string;
}

// Token management functions
const TOKEN_KEY = "better-auth.session_token";

export const tokenManager = {
  setToken: (token: string) => {
    console.log("💾 Setting token:", token.substring(0, 20) + "...");

    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    console.log("✅ Token stored in localStorage");

    // Also set as cookie for consistency with social auth
    // IMPORTANT: For OAuth redirects to work, we need SameSite=None; Secure
    // This is required for cross-site cookie sending during OAuth callbacks
    const isLocalhost = window.location.hostname === "localhost";
    const cookieAttributes = isLocalhost
      ? `path=/; max-age=${60 * 60 * 24 * 7}` // No Secure/SameSite on localhost
      : `path=/; max-age=${60 * 60 * 24 * 7}; SameSite=None; Secure`;

    document.cookie = `${TOKEN_KEY}=${token}; ${cookieAttributes}`;
    console.log("🍪 Token set in cookie with attributes:", cookieAttributes);
  },

  getToken: (): string | null => {
    // Fallback to localStorage (for email/password auth)
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) {
      console.log("💾 Token found in localStorage");
      return localToken;
    }

    // Check cookies FIRST (for social auth)
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === TOKEN_KEY) {
        console.log("🍪 Token found in cookie");
        return value;
      }
    }

    console.log("⚠️ No token found");
    return null;
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  },

  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  },
};

async function handleResponse<T>(response: Response): Promise<T> {
  let data;
  try {
    data = await response.json();
  } catch (error) {
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
    });
    const data = await handleResponse<AuthResponse>(res);

    // Store the token
    if (data.token) {
      tokenManager.setToken(data.token);
    }

    return data;
  },

  signIn: async (payload: SignInPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<AuthResponse>(res);

    // Store the token
    if (data.token) {
      tokenManager.setToken(data.token);
    }

    return data;
  },

  sendOtp: async (payload: SendOtpPayload) => {
    const res = await fetch(`${API_BASE_URL}/send-otp`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  verifyOtp: async (payload: VerifyOtpPayload) => {
    const res = await fetch(`${API_BASE_URL}/verify-OTP`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const res = await fetch(`${API_BASE_URL}/forget-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const res = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  signInSocial: async (payload: SignInSocialPayload) => {
    console.log("🔐 Starting social sign-in with:", payload.provider);

    const res = await fetch(`${API_BASE_URL}/sign-in-social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", // IMPORTANT: This allows cookies to be sent/received
    });

    console.log("📡 Social sign-in response status:", res.status);

    // Check for Set-Cookie header in the response
    const setCookieHeader = res.headers.get("set-cookie");
    console.log("🍪 Set-Cookie header:", setCookieHeader || "not present");

    const data = await handleResponse(res);
    console.log("📥 Social sign-in response data:", data);

    return data;
  },

  getSession: async () => {
    console.log("📡 Calling /auth/session to get session...");

    const res = await fetch(`${API_BASE_URL}/session`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    console.log("📥 Session response status:", res.status);

    if (!res.ok) {
      console.log("❌ Session check failed");
      return null;
    }

    const data = await res.json();
    console.log("📥 Session data:", data);

    if (data.authenticated) {
      console.log("✅ Session found - user is authenticated via social login");
      // Note: We don't store the user ID as a token because it's not a JWT
      // For social auth, we rely on HttpOnly cookies instead
      return data;
    }

    return null;
  },

  signOut: async () => {
    tokenManager.removeToken();
    // You can also call a backend endpoint if needed
  },
};

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

export type SocialProvider = 'google' | 'github';

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
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    
    // Also set as cookie for consistency with social auth
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  },
  
  getToken: (): string | null => {
    // Try localStorage first
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) return localToken;
    
    // Fallback to cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === TOKEN_KEY) return value;
    }
    
    return null;
  },
  
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  },
  
  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  }
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
    const res = await fetch(`${API_BASE_URL}/sign-in-social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  getSession: async () => {
    const res = await fetch(`${API_BASE_URL}/session`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      return null;
    }
    return handleResponse(res);
  },
  
  signOut: async () => {
    tokenManager.removeToken();
    // You can also call a backend endpoint if needed
  }
};
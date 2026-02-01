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

export const authApi = {
  signUp: async (payload: SignUpPayload) => {
    const res = await fetch(`${API_BASE_URL}/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  signIn: async (payload: SignInPayload) => {
    const res = await fetch(`${API_BASE_URL}/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  sendOtp: async (payload: SendOtpPayload) => {
    const res = await fetch(`${API_BASE_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  verifyOtp: async (payload: VerifyOtpPayload) => {
    // Note: Endpoint specified as verify-OTP in prompt
    const res = await fetch(`${API_BASE_URL}/verify-OTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
};

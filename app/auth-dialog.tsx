"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, tokenManager } from "./auth-api";
import { NEXT_PUBLIC_BACKEND_URL } from "@/lib/api";

type AuthView =
  | "sign-in"
  | "sign-up"
  | "verify-otp"
  | "forgot-password"
  | "reset-password";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string().min(4, "OTP is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z
  .object({
    otp: z.string().min(4, "OTP is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function AuthDialog({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>("sign-in");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogTrigger asChild>
          <Button variant="default" className={className}>
            {children || "Sign In"}
          </Button>
        </DialogTrigger>
      </Dialog>
    );
  }

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setView("sign-in");
        setEmail("");
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className={className}>
          {children || "Sign In"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {view === "sign-in" && "Welcome Back"}
            {view === "sign-up" && "Create Account"}
            {view === "verify-otp" && "Verify Email"}
            {view === "forgot-password" && "Reset Password"}
            {view === "reset-password" && "Set New Password"}
          </DialogTitle>
          <DialogDescription>
            {view === "sign-in" &&
              "Enter your credentials to access your account."}
            {view === "sign-up" &&
              "Enter your details to create a new account."}
            {view === "verify-otp" && `Enter the code sent to ${email}`}
            {view === "forgot-password" &&
              "Enter your email to receive a reset code."}
            {view === "reset-password" &&
              "Enter the code and your new password."}
          </DialogDescription>
        </DialogHeader>

        {view === "sign-in" && (
          <SignInForm
            onSuccess={() => setOpen(false)}
            onForgotPassword={() => setView("forgot-password")}
            onSignUpClick={() => setView("sign-up")}
          />
        )}

        {view === "sign-up" && (
          <SignUpForm
            onSuccess={(email) => {
              setEmail(email);
              setView("verify-otp");
            }}
            onSignInClick={() => setView("sign-in")}
          />
        )}

        {view === "verify-otp" && (
          <VerifyOtpForm
            email={email}
            onSuccess={() => {
              toast.success("Email verified successfully! Please sign in.");
              setView("sign-in");
            }}
            onBack={() => setView("sign-up")}
          />
        )}

        {view === "forgot-password" && (
          <ForgotPasswordForm
            onSuccess={(email) => {
              setEmail(email);
              setView("reset-password");
            }}
            onBack={() => setView("sign-in")}
          />
        )}

        {view === "reset-password" && (
          <ResetPasswordForm
            email={email}
            onSuccess={() => {
              toast.success("Password reset successfully! Please sign in.");
              setView("sign-in");
            }}
            onBack={() => setView("forgot-password")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function SignInForm({
  onSuccess,
  onForgotPassword,
  onSignUpClick,
}: {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSignUpClick: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      await authApi.signIn(data);
      toast.success("Signed in successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const handleSocialSignIn = async (provider: "google" | "github") => {
    console.log("🔐 AuthDialog: Starting social sign-in with:", provider);
    setIsLoading(true);
    try {
      console.log("📡 Calling /auth/sign-in-social...");
      const res = await fetch(
        `${NEXT_PUBLIC_BACKEND_URL}/auth/sign-in-social`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ provider }),
        },
      );

      console.log("📥 Response status:", res.status);
      console.log("🍪 Set-Cookie header:", res.headers.get("set-cookie"));
      console.log("🌐 Response URL:", res.url);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Social sign-in failed:", errorText);
        throw new Error("Failed to initiate social login");
      }

      // IMPORTANT: Try to get token from response body
      // Backend should return { token, ... } for non-HttpOnly access
      let data;
      try {
        data = await res.json();
        console.log("📥 Response data:", data);
      } catch (e) {
        data = {};
        console.log("⚠️ No JSON response body");
      }

      // If token is in response body, store it in localStorage
      if (data.token) {
        console.log(
          "💾 Token found in response body, storing in localStorage...",
        );
        tokenManager.setToken(data.token);
      } else {
        console.log(
          "⚠️ No token in response body - will rely on HttpOnly cookie",
        );
      }

      if (data.url) {
        console.log("🔄 AuthDialog: Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        // No redirect URL, check if we have the token
        if (data.token) {
          window.location.href = "/home";
        }
      }
    } catch (error: any) {
      console.error("❌ AuthDialog: Social sign in error:", error);
      toast.error(error.message || `Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-muted-foreground hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialSignIn("google")}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialSignIn("github")}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialSignIn("github")}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSignUpClick}
          className="text-primary hover:underline"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}

function SignUpForm({
  onSuccess,
  onSignInClick,
}: {
  onSuccess: (email: string) => void;
  onSignInClick: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      await authApi.signUp(data);
      toast.success("Account created! Please verify your email.");
      // Automatically trigger OTP send after signup if needed, or just move to verify step
      try {
        await authApi.sendOtp({
          email: data.email,
          type: "email-verification",
        });
      } catch (e) {
        console.error("Failed to send initial OTP", e);
      }
      onSuccess(data.email);
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSignInClick}
          className="text-primary hover:underline"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}

function VerifyOtpForm({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      await authApi.verifyOtp({
        email,
        type: "email-verification",
        otp: data.otp,
      });
      onSuccess();
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.sendOtp({ email, type: "email-verification" });
      toast.success("OTP resent successfully");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input id="otp" placeholder="123456" {...register("otp")} />
        {errors.otp && (
          <p className="text-xs text-destructive">{errors.otp.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify Email
      </Button>
      <div className="flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:underline flex items-center"
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back
        </button>
        <button
          type="button"
          onClick={handleResend}
          className="text-primary hover:underline"
        >
          Resend Code
        </button>
      </div>
    </form>
  );
}

function ForgotPasswordForm({
  onSuccess,
  onBack,
}: {
  onSuccess: (email: string) => void;
  onBack: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email: data.email });
      toast.success("Reset code sent to your email");
      onSuccess(data.email);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Reset Code
      </Button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-muted-foreground hover:underline"
      >
        Back to Sign In
      </button>
    </form>
  );
}

function ResetPasswordForm({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email,
        otp: data.otp,
        password: data.password,
      });
      onSuccess();
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="otp">Reset Code</Label>
        <Input id="otp" placeholder="123456" {...register("otp")} />
        {errors.otp && (
          <p className="text-xs text-destructive">{errors.otp.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Reset Password
      </Button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-muted-foreground hover:underline"
      >
        Back
      </button>
    </form>
  );
}

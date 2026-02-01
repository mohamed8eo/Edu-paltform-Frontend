"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "./auth-api"

type AuthView = "sign-in" | "sign-up" | "verify-otp" | "forgot-password" | "reset-password"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const otpSchema = z.object({
  otp: z.string().min(4, "OTP is required"),
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const resetPasswordSchema = z.object({
  otp: z.string().min(4, "OTP is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export function AuthDialog({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<AuthView>("sign-in")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [mounted, setMounted] = useState(false)

  // Only render dialog content after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

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
    )
  }

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setTimeout(() => {
        setView("sign-in")
        setEmail("")
        setIsLoading(false)
      }, 300)
    }
  }

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
            {view === "sign-in" && "Enter your credentials to access your account."}
            {view === "sign-up" && "Enter your details to create a new account."}
            {view === "verify-otp" && `Enter the code sent to ${email}`}
            {view === "forgot-password" && "Enter your email to receive a reset code."}
            {view === "reset-password" && "Enter the code and your new password."}
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
              setEmail(email)
              setView("verify-otp")
            }}
            onSignInClick={() => setView("sign-in")}
          />
        )}

        {view === "verify-otp" && (
          <VerifyOtpForm
            email={email}
            onSuccess={() => {
              toast.success("Email verified successfully! Please sign in.")
              setView("sign-in")
            }}
            onBack={() => setView("sign-up")}
          />
        )}

        {view === "forgot-password" && (
          <ForgotPasswordForm
            onSuccess={(email) => {
              setEmail(email)
              setView("reset-password")
            }}
            onBack={() => setView("sign-in")}
          />
        )}

        {view === "reset-password" && (
          <ResetPasswordForm
            email={email}
            onSuccess={() => {
              toast.success("Password reset successfully! Please sign in.")
              setView("sign-in")
            }}
            onBack={() => setView("forgot-password")}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function SignInForm({
  onSuccess,
  onForgotPassword,
  onSignUpClick,
}: {
  onSuccess: () => void
  onForgotPassword: () => void
  onSignUpClick: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
      toast.success("Signed in successfully")
      onSuccess()
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast.error(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
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
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSignUpClick} className="text-primary hover:underline">
          Sign up
        </button>
      </div>
    </form>
  )
}

function SignUpForm({
  onSuccess,
  onSignInClick,
}: {
  onSuccess: (email: string) => void
  onSignInClick: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true)
    try {
      await authApi.signUp(data)
      toast.success("Account created! Please verify your email.")
      // Automatically trigger OTP send after signup if needed, or just move to verify step
      try {
        await authApi.sendOtp({ email: data.email, type: "email-verification" })
      } catch (e) {
        console.error("Failed to send initial OTP", e)
      }
      onSuccess(data.email)
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast.error(error.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button type="button" onClick={onSignInClick} className="text-primary hover:underline">
          Sign in
        </button>
      </div>
    </form>
  )
}

function VerifyOtpForm({
  email,
  onSuccess,
  onBack,
}: {
  email: string
  onSuccess: () => void
  onBack: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  })

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    setIsLoading(true)
    try {
      await authApi.verifyOtp({
        email,
        type: "email-verification",
        otp: data.otp,
      })
      onSuccess()
    } catch (error: any) {
      console.error("Verify OTP error:", error)
      toast.error(error.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await authApi.sendOtp({ email, type: "email-verification" })
      toast.success("OTP resent successfully")
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      toast.error(error.message || "Failed to resend OTP")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input id="otp" placeholder="123456" {...register("otp")} />
        {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify Email
      </Button>
      <div className="flex justify-between items-center text-sm">
        <button type="button" onClick={onBack} className="text-muted-foreground hover:underline flex items-center">
          <ArrowLeft className="mr-1 h-3 w-3" /> Back
        </button>
        <button type="button" onClick={handleResend} className="text-primary hover:underline">
          Resend Code
        </button>
      </div>
    </form>
  )
}

function ForgotPasswordForm({
  onSuccess,
  onBack,
}: {
  onSuccess: (email: string) => void
  onBack: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true)
    try {
      await authApi.forgotPassword({ email: data.email })
      toast.success("Reset code sent to your email")
      onSuccess(data.email)
    } catch (error: any) {
      console.error("Forgot password error:", error)
      toast.error(error.message || "Failed to send reset code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Reset Code
      </Button>
      <button type="button" onClick={onBack} className="w-full text-sm text-muted-foreground hover:underline">
        Back to Sign In
      </button>
    </form>
  )
}

function ResetPasswordForm({
  email,
  onSuccess,
  onBack,
}: {
  email: string
  onSuccess: () => void
  onBack: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true)
    try {
      await authApi.resetPassword({
        email,
        otp: data.otp,
        password: data.password,
      })
      onSuccess()
    } catch (error: any) {
      console.error("Reset password error:", error)
      toast.error(error.message || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="otp">Reset Code</Label>
        <Input id="otp" placeholder="123456" {...register("otp")} />
        {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Reset Password
      </Button>
      <button type="button" onClick={onBack} className="w-full text-sm text-muted-foreground hover:underline">
        Back
      </button>
    </form>
  )
}
"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Mail, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { authApi } from "@/app/auth-api"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get email from localStorage (you might need to store it during forgot password)
    const storedEmail = localStorage.getItem("resetEmail") || ""
    setEmail(storedEmail)
    
    // Focus first input
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    
    // Handle paste
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("")
      pastedCode.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })
      setOtp(newOtp)
      
      // Focus on the appropriate input after paste
      const nextIndex = Math.min(index + pastedCode.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    // Handle single character input
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData) {
      const newOtp = [...otp]
      pastedData.split("").forEach((digit, i) => {
        newOtp[i] = digit
      })
      setOtp(newOtp)
      
      // Focus on the last filled input or the next empty one
      const lastIndex = Math.min(pastedData.length - 1, 5)
      inputRefs.current[lastIndex]?.focus()
    }
  }

  const handleReset = async () => {
    const code = otp.join("")
    if (code.length !== 6 || !email || !password) return

    setIsLoading(true)
    
    try {
      await authApi.resetPassword({
        email: email,
        otp: code,
        password: password
      })
      
      setIsReset(true)
      
      // Redirect after showing success
      setTimeout(() => {
        localStorage.removeItem("resetEmail")
        router.push("/sign-in")
      }, 2000)
    } catch (error) {
      console.error("Reset password error:", error)
      // You could show a toast or error message here
    } finally {
      setIsLoading(false)
    }
  }

  if (isReset) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <Card className="w-full max-w-md border-none shadow-xl relative z-10">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully reset. Redirecting you to sign in...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Logo />
          </Link>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>Enter the verification code and your new password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {!email && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Verification Code</Label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                    className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>

            <Button 
              onClick={handleReset} 
              className="w-full" 
              disabled={isLoading || otp.join("").length !== 6 || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="pt-2">
              <Link 
                href="/sign-in" 
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
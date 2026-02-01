"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import { authApi } from "@/app/auth-api"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [email, setEmail] = useState("")
  const [resendTimer, setResendTimer] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("verificationEmail") || "your@email.com"
    setEmail(storedEmail)
    
    // Focus first input
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  useEffect(() => {
    // Auto-verify when all digits are filled
    const code = otp.join("")
    if (code.length === 6 && !isLoading && !isVerified) {
      handleVerify()
    }
  }, [otp])

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

  const handleVerify = async () => {
    const code = otp.join("")
    if (code.length !== 6) return

    setIsLoading(true)
    
    try {
      await authApi.verifyOtp({
        email: email,
        type: "email-verification",
        otp: code
      })
      
      setIsVerified(true)
      
      // Redirect after showing success
      setTimeout(() => {
        localStorage.removeItem("verificationEmail")
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("OTP verification error:", error)
      // You could show a toast or error message here
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    
    setIsLoading(true)
    
    try {
      await authApi.sendOtp({
        email: email,
        type: "email-verification"
      })
      
      setResendTimer(60)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (error) {
      console.error("Resend OTP error:", error)
      // You could show a toast or error message here
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <Card className="w-full max-w-md border-none shadow-xl relative z-10">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-6">
              Your account has been successfully verified. Redirecting you to the homepage...
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
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription className="mt-2">
              We sent a verification code to<br />
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
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

            <Button 
              onClick={handleVerify} 
              className="w-full" 
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Didn't receive the code?{" "}
                {resendTimer > 0 ? (
                  <span className="text-muted-foreground">
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                  >
                    Resend code
                  </button>
                )}
              </p>
            </div>

            <div className="pt-2">
              <Link 
                href="/sign-up" 
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

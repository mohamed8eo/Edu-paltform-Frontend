"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { authApi } from "@/app/auth-api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await authApi.forgotPassword({
        email: email
      })
      
      // Store email for reset password page
      localStorage.setItem("resetEmail", email)
      
      setIsSubmitted(true)
    } catch (error) {
      console.error("Forgot password error:", error)
      // You could show a toast or error message here
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
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
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a verification code to<br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <Button asChild className="w-full mb-3">
                <Link href="/reset-password">Reset Password</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/sign-in">Back to Sign In</Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Didn't receive the email?{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Try again
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
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
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground mt-2">No worries, we'll send you reset instructions</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Reset password</CardTitle>
            <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

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

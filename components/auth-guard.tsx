'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { tokenManager } from '@/app/auth-api'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = '/' }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tokenManager.hasToken()) {
      router.push(redirectTo)
    } else {
      setIsAuthenticated(true)
    }
    
    setLoading(false)
  }, [router, redirectTo])

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

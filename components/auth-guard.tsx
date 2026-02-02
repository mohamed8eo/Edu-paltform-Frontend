'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = '/' }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('better-auth.session_token='))
    
    if (!token) {
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

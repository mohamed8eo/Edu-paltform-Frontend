'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  lastUsedMethod: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  lastUsedMethod: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [lastUsedMethod, setLastUsedMethod] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('better-auth.session_token='))
    const method = document.cookie.split('; ').find(row => row.startsWith('better-auth.last_used_login_method='))

    if (token) {
      setIsAuthenticated(true)
    }

    if (method) {
      setLastUsedMethod(method.split('=')[1])
    }

    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, lastUsedMethod, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

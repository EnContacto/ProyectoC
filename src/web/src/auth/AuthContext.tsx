import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { api } from '@/api/client'

export interface AuthUser {
  username: string
  fullName: string
  email?: string
}

interface LoginResponse {
  token: string
  expiresAt: string
  username: string
  fullName: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function loadUser(): AuthUser | null {
  const raw = localStorage.getItem('pc_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pc_token'))
  const [user, setUser] = useState<AuthUser | null>(() => loadUser())

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { username, password })
    const nextUser: AuthUser = {
      username: data.username,
      fullName: data.fullName,
    }
    localStorage.setItem('pc_token', data.token)
    localStorage.setItem('pc_user', JSON.stringify(nextUser))
    setToken(data.token)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('pc_token')
    localStorage.removeItem('pc_user')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
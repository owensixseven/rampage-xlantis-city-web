import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { findLocalCredential, homeRouteForRole, normalizeRole, type Role } from '../data/credentials'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || 'http://localhost:4000'

interface Session {
  id: string
  role: Role
  label: string
  token: string | null // null when running on the local-only fallback
}

interface LoginResult {
  ok: boolean
  redirect?: string
  error?: string
}

interface AuthContextValue {
  session: Session | null
  login: (id: string, password: string) => Promise<LoginResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'rampage_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setSession(JSON.parse(raw))
      } catch {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const login = async (id: string, password: string): Promise<LoginResult> => {
    // Try the real backend first — this is where actual credentials live.
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      })
      if (res.ok) {
        const data = await res.json()
        const role = normalizeRole(data.role)
        if (!role) return { ok: false, error: 'Account has an invalid role.' }
        const next: Session = { id, role, label: data.label, token: data.token }
        setSession(next)
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return { ok: true, redirect: data.redirect }
      }
      // A rejected backend login can still be a local demo account. Try the
      // documented fallback before reporting a credential failure.
    } catch {
      // Backend unreachable — fall through to local fallback below.
    }

    const match = findLocalCredential(id, password)
    if (!match) return { ok: false, error: 'ID or password not recognized.' }
    const next: Session = { id: match.id, role: match.role, label: match.label, token: null }
    setSession(next)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return { ok: true, redirect: homeRouteForRole(match.role) }
  }

  const logout = () => {
    if (session?.token) {
      fetch(`${API_BASE}/api/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.token}` },
      }).catch(() => {})
    }
    setSession(null)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

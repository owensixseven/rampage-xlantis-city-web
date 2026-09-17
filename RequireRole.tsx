import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { Role } from '../data/credentials'

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { session } = useAuth()

  if (!session) {
    const loginPath = roles.includes('team_manager') ? '/login/team' : '/login/admin'
    return <Navigate to={loginPath} replace />
  }

  if (!roles.includes(session.role)) {
    return <Navigate to="/login/admin" replace />
  }

  return <>{children}</>
}

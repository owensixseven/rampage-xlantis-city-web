// ─────────────────────────────────────────────────────────────────────────
// LOCAL-ONLY FALLBACK LOGIN
//
// Real admin accounts now live on the backend server, in server/.env
// (never committed to git — see server/.env.example). The frontend's
// login page tries that server first via `src/lib/auth.tsx`.
//
// The accounts below are ONLY used if the backend can't be reached, so the
// site is still browsable/demoable without a server running. They are
// intentionally NOT real credentials — safe to keep in this public repo.
// ─────────────────────────────────────────────────────────────────────────

export type Role = 'super_admin' | 'admin' | 'referee' | 'caster' | 'team_manager'

export interface Credential {
  id: string
  password: string
  role: Role
  label: string
}

export const LOCAL_FALLBACK_CREDENTIALS: Credential[] = [
  { id: 'DEMO-SUPERADMIN', password: 'demo-only-not-secure', role: 'super_admin', label: 'Demo Super Admin (offline mode)' },
  { id: 'DEMO-ADMIN', password: 'demo-only-not-secure', role: 'admin', label: 'Demo Admin (offline mode)' },
  { id: 'DEMO-REFEREE', password: 'demo-only-not-secure', role: 'referee', label: 'Demo Referee (offline mode)' },
  { id: 'DEMO-CASTER', password: 'demo-only-not-secure', role: 'caster', label: 'Demo Caster (offline mode)' },
  { id: 'DEMO-TEAM', password: 'demo-only-not-secure', role: 'team_manager', label: 'Demo Team Manager (offline mode)' },
]

export function normalizeRole(role: string): Role | null {
  const normalized = role === 'superadmin' || role === 'super-admin' ? 'super_admin' : role
  return normalized in ROLE_HOME ? (normalized as Role) : null
}

const ROLE_HOME: Record<Role, string> = {
  super_admin: '/admin',
  admin: '/admin',
  referee: '/referee',
  caster: '/caster',
  team_manager: '/dashboard/team-manager',
}

export function findLocalCredential(id: string, password: string): Credential | null {
  return (
    LOCAL_FALLBACK_CREDENTIALS.find(
      (c) => c.id.toLowerCase() === id.trim().toLowerCase() && c.password === password,
    ) ?? null
  )
}

export function homeRouteForRole(role: Role): string {
  return ROLE_HOME[role]
}

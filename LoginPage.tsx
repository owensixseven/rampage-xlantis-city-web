import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ShieldCheck } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel } from '../components/ui/Panel'
import { useAuth } from '../lib/auth'

export function LoginPage({ variant }: { variant: 'team' | 'admin' }) {
  const isAdmin = variant === 'admin'
  const { login } = useAuth()
  const navigate = useNavigate()

  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const result = await login(id, password)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error ?? 'ID or password not recognized.')
      return
    }
    setError('')
    navigate(result.redirect ?? '/')
  }

  return (
    <Section className="flex justify-center py-24">
      <Panel className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center border border-signal/40 bg-signal/10 text-signal">
            <ShieldCheck size={20} />
          </span>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            {isAdmin ? 'Admin Login' : 'Team Login'}
          </h1>
          <p className="text-xs text-ink-dim">
            {isAdmin ? 'Restricted access — Admin, Super Admin, Referee and Caster roles.' : 'Access your team dashboard, roster and match schedule.'}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">{isAdmin ? 'Staff ID' : 'Captain / Player ID'}</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink focus:border-signal/50 focus:outline-none"
              placeholder={isAdmin ? 'e.g. STAFF-001' : 'e.g. RGX-1001'}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink focus:border-signal/50 focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="flex items-center gap-2 border border-hazard/40 bg-hazard/10 px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-hazard">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="w-full bg-signal py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-void clip-tactical-sm hover:bg-signal-dim disabled:opacity-60">
            {submitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-5 border-t border-line pt-4 text-center font-mono text-[10px] uppercase tracking-wider text-ink-mute">
          Real accounts live on the backend (server/.env). If the backend is
          offline, demo-only fallback accounts work — see{' '}
          <span className="text-ink-dim">src/data/credentials.ts</span>
        </p>
      </Panel>
    </Section>
  )
}

import { NavLink } from 'react-router-dom'
import { Section } from '../components/ui/Section'

export default function NotFound() {
  return (
    <Section className="flex flex-col items-center py-32 text-center">
      <div className="font-display text-7xl font-black text-signal">404</div>
      <p className="mt-3 max-w-sm text-sm text-ink-dim">This zone hasn't been mapped yet. The page you're looking for doesn't exist.</p>
      <NavLink to="/" className="mt-6 border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ink hover:border-signal">
        Back to Home
      </NavLink>
    </Section>
  )
}

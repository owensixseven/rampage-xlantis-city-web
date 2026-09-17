import { NavLink } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useStore } from '../../lib/store'

export function Footer() {
  const { sponsors } = useStore()
  return (
    <footer className="border-t border-line bg-void-2">
      <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-b border-line pb-10 opacity-80">
          {sponsors.map((s) => (
            <div key={s.id} className="flex items-center gap-2 font-display text-sm uppercase tracking-widest text-ink-mute">
              <span className="flex h-6 w-6 items-center justify-center border border-line text-[11px] text-ink-dim">
                {s.wordmarkInitial}
              </span>
              {s.name}
            </div>
          ))}
        </div>

        <div className="grid gap-10 md:grid-cols-5">
          <div>
            <div className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
              Rampage
            </div>
            <p className="mt-2 text-sm text-ink-dim">
              A XLANTIS CITY tournament. Fight. Survive. Dominate.
            </p>
          </div>
          <FooterCol title="Compete" links={[['/tournaments', 'Tournaments'], ['/teams', 'Teams'], ['/teams/register', 'Register a Team'], ['/rules', 'Rules'], ['/login/team', 'Team Login']]} />
          <FooterCol title="Watch" links={[['/live', 'Live'], ['/matches', 'Matches'], ['/highlights', 'Highlights'], ['/standings', 'Standings']]} />
          <FooterCol title="Archive" links={[['/records', 'Records'], ['/hall-of-fame', 'Hall of Fame'], ['/mvp', 'MVP'], ['/players', 'Players']]} />
          <FooterCol title="Support" links={[['/report', 'Report an Issue'], ['/login/admin', 'Admin Login']]} />
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-line pt-6 text-center">
          <div className="font-display text-3xl font-bold uppercase tracking-tight text-ink md:text-4xl">
            Rampage
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
            Fight. Survive. Dominate.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <NavLink to="/live" className="border border-hazard/40 bg-hazard/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-hazard">Watch Live</NavLink>
            <NavLink to="/teams" className="border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-dim">View Teams</NavLink>
            <NavLink to="/standings" className="border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-dim">View Standings</NavLink>
            <a href="https://discord.gg/GxV9SAkvx" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              <MessageCircle size={13} /> Join Discord
            </a>
          </div>
          <p className="pt-4 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
            Demo build — all statistics on this site are sample data · © 2026 Xlantis City
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">{title}</div>
      <ul className="space-y-2">
        {links.map(([to, label]) => (
          <li key={to}>
            <NavLink to={to} className="text-sm text-ink-dim hover:text-ink">
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

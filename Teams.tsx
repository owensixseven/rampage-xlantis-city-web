import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { TeamCard } from '../components/teams/TeamCard'
import { useStore } from '../lib/store'

export default function Teams() {
  const { teams } = useStore()
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('All')

  const groups = useMemo(
    () => ['All', ...Array.from(new Set(teams.map((t) => t.group))).filter(Boolean)] as string[],
    [teams],
  )

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      const matchesQuery = t.name.toLowerCase().includes(query.toLowerCase()) || t.tag.toLowerCase().includes(query.toLowerCase())
      const matchesGroup = group === 'All' || t.group === group
      return matchesQuery && matchesGroup
    })
  }, [teams, query, group])

  return (
    <Section
      eyebrow={`${teams.length} Registered Teams`}
      title="Team Directory"
      action={
        <NavLink to="/teams/register" className="border border-signal/40 bg-signal/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-signal">
          Register a Team
        </NavLink>
      }
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team name or tag…"
            className="w-full border border-line bg-panel py-2.5 pl-9 pr-3 font-mono text-sm text-ink placeholder:text-ink-mute focus:border-signal/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
                group === g ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-mute'
              }`}
            >
              {g === 'All' ? 'All Groups' : `Group ${g}`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-line bg-panel p-12 text-center font-mono text-sm text-ink-mute">
          No teams match that search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t, index) => <TeamCard key={t.id} team={t} index={index} />)}
        </div>
      )}
    </Section>
  )
}

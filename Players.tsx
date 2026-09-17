import { useMemo, useState } from 'react'
import { ArrowUpDown, Search } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { PlayerCard } from '../components/players/PlayerCard'
import { players } from '../data/mockData'
import { kd } from '../lib/format'
import type { Player } from '../data/types'

type SortKey = 'rank' | 'kills' | 'kd' | 'name'

const SORT_LABELS: Record<SortKey, string> = {
  rank: 'Tournament Rank', kills: 'Kills', kd: 'K/D', name: 'Name',
}

const ROLES: (Player['role'] | 'All')[] = ['All', 'IGL', 'Entry', 'Support', 'Sniper', 'Flex']

export default function Players() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<Player['role'] | 'All'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('rank')

  const filtered = useMemo(() => {
    let list = players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    if (role !== 'All') list = list.filter((p) => p.role === role)

    list = [...list].sort((a, b) => {
      if (sortKey === 'rank') return a.tournamentRank - b.tournamentRank
      if (sortKey === 'kills') return b.kills - a.kills
      if (sortKey === 'kd') return Number(kd(b.kills, b.deaths)) - Number(kd(a.kills, a.deaths))
      return a.name.localeCompare(b.name)
    })

    return list.slice(0, 60)
  }, [query, role, sortKey])

  return (
    <Section eyebrow={`${players.length} Players`} title="Player Directory" description="Demo statistics — not official RAMPAGE results.">
      <div className="mb-6 space-y-3">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player name…"
            className="w-full border border-line bg-panel py-2.5 pl-9 pr-3 font-mono text-sm text-ink placeholder:text-ink-mute focus:border-signal/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                  role === r ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-mute'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`flex items-center gap-1 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                  sortKey === key ? 'border-data/50 bg-data/10 text-data' : 'border-line text-ink-mute'
                }`}
              >
                <ArrowUpDown size={10} /> {SORT_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-line bg-panel p-12 text-center font-mono text-sm text-ink-mute">No players match those filters.</div>
      ) : (
        <div className="grid gap-2.5 md:grid-cols-2">
          {filtered.map((p, index) => <PlayerCard key={p.id} player={p} index={index} />)}
        </div>
      )}
      {filtered.length === 60 && (
        <p className="mt-4 text-center font-mono text-[11px] text-ink-mute">Showing top 60 results — refine your search for more.</p>
      )}
    </Section>
  )
}

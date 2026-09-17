import { useState } from 'react'
import { Section } from '../components/ui/Section'
import { MatchCard } from '../components/matches/MatchCard'
import { useStore } from '../lib/store'
import type { MatchStatus } from '../data/types'

const TABS: { key: MatchStatus; label: string }[] = [
  { key: 'live', label: 'Live' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
]

export default function Matches() {
  const { matches } = useStore()
  const [tab, setTab] = useState<MatchStatus>('live')
  const list = matches.filter((m) => m.status === tab)

  return (
    <Section eyebrow="Match Center" title="All Matches">
      <div className="mb-6 flex gap-2 border-b border-line">
        {TABS.map((t) => {
          const count = matches.filter((m) => m.status === t.key).length
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-wider ${
                tab === t.key ? 'border-signal text-signal' : 'border-transparent text-ink-mute'
              }`}
            >
              {t.label} <span className="text-ink-mute">({count})</span>
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <div className="border border-line bg-panel p-12 text-center font-mono text-sm text-ink-mute">
          No {tab} matches right now.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m, index) => <MatchCard key={m.id} match={m} index={index} />)}
        </div>
      )}
    </Section>
  )
}

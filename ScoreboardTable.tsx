import { useMemo, useState } from 'react'
import { ArrowUpDown, Crosshair, Flag, Skull, Trophy } from 'lucide-react'
import type { ScoreboardRow } from '../../data/types'
import { useStore } from '../../lib/store'
import { Badge } from '../ui/Badge'
import { TeamBadge } from '../teams/TeamBadge'
import { AnimatedNumber } from '../ui/StatCounter'

type SortKey = 'totalPoints' | 'kills' | 'position' | 'teamWipes' | 'flagPoints'

const SORT_LABELS: Record<SortKey, string> = {
  totalPoints: 'Total Points',
  kills: 'Kills',
  position: 'Position',
  teamWipes: 'Team Wipes',
  flagPoints: 'Flag Points',
}

export function ScoreboardTable({
  rows,
  live = false,
  compact = false,
}: {
  rows: ScoreboardRow[]
  live?: boolean
  compact?: boolean
}) {
  const [sortKey, setSortKey] = useState<SortKey>('totalPoints')
  const [filter, setFilter] = useState<'all' | 'alive' | 'eliminated'>('all')
  const { teams } = useStore()
  const teamById = (id: string) => teams.find((t) => t.id === id)

  const sorted = useMemo(() => {
    let list = [...rows]
    if (filter !== 'all') list = list.filter((r) => (filter === 'alive' ? r.status !== 'eliminated' : r.status === 'eliminated'))
    list.sort((a, b) => {
      if (sortKey === 'position') return (a.position ?? 99) - (b.position ?? 99)
      return (b[sortKey] as number) - (a[sortKey] as number)
    })
    return list
  }, [rows, sortKey, filter])

  if (rows.length === 0) {
    return (
      <div className="border border-line bg-panel p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
          No scoreboard data yet — this match hasn't started.
        </p>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden border border-line bg-panel ${live ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`flex items-center gap-1 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                sortKey === key ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-mute hover:text-ink-dim'
              }`}
            >
              <ArrowUpDown size={10} /> {SORT_LABELS[key]}
            </button>
          ))}
        </div>
        {live && (
          <div className="flex gap-1.5">
            {(['all', 'alive', 'eliminated'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                  filter === f ? 'border-data/50 bg-data/10 text-data' : 'border-line text-ink-mute'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wider text-ink-mute">
              <th className="px-3 py-2.5">Rank</th>
              <th className="px-3 py-2.5">Team</th>
              {!compact && <th className="px-3 py-2.5">Position</th>}
              <th className="px-3 py-2.5">Pos. Pts</th>
              <th className="px-3 py-2.5"><Crosshair size={11} className="inline" /> Kills</th>
              <th className="px-3 py-2.5">Kill Pts</th>
              <th className="px-3 py-2.5"><Skull size={11} className="inline" /> Wipes</th>
              <th className="px-3 py-2.5"><Flag size={11} className="inline" /> Flag Pts</th>
              <th className="px-3 py-2.5 text-signal"><Trophy size={11} className="inline" /> Total</th>
              {live && <th className="px-3 py-2.5">Alive</th>}
              <th className="px-3 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => {
              const team = teamById(row.teamId)
              const top3 = idx < 3
              return (
                <tr
                  key={row.teamId}
                  className={`border-b border-line-soft font-mono text-sm tabular transition-colors hover:bg-panel-raised ${
                    top3 ? 'bg-signal/[0.04]' : ''
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <span className={`font-display text-base font-bold ${idx === 0 ? 'text-rank-gold' : idx === 1 ? 'text-rank-silver' : idx === 2 ? 'text-rank-bronze' : 'text-ink-mute'}`}>
                      <AnimatedNumber value={idx + 1} />
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 font-body">
                      {team && <TeamBadge team={team} size="sm" />}
                      <span className="whitespace-nowrap text-ink">{team?.name}</span>
                    </div>
                  </td>
                  {!compact && <td className="px-3 py-2.5 text-ink-dim">{row.position ? <AnimatedNumber value={row.position} prefix="#" /> : '—'}</td>}
                  <td className="px-3 py-2.5 text-ink-dim"><AnimatedNumber value={row.positionPoints} /></td>
                  <td className="px-3 py-2.5 text-ink-dim"><AnimatedNumber value={row.kills} /></td>
                  <td className="px-3 py-2.5 text-ink-dim"><AnimatedNumber value={row.killPoints} /></td>
                  <td className="px-3 py-2.5 text-ink-dim"><AnimatedNumber value={row.teamWipes} /></td>
                  <td className="px-3 py-2.5 text-ink-dim"><AnimatedNumber value={row.flagPoints} /></td>
                  <td className="px-3 py-2.5 text-base font-bold text-signal"><AnimatedNumber value={row.totalPoints} /></td>
                  {live && <td className="px-3 py-2.5 text-ink-dim"><AnimatedNumber value={row.playersAlive} suffix="/10" /></td>}
                  <td className="px-3 py-2.5">
                    <Badge tone={row.status === 'alive' ? 'live' : row.status === 'wiped' ? 'hazard' : 'neutral'} dot>
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

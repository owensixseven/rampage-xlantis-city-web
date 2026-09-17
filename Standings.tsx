import { useMemo, useState } from 'react'
import { Section } from '../components/ui/Section'
import { ScoreboardTable } from '../components/scoreboard/ScoreboardTable'
import { useStore } from '../lib/store'

export default function Standings() {
  const { teams } = useStore()
  const [group, setGroup] = useState('All')
  const groups = useMemo(
    () => ['All', ...Array.from(new Set(teams.map((t) => t.group))).filter(Boolean)] as string[],
    [teams],
  )

  const rows = useMemo(() => {
    const filtered = group === 'All' ? teams : teams.filter((t) => t.group === group)
    return [...filtered]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((t, i) => ({
        teamId: t.id, rank: i + 1, position: null, positionPoints: t.positionPoints,
        kills: t.kills, killPoints: t.kills, teamWipes: t.teamWipes, flagPoints: t.flagPoints,
        totalPoints: t.totalPoints, playersAlive: 0, status: 'eliminated' as const,
      }))
  }, [teams, group])

  return (
    <Section eyebrow="Cumulative Scoring" title="Standings" description="Position points: 1st = 10, 2nd = 7, 3rd = 6, 4th = 5, 5th = 4, 6th = 3, 7th = 2, 8th = 1, 9th–10th = 0.">
      <div className="mb-6 flex flex-wrap gap-1.5">
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
      <ScoreboardTable rows={rows} />
    </Section>
  )
}

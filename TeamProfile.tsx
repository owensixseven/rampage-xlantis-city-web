import { useParams, Link } from 'react-router-dom'
import { Crosshair, Flag, Skull, Trophy } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel, PanelHeader } from '../components/ui/Panel'
import { Badge } from '../components/ui/Badge'
import { players } from '../data/mockData'
import { useStore } from '../lib/store'
import { TeamBadge } from '../components/teams/TeamBadge'
import { kd } from '../lib/format'

const STATUS_TONE = {
  APPROVED: 'live', LOCKED: 'data', UNDER_REVIEW: 'signal', PENDING: 'neutral', REJECTED: 'hazard',
} as const

export default function TeamProfile() {
  const { id } = useParams()
  const { teams, matches } = useStore()
  const team = teams.find((t) => t.id === id)

  if (!team) {
    return (
      <Section title="Team Not Found">
        <p className="text-ink-dim">We couldn't find that team. <Link to="/teams" className="text-signal">Back to teams</Link></p>
      </Section>
    )
  }

  const roster = players.filter((p) => p.teamId === team.id)
  const teamMatches = matches.filter((m) => m.teamIds.includes(team.id) && m.status !== 'upcoming')

  return (
    <div>
      <div className="border-b border-line" style={{ background: `linear-gradient(180deg, ${team.colors.primary}14, transparent)` }}>
        <Section className="pb-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <TeamBadge team={team} size="xl" className="clip-tactical-sm" />
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Group {team.group} · Rank #{team.rank}</div>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-ink md:text-5xl">{team.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge tone={STATUS_TONE[team.status]}>{team.status.replace('_', ' ')}</Badge>
                <span className="font-mono text-xs text-ink-dim">Captain: {players.find((p) => p.id === team.captainId)?.name ?? team.captainId}</span>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section eyebrow="Season Stats" title="Performance" className="pb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <MiniStat icon={<Trophy size={14} />} label="Total Points" value={team.totalPoints} highlight />
          <MiniStat icon={<Crosshair size={14} />} label="Kills" value={team.kills} />
          <MiniStat icon={<Skull size={14} />} label="Team Wipes" value={team.teamWipes} />
          <MiniStat icon={<Flag size={14} />} label="Flag Points" value={team.flagPoints} />
          <MiniStat label="Matches" value={team.matchesPlayed} />
          <MiniStat label="Wins" value={team.wins} />
          <MiniStat label="Avg. Placement" value={team.avgPlacement} />
        </div>
      </Section>

      <Section eyebrow="Roster" title="Team Roster" className="pb-8">
        {roster.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roster.map((p) => (
              <Panel key={p.id} className="p-4">
                <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{p.name}</div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-mute">{p.role} · {p.playerId}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs tabular text-ink-dim">
                  <span>Kills <b className="text-ink">{p.kills}</b></span>
                  <span>K/D <b className="text-ink">{kd(p.kills, p.deaths)}</b></span>
                </div>
              </Panel>
            ))}
          </div>
        ) : team.rosterIds.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {team.rosterIds.map((entry) => (
              <Panel key={entry} className="p-4">
                <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{entry}</div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-mute">Newly registered — stats pending</div>
              </Panel>
            ))}
          </div>
        ) : (
          <Panel className="p-8 text-center font-mono text-xs text-ink-mute">No roster on file yet.</Panel>
        )}
      </Section>

      <Section eyebrow="History" title="Match History" className="pb-24">
        <Panel clip={false}>
          <PanelHeader title="Tournament History" />
          <ul className="divide-y divide-line-soft">
            {teamMatches.map((m) => {
              const row = m.scoreboard.find((r) => r.teamId === team.id)
              return (
                <li key={m.id} className="flex items-center justify-between px-5 py-3 font-mono text-sm">
                  <span className="text-ink-dim">Match {m.matchNumber} · {m.stage}</span>
                  <span className="text-ink">{row ? `#${row.rank} · ${row.totalPoints} pts` : '—'}</span>
                </li>
              )
            })}
            {teamMatches.length === 0 && (
              <li className="px-5 py-6 text-center font-mono text-xs text-ink-mute">No completed matches yet.</li>
            )}
          </ul>
        </Panel>
      </Section>
    </div>
  )
}

function MiniStat({ icon, label, value, highlight = false }: { icon?: React.ReactNode; label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className="border border-line bg-panel p-4">
      <div className={`flex items-center gap-1.5 font-mono text-xl font-semibold tabular ${highlight ? 'text-signal' : 'text-ink'}`}>{icon}{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
    </div>
  )
}

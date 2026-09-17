import { Calendar, TrendingUp, Users } from 'lucide-react'
import { Section } from '../../components/ui/Section'
import { Panel, PanelHeader } from '../../components/ui/Panel'
import { Badge } from '../../components/ui/Badge'
import { teams, players, matches } from '../../data/mockData'

export default function TeamManagerDashboard() {
  const team = teams[0]
  const roster = players.filter((p) => p.teamId === team.id)
  const upcoming = matches.filter((m) => m.teamIds.includes(team.id) && m.status === 'upcoming').slice(0, 3)

  return (
    <Section eyebrow={team.name} title="Team Manager Dashboard" description="Demo view — showing a sample team's roster, schedule and results.">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatBox icon={<Users size={16} />} label="Roster Size" value={`${roster.length} players`} />
        <StatBox icon={<TrendingUp size={16} />} label="Total Points" value={String(team.totalPoints)} />
        <StatBox icon={<Calendar size={16} />} label="Next Match" value={upcoming[0]?.date ?? 'TBD'} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel clip={false}>
          <PanelHeader title="Roster" eyebrow="Locked" />
          <ul className="divide-y divide-line-soft">
            {roster.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3 font-mono text-sm">
                <span className="text-ink">{p.name}</span>
                <Badge tone="neutral">{p.role}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel clip={false}>
          <PanelHeader title="Upcoming Schedule" eyebrow="Schedule" />
          <ul className="divide-y divide-line-soft">
            {upcoming.map((m) => (
              <li key={m.id} className="flex items-center justify-between px-5 py-3 font-mono text-sm">
                <span className="text-ink-dim">Match {m.matchNumber} · {m.stage}</span>
                <span className="text-ink">{m.date}</span>
              </li>
            ))}
            {upcoming.length === 0 && <li className="px-5 py-6 text-center font-mono text-xs text-ink-mute">No upcoming matches scheduled.</li>}
          </ul>
        </Panel>
      </div>
    </Section>
  )
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border border-line bg-panel p-4">
      <div className="mb-2 text-signal">{icon}</div>
      <div className="font-display text-lg font-bold text-ink">{value}</div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
    </div>
  )
}

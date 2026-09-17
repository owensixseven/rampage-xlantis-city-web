import { Link, useParams } from 'react-router-dom'
import { playerById, teamById } from '../data/mockData'
import { Section } from '../components/ui/Section'
import { Badge } from '../components/ui/Badge'
import { formatSeconds, kd } from '../lib/format'

export default function PlayerProfile() {
  const { id } = useParams()
  const player = playerById(id ?? '')
  const team = player ? teamById(player.teamId) : null

  if (!player || !team) {
    return (
      <Section title="Player Not Found">
        <p className="text-ink-dim">We couldn't find that player. <Link to="/players" className="text-signal">Back to players</Link></p>
      </Section>
    )
  }

  const stats: [string, string | number][] = [
    ['Matches', player.matches], ['Kills', player.kills], ['Deaths', player.deaths],
    ['K/D', kd(player.kills, player.deaths)], ['Damage', player.damage.toLocaleString('en-IN')],
    ['Assists', player.assists], ['Survival Time', formatSeconds(player.survivalTimeSec)],
    ['Recalls Used', player.recallsUsed], ['Avg. Placement', player.avgPlacement],
    ['MVP Score', player.mvpScore], ['Tournament Rank', `#${player.tournamentRank}`],
  ]

  return (
    <div>
      <div className="border-b border-line" style={{ background: `linear-gradient(180deg, ${team.colors.primary}14, transparent)` }}>
        <Section className="pb-8">
          <div className="flex items-center gap-5">
            <span
              className="flex h-20 w-20 items-center justify-center font-display text-2xl font-bold text-void clip-tactical-sm"
              style={{ backgroundColor: team.colors.primary }}
            >
              {player.name.split('"')[1]?.slice(0, 2).toUpperCase() ?? player.name.slice(0, 2)}
            </span>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">{player.playerId}</div>
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ink md:text-4xl">{player.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge tone="signal">{player.role}</Badge>
                <Link to={`/teams/${team.id}`} className="font-mono text-xs text-ink-dim hover:text-ink">{team.name}</Link>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section eyebrow="Demo Data" title="Player Statistics" description="These figures are sample statistics for demonstration and are not official tournament results." className="pb-24">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="border border-line bg-panel p-4">
              <div className="font-mono text-xl font-semibold tabular text-ink">{value}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

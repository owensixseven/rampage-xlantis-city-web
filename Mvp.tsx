import { Sparkles } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel } from '../components/ui/Panel'
import { Badge } from '../components/ui/Badge'
import { MvpSpotlight } from '../components/mvp/MvpSpotlight'
import { TeamBadge } from '../components/teams/TeamBadge'
import { mvpTournament, matchMvps, playerById, matchById, buildMvpEntry } from '../data/mockData'
import { useStore } from '../lib/store'

export default function Mvp() {
  const { teams, mvpOverridePlayerId } = useStore()
  const teamById = (id: string) => teams.find((t) => t.id === id)
  const overridePlayer = mvpOverridePlayerId ? playerById(mvpOverridePlayerId) : null
  const mvpEntry = overridePlayer ? buildMvpEntry(overridePlayer) : mvpTournament

  return (
    <div>
      <Section
        eyebrow="Ranked By Kills, Damage, Survival, Placement & Objective Play"
        title="Tournament MVP"
        action={
          overridePlayer ? (
            <Badge tone="signal"><Sparkles size={11} /> Manually set by tournament admin</Badge>
          ) : undefined
        }
      >
        <MvpSpotlight entry={mvpEntry} />
      </Section>

      <Section eyebrow="One Per Completed Match" title="Match MVPs" className="pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matchMvps.map((mvp) => {
            const player = playerById(mvp.playerId)
            const team = teamById(mvp.teamId)
            const match = matchById(mvp.matchId ?? '')
            if (!player || !team) return null
            return (
              <Panel key={`${mvp.matchId}-${mvp.playerId}`} className="p-5">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                  Match {match?.matchNumber} MVP
                </div>
                <div className="flex items-center gap-3">
                  <TeamBadge team={team} size="lg" />
                  <div>
                    <div className="font-display text-base font-semibold uppercase tracking-wide text-ink">{player.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">{team.name}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line-soft pt-3 font-mono text-xs tabular text-ink-dim">
                  <span>Kills <b className="text-ink">{mvp.breakdown.kills}</b></span>
                  <span>Score <b className="text-signal">{mvp.score}</b></span>
                  <span>Wipes <b className="text-ink">{mvp.breakdown.teamWipeContribution}</b></span>
                </div>
              </Panel>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

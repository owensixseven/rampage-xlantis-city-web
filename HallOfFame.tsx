import { Crown, Medal, Star } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel } from '../components/ui/Panel'
import { TeamBadge } from '../components/teams/TeamBadge'
import { tournamentHistory, playerById } from '../data/mockData'
import { useStore } from '../lib/store'

export default function HallOfFame() {
  const { teams } = useStore()
  const teamById = (id: string) => teams.find((t) => t.id === id)

  return (
    <div>
      <div className="border-b border-line bg-gradient-to-b from-signal/[0.06] to-transparent scanlines">
        <Section eyebrow="Legends Of Xlantis City" title="Hall of Fame" description="Every RAMPAGE champion, runner-up and MVP is enshrined here as new seasons are added." className="pb-16" />
      </div>

      {tournamentHistory.map((entry) => {
        const champion = teamById(entry.championTeamId)
        const runnerUp = teamById(entry.runnerUpTeamId)
        const third = teamById(entry.thirdTeamId)
        const mvp = playerById(entry.mvpPlayerId)
        if (!champion || !runnerUp || !third || !mvp) return null

        return (
          <Section key={entry.id} eyebrow={entry.season} title={entry.name} className="pb-16">
            <div className="grid gap-4 lg:grid-cols-4">
              <Panel className="flex flex-col items-center gap-3 border-rank-gold/40 p-8 text-center lg:col-span-2">
                <Crown size={30} className="text-rank-gold" />
                <TeamBadge team={champion} size="xl" />
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-rank-gold">Champion</div>
                  <div className="font-display text-2xl font-bold uppercase text-ink">{champion.name}</div>
                </div>
              </Panel>
              <Panel className="flex flex-col items-center gap-2 border-rank-silver/40 p-6 text-center">
                <Medal size={22} className="text-rank-silver" />
                <TeamBadge team={runnerUp} size="lg" />
                <div className="font-mono text-[10px] uppercase tracking-widest text-rank-silver">Runner-Up</div>
                <div className="font-display text-sm font-semibold uppercase text-ink">{runnerUp.name}</div>
              </Panel>
              <Panel className="flex flex-col items-center gap-2 border-rank-bronze/40 p-6 text-center">
                <Medal size={22} className="text-rank-bronze" />
                <TeamBadge team={third} size="lg" />
                <div className="font-mono text-[10px] uppercase tracking-widest text-rank-bronze">Third Place</div>
                <div className="font-display text-sm font-semibold uppercase text-ink">{third.name}</div>
              </Panel>
            </div>

            <Panel className="mt-4 flex items-center gap-4 p-5">
              <Star size={20} className="shrink-0 text-signal" />
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-signal">Tournament MVP</div>
                <div className="font-display text-lg font-semibold uppercase text-ink">{mvp.name}</div>
              </div>
            </Panel>
          </Section>
        )
      })}
    </div>
  )
}

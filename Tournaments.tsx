import { useState } from 'react'
import { MapPin, TrendingUp } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel } from '../components/ui/Panel'
import { Badge } from '../components/ui/Badge'
import { TeamBadge } from '../components/teams/TeamBadge'
import { Roadmap } from '../components/home/Roadmap'
import { flagLocations } from '../data/mockData'
import { useStore } from '../lib/store'

const STAGES = ['Group Stage', 'Knockout', 'Semi Final', 'Grand Final'] as const
const ADVANCE_PER_GROUP = 4

export default function Tournaments() {
  const { teams, matches } = useStore()
  const [stage, setStage] = useState<typeof STAGES[number]>('Group Stage')
  const stageMatches = matches.filter((m) => m.stage === stage)
  const groups = Array.from(new Set(stageMatches.map((m) => m.group).filter(Boolean))) as string[]

  return (
    <div>
      <Section eyebrow="RAMPAGE · Season 1" title="Tournament Structure" description="100 teams enter Dulang Creation's Apocalypse Map. One team leaves as champion.">
        <Roadmap />
      </Section>

      <Section eyebrow="Bracket" title="Interactive Timeline" description={stage === 'Group Stage' ? `Top ${ADVANCE_PER_GROUP} teams per group advance once all group matches are completed.` : undefined}>
        <div className="mb-6 flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-wider ${
                stage === s ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-dim'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {groups.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {groups.map((g) => {
              const gMatches = stageMatches.filter((m) => m.group === g)
              const allCompleted = gMatches.every((m) => m.status === 'completed')
              const groupTeams = teams
                .filter((t) => t.group === g)
                .sort((a, b) => b.totalPoints - a.totalPoints)

              return (
                <Panel key={g} className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-display text-lg font-bold uppercase text-signal">Group {g}</div>
                    {allCompleted ? (
                      <Badge tone="live" dot>Final</Badge>
                    ) : (
                      <Badge tone="data">In Progress</Badge>
                    )}
                  </div>

                  <ul className="mb-4 space-y-1.5">
                    {groupTeams.map((t, idx) => {
                      const advancing = allCompleted && idx < ADVANCE_PER_GROUP
                      return (
                        <li key={t.id} className={`flex items-center justify-between gap-2 px-1.5 py-1 font-mono text-xs ${advancing ? 'bg-live/[0.06]' : ''}`}>
                          <div className="flex min-w-0 items-center gap-1.5">
                            <TeamBadge team={t} size="sm" />
                            <span className={`truncate ${advancing ? 'text-live' : 'text-ink-dim'}`}>{t.name}</span>
                          </div>
                          <span className={advancing ? 'text-live' : 'text-ink-mute'}>{t.totalPoints}</span>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="border-t border-line-soft pt-3">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-mute">Matches</div>
                    <ul className="space-y-1.5">
                      {gMatches.map((m) => (
                        <li key={m.id} className="flex items-center justify-between font-mono text-xs">
                          <span className="text-ink-dim">Match {m.matchNumber}</span>
                          <Badge tone={m.status === 'live' ? 'hazard' : m.status === 'completed' ? 'neutral' : 'data'}>{m.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {allCompleted && (
                    <div className="mt-3 flex items-center gap-1.5 border-t border-line-soft pt-3 font-mono text-[10px] uppercase tracking-wider text-live">
                      <TrendingUp size={11} /> Top {ADVANCE_PER_GROUP} advance to Knockout
                    </div>
                  )}
                </Panel>
              )
            })}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {stageMatches.map((m) => (
              <Panel key={m.id} className="p-5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Match {m.matchNumber}</div>
                <div className="mt-1 font-display text-xl font-bold uppercase text-ink">{m.stage}</div>
                <div className="mt-2 font-mono text-xs text-ink-dim">{m.date} · {m.time}</div>
                <Badge tone="data" className="mt-3">{m.status}</Badge>
              </Panel>
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="Official Battleground" title="Dulang Creation's Apocalypse Map" description="All RAMPAGE matches are played exclusively on the Apocalypse Map — no alternative map is used this season.">
        <Panel className="grid gap-0 overflow-hidden md:grid-cols-[1.4fr_1fr]">
          <div className="grid-overlay relative flex min-h-[280px] items-center justify-center border-b border-line bg-panel-raised md:border-b-0 md:border-r">
            <MapPin size={36} className="text-signal/60" />
            <span className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
              5 Zones · Zone damage active
            </span>
          </div>
          <div className="p-5">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">Approved Flag Locations</div>
            <ul className="space-y-1.5">
              {flagLocations.map((loc) => (
                <li key={loc.id} className="flex items-center justify-between font-mono text-xs">
                  <span className={loc.approved ? 'text-ink-dim' : 'text-ink-mute line-through'}>{loc.name}</span>
                  <span className="text-ink-mute">{loc.zoneArea}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </Section>
    </div>
  )
}

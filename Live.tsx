import { useEffect, useState } from 'react'
import { Bot, Flag as FlagIcon, MapPin, Radio, Timer } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel, PanelHeader } from '../components/ui/Panel'
import { Badge, LiveDot } from '../components/ui/Badge'
import { ScoreboardTable } from '../components/scoreboard/ScoreboardTable'
import { teamById } from '../data/mockData'
import { useStore } from '../lib/store'
import { formatSeconds } from '../lib/format'
import { tournamentService } from '../lib/tournamentService'

const EVENT_LABEL: Record<string, string> = {
  TEAM_ELIMINATED: 'Team Eliminated', TEAM_WIPE: 'Team Wipe +3', FLAG_CAPTURED: 'Flag Captured +3',
  FLAG_CARRIER_ELIMINATED: 'Flag Carrier Eliminated +2', IMPORTANT_MOVEMENT: 'Important Movement',
  FINAL_ZONE: 'Final Zone', DRONE_DEPLOYED: 'Drone Deployed',
}

export default function Live() {
  const { matches } = useStore()
  const liveMatch = matches.find((m) => m.status === 'live') ?? null
  const [timer, setTimer] = useState(liveMatch?.timerSeconds ?? 0)

  useEffect(() => {
    if (!liveMatch) return
    return tournamentService.subscribeMatchTimer(liveMatch, setTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMatch?.id])

  if (!liveMatch) {
    return (
      <Section eyebrow="Live" title="No Match Is Live Right Now">
        <Panel className="p-10 text-center text-sm text-ink-dim">
          Check the Matches page for the next scheduled broadcast.
        </Panel>
      </Section>
    )
  }

  const flagTeam = liveMatch.flag.carrierTeamId ? teamById(liveMatch.flag.carrierTeamId) : null
  const droneTeam = liveMatch.drone.operatorTeamId ? teamById(liveMatch.drone.operatorTeamId) : null

  return (
    <div>
      <div className="border-b border-line bg-panel/40 scanlines">
        <Section eyebrow={`Match ${liveMatch.matchNumber} · Group ${liveMatch.group}`} title="Live Broadcast" className="py-10">
          <div className="flex flex-wrap items-center gap-4">
            <Badge tone="hazard"><LiveDot /> Live Now</Badge>
            <span className="flex items-center gap-1.5 font-mono text-sm tabular text-ink"><Timer size={14} /> {formatSeconds(timer)} remaining</span>
            <span className="font-mono text-sm text-ink-dim">Zone {liveMatch.zone}/5 — {liveMatch.zoneStatus}</span>
          </div>
        </Section>
      </div>

      <Section eyebrow="Objective Status" title="Flag & Drone" className="pb-0">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel className="p-5">
            <div className="mb-3 flex items-center gap-2 text-signal"><FlagIcon size={16} /><span className="font-mono text-xs uppercase tracking-widest">Flag Status</span></div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow label="Status" value={liveMatch.flag.status} />
              <InfoRow label="Location" value={liveMatch.flag.location} icon={<MapPin size={12} />} />
              <InfoRow label="Carrier" value={flagTeam?.name ?? '—'} />
              <InfoRow label="Captured At" value={liveMatch.flag.captureTimestamp ?? '—'} />
            </div>
          </Panel>
          <Panel className="p-5">
            <div className="mb-3 flex items-center gap-2 text-data"><Bot size={16} /><span className="font-mono text-xs uppercase tracking-widest">Drone Status</span></div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow label="Deployed" value={liveMatch.drone.deployed ? 'Yes' : 'No'} />
              <InfoRow label="Operator" value={droneTeam?.name ?? '—'} />
              <InfoRow label="Deployed At" value={liveMatch.drone.deployedAt ?? '—'} />
              <InfoRow label="Role" value="Reconnaissance only" />
            </div>
          </Panel>
        </div>
      </Section>

      <Section eyebrow="Scoring" title="Live Scoreboard">
        <ScoreboardTable rows={liveMatch.scoreboard} live />
      </Section>

      <Section eyebrow="Event Feed" title="Recent Eliminations" className="pb-24">
        <Panel clip={false}>
          <PanelHeader eyebrow="Broadcast" title="Live Event Feed" action={<span className="flex items-center gap-1.5 font-mono text-[11px] text-hazard"><Radio size={12} /> Streaming</span>} />
          <ul className="divide-y divide-line-soft">
            {liveMatch.events.map((e) => {
              const team = e.teamId ? teamById(e.teamId) : null
              const secondary = e.secondaryTeamId ? teamById(e.secondaryTeamId) : null
              return (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3 font-mono text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-14 text-ink-mute">{e.timestamp}</span>
                    <Badge tone={e.type.includes('FLAG') ? 'signal' : e.type === 'TEAM_WIPE' ? 'hazard' : 'neutral'}>{EVENT_LABEL[e.type]}</Badge>
                    <span className="text-ink-dim">
                      <span className="text-ink">{team?.name}</span> {e.detail}
                      {secondary ? <> (<span className="text-ink">{secondary.name}</span>)</> : null}
                    </span>
                  </div>
                  {e.pointsAwarded && <span className="text-signal">+{e.pointsAwarded}</span>}
                </li>
              )
            })}
          </ul>
        </Panel>
      </Section>
    </div>
  )
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
      <div className="mt-0.5 flex items-center gap-1 text-ink">{icon}{value}</div>
    </div>
  )
}

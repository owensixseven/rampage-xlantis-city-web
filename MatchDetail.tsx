import { Link, useParams } from 'react-router-dom'
import { Bot, Flag as FlagIcon, MapPin, Timer } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel, PanelHeader } from '../components/ui/Panel'
import { Badge, LiveDot } from '../components/ui/Badge'
import { ScoreboardTable } from '../components/scoreboard/ScoreboardTable'
import { useStore } from '../lib/store'
import { TeamBadge } from '../components/teams/TeamBadge'
import { formatSeconds } from '../lib/format'

const EVENT_LABEL: Record<string, string> = {
  TEAM_ELIMINATED: 'Team Eliminated', TEAM_WIPE: 'Team Wipe +3', FLAG_CAPTURED: 'Flag Captured +3',
  FLAG_CARRIER_ELIMINATED: 'Flag Carrier Eliminated +2', IMPORTANT_MOVEMENT: 'Important Movement',
  FINAL_ZONE: 'Final Zone', DRONE_DEPLOYED: 'Drone Deployed',
}

export default function MatchDetail() {
  const { id } = useParams()
  const { matches, teams: allTeams } = useStore()
  const match = matches.find((m) => m.id === id)
  const teamById = (tid: string) => allTeams.find((t) => t.id === tid)

  if (!match) {
    return (
      <Section title="Match Not Found">
        <p className="text-ink-dim">We couldn't find that match. <Link to="/matches" className="text-signal">Back to matches</Link></p>
      </Section>
    )
  }

  const teams = match.teamIds.map((tid) => teamById(tid))

  return (
    <div>
      <Section eyebrow={`Match ${match.matchNumber} · ${match.stage}${match.group ? ` · Group ${match.group}` : ''}`} title="Match Center" className="pb-6">
        <div className="flex flex-wrap items-center gap-3">
          {match.status === 'live' ? (
            <Badge tone="hazard"><LiveDot /> Live</Badge>
          ) : match.status === 'completed' ? (
            <Badge tone="neutral">Completed</Badge>
          ) : (
            <Badge tone="data">Upcoming</Badge>
          )}
          <span className="font-mono text-sm text-ink-dim">{match.date} · {match.time}</span>
          {match.status !== 'upcoming' && (
            <span className="flex items-center gap-1.5 font-mono text-sm tabular text-ink"><Timer size={14} /> {formatSeconds(match.timerSeconds)}</span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {teams.map((t) => t && (
            <Link key={t.id} to={`/teams/${t.id}`} className="flex items-center gap-2 border border-line bg-panel px-3 py-1.5 hover:border-signal/40">
              <TeamBadge team={t} size="sm" />
              <span className="font-mono text-xs text-ink-dim">{t.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      {match.status === 'upcoming' ? (
        <Section className="pb-24">
          <Panel className="p-10 text-center text-sm text-ink-dim">
            Flag location, scoreboard and event feed unlock once this match goes live.
          </Panel>
        </Section>
      ) : (
        <>
          <Section eyebrow="Objectives" title="Flag & Drone" className="pb-0">
            <div className="grid gap-4 md:grid-cols-2">
              <Panel className="p-5">
                <div className="mb-3 flex items-center gap-2 text-signal"><FlagIcon size={16} /><span className="font-mono text-xs uppercase tracking-widest">Flag</span></div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Status" value={match.flag.status} />
                  <Info label="Location" value={match.flag.location} icon={<MapPin size={12} />} />
                  <Info label="Carrier" value={match.flag.carrierTeamId ? teamById(match.flag.carrierTeamId)?.name ?? '—' : '—'} />
                  <Info label="Captured" value={match.flag.captureTimestamp ?? '—'} />
                </div>
              </Panel>
              <Panel className="p-5">
                <div className="mb-3 flex items-center gap-2 text-data"><Bot size={16} /><span className="font-mono text-xs uppercase tracking-widest">Drone</span></div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Deployed" value={match.drone.deployed ? 'Yes' : 'No'} />
                  <Info label="Operator" value={match.drone.operatorTeamId ? teamById(match.drone.operatorTeamId)?.name ?? '—' : '—'} />
                  <Info label="Role" value="Reconnaissance only" />
                  <Info label="Zone" value={`${match.zone}/5 — ${match.zoneStatus}`} />
                </div>
              </Panel>
            </div>
          </Section>

          <Section eyebrow="Scoring" title="Scoreboard">
            <ScoreboardTable rows={match.scoreboard} live={match.status === 'live'} />
          </Section>

          <Section eyebrow="Event Feed" title="Match Events" className="pb-24">
            <Panel clip={false}>
              <PanelHeader title="Event History" />
              <ul className="divide-y divide-line-soft">
                {match.events.map((e) => {
                  const team = e.teamId ? teamById(e.teamId) : null
                  return (
                    <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3 font-mono text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-14 text-ink-mute">{e.timestamp}</span>
                        <Badge tone={e.type.includes('FLAG') ? 'signal' : e.type === 'TEAM_WIPE' ? 'hazard' : 'neutral'}>{EVENT_LABEL[e.type]}</Badge>
                        <span className="text-ink-dim"><span className="text-ink">{team?.name}</span> {e.detail}</span>
                      </div>
                      {e.pointsAwarded && <span className="text-signal">+{e.pointsAwarded}</span>}
                    </li>
                  )
                })}
              </ul>
            </Panel>
          </Section>
        </>
      )}
    </div>
  )
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
      <div className="mt-0.5 flex items-center gap-1 text-ink">{icon}{value}</div>
    </div>
  )
}

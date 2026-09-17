import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award, Bug, CheckCircle2, FileText, Flag, Gavel, ImagePlus, LayoutGrid, Lock, Megaphone,
  Download, Plus, RefreshCw, RotateCcw, Save, Search, Settings, ShieldAlert, Star, Swords, BarChart3, UserCog, Radio, SlidersHorizontal,
  Trash2, Trophy, Unlock, Users, XCircle,
} from 'lucide-react'
import { Section } from '../../components/ui/Section'
import { Panel, PanelHeader } from '../../components/ui/Panel'
import { Badge } from '../../components/ui/Badge'
import { TeamBadge } from '../../components/teams/TeamBadge'
import { players, highlights } from '../../data/mockData'
import { useStore } from '../../lib/store'
import { useAuth } from '../../lib/auth'
import type { Sponsor } from '../../data/types'
import type { ReportCategory } from '../../lib/reportTypes'
import { kd } from '../../lib/format'
import { LOCAL_FALLBACK_CREDENTIALS } from '../../data/credentials'
import type { MatchStatus, TournamentSettings } from '../../data/types'

const SECTIONS = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'teams', label: 'Teams', icon: Users },
  { key: 'standings', label: 'Standings', icon: Trophy },
  { key: 'mvp', label: 'MVP', icon: Star },
  { key: 'matches', label: 'Matches', icon: Swords },
  { key: 'highlights', label: 'Highlights', icon: Award },
  { key: 'sponsors', label: 'Sponsors & Ads', icon: Megaphone },
  { key: 'anticheat', label: 'Anti-Cheat', icon: ShieldAlert },
  { key: 'announcements', label: 'Announcements', icon: Radio },
  { key: 'settings', label: 'Tournament Settings', icon: SlidersHorizontal },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'accounts', label: 'Accounts', icon: UserCog },
  { key: 'players', label: 'Players', icon: Users },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'audit', label: 'Audit Logs', icon: Gavel },
]

const ROLES = ['Player', 'Team Manager', 'Caster', 'Referee', 'Admin', 'Super Admin']

const STATUS_TONE = {
  APPROVED: 'live', LOCKED: 'data', UNDER_REVIEW: 'signal', PENDING: 'neutral', REJECTED: 'hazard',
} as const

export default function AdminDashboard() {
  const [section, setSection] = useState('overview')
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const { session } = useAuth()
  const { teams, matches, sponsors, publishedHighlightIds, auditLog, connectionStatus, reports, recallMatch, approveMatchResults, addSponsor, removeSponsor, toggleHighlightPublished, resetDemoData, updateMatch } = useStore()

  const actor = session?.label ?? 'Admin'
  const pending = teams.filter((t) => t.status === 'PENDING' || t.status === 'UNDER_REVIEW').length
  const live = matches.filter((m) => m.status === 'live').length

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }
      if (event.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const commandSections = SECTIONS.filter((item) => item.label.toLowerCase().includes(commandQuery.trim().toLowerCase()))

  return (
    <Section
      eyebrow="Restricted Access"
      title="Admin Dashboard"
      description="Actions here update the site's shared session state immediately — team status, match recalls, sponsors and highlight visibility."
      action={
        <div className="flex items-center gap-3">
          <Badge tone={connectionStatus === 'online' ? 'live' : connectionStatus === 'connecting' ? 'data' : 'hazard'} dot>
            {connectionStatus === 'online' ? 'Live — shared with all visitors' : connectionStatus === 'connecting' ? 'Connecting…' : 'Offline — local browser only'}
          </Badge>
          <button
            onClick={() => { setCommandOpen(true); setCommandQuery('') }}
            className="hidden items-center gap-2 border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim hover:border-signal hover:text-signal sm:flex"
          >
            Command <kbd className="border border-line px-1 text-[9px] text-ink-mute">Ctrl K</kbd>
          </button>
          <button
            onClick={() => resetDemoData(actor)}
            className="flex items-center gap-1.5 border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim hover:border-hazard hover:text-hazard"
          >
            <RotateCcw size={12} /> Reset Demo Data
          </button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`flex shrink-0 items-center gap-2.5 border px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider ${
                  section === s.key ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-dim'
                }`}
              >
                <Icon size={13} /> {s.label}
              </button>
            )
          })}
        </nav>

        <div>
          {section === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <MetricCard label="Registered Teams" value={teams.length} />
                <MetricCard label="Pending Review" value={pending} tone="signal" />
                <MetricCard label="Live Matches" value={live} tone="hazard" />
                <MetricCard label="Total Players" value={players.length} />
                <MetricCard label="Open Reports" value={reports.filter((r) => r.status === 'OPEN').length} tone="hazard" />
              </div>

              <AdminCommandCenter teams={teams} matches={matches} reports={reports} connectionStatus={connectionStatus} />

              <Panel className="p-5">
                <div className="mb-3 flex items-center gap-2 text-ink-dim"><Settings size={14} /><span className="font-mono text-xs uppercase tracking-widest">Role-Based Access</span></div>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => <Badge key={r} tone="neutral">{r}</Badge>)}
                </div>
              </Panel>

              <Panel clip={false}>
                <PanelHeader title="Recent Admin Activity" eyebrow="Audit Log" />
                <ul className="divide-y divide-line-soft">
                  {auditLog.slice(0, 6).map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3 font-mono text-xs">
                      <span className="text-ink-dim">{a.action}</span>
                      <span className="text-ink-mute">{a.actor} · {a.timestamp}</span>
                    </li>
                  ))}
                  {auditLog.length === 0 && (
                    <li className="px-5 py-6 text-center font-mono text-xs text-ink-mute">No actions taken yet this session.</li>
                  )}
                </ul>
              </Panel>
            </div>
          )}

          {section === 'teams' && <TeamsManager />}

          {section === 'standings' && <StandingsManager />}

          {section === 'mvp' && <MvpManager />}

          {section === 'matches' && (
            <Panel clip={false}>
              <PanelHeader title="Manage Matches" eyebrow={`${matches.length} Total`} />
              <ul className="divide-y divide-line-soft">
                {matches.map((m) => (
                  <li key={m.id} className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                        Match {m.matchNumber} · {m.stage}{m.group ? ` · Group ${m.group}` : ''}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">{m.date} · {m.time}{m.notes ? ` · ${m.notes}` : ''}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={m.status} onChange={(e) => updateMatch(m.id, { status: e.target.value as MatchStatus }, actor)} className="border border-line bg-void-2 px-2 py-1.5 font-mono text-[10px] uppercase text-ink focus:border-signal/50 focus:outline-none">
                        <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option>
                      </select>
                      <input defaultValue={m.notes ?? ''} onBlur={(e) => updateMatch(m.id, { notes: e.target.value }, actor)} placeholder="Match note" className="w-28 border border-line bg-void-2 px-2 py-1.5 font-mono text-[10px] text-ink placeholder:text-ink-mute focus:border-signal/50 focus:outline-none" />
                      <Badge tone={m.status === 'live' ? 'hazard' : m.status === 'completed' ? 'neutral' : 'data'}>{m.status}</Badge>
                      {m.status !== 'upcoming' && (
                        <>
                          <ActionButton icon={<RefreshCw size={12} />} label="Recall" onClick={() => recallMatch(m.id, 'match', actor)} tone="signal" />
                          <ActionButton icon={<RefreshCw size={12} />} label="Hard Recall" onClick={() => recallMatch(m.id, 'hard', actor)} tone="hazard" />
                        </>
                      )}
                      {m.status === 'completed' && (
                        <ActionButton icon={<CheckCircle2 size={12} />} label="Approve Results" onClick={() => approveMatchResults(m.id, actor)} tone="live" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {section === 'highlights' && (
            <Panel clip={false}>
              <PanelHeader title="Publish Highlights" eyebrow={`${publishedHighlightIds.size} / ${highlights.length} Published`} />
              <ul className="divide-y divide-line-soft">
                {highlights.map((h) => {
                  const isPublished = publishedHighlightIds.has(h.id)
                  return (
                    <li key={h.id} className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{h.title}</div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">{h.category.replace(/_/g, ' ')} · {h.location}</div>
                      </div>
                      <ActionButton
                        icon={isPublished ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                        label={isPublished ? 'Unpublish' : 'Publish'}
                        onClick={() => toggleHighlightPublished(h.id, actor)}
                        tone={isPublished ? 'hazard' : 'live'}
                      />
                    </li>
                  )
                })}
              </ul>
            </Panel>
          )}

          {section === 'sponsors' && <SponsorManager sponsors={sponsors} onAdd={(s) => addSponsor(s, actor)} onRemove={(id) => removeSponsor(id, actor)} />}

          {section === 'anticheat' && <AntiCheatManager />}
          {section === 'announcements' && <AnnouncementsManager />}
          {section === 'settings' && <TournamentSettingsManager />}
          {section === 'analytics' && <AnalyticsManager />}
          {section === 'accounts' && <AccountsManager />}
          {section === 'players' && <PlayersManager />}

          {section === 'reports' && <ReportsManager />}

          {section === 'audit' && <AuditLogManager auditLog={auditLog} />}
        </div>
      </div>
      {commandOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-void/75 px-4 pt-[14vh] backdrop-blur-sm" onMouseDown={() => setCommandOpen(false)}>
          <div className="w-full max-w-xl border border-signal/40 bg-panel shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={16} className="text-signal" />
              <input
                autoFocus
                value={commandQuery}
                onChange={(event) => setCommandQuery(event.target.value)}
                placeholder="Jump to an admin section…"
                className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-ink-mute focus:outline-none"
              />
              <kbd className="border border-line px-1.5 py-0.5 font-mono text-[9px] text-ink-mute">ESC</kbd>
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {commandSections.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => { setSection(item.key); setCommandOpen(false); setCommandQuery('') }}
                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left font-mono text-xs uppercase tracking-wider text-ink-dim hover:bg-signal/10 hover:text-signal"
                  >
                    <span className="flex items-center gap-3"><Icon size={15} /> {item.label}</span>
                    <span className="text-[10px] text-ink-mute">Open</span>
                  </button>
                )
              })}
              {commandSections.length === 0 && <div className="px-3 py-8 text-center font-mono text-xs text-ink-mute">No admin section matches that command.</div>}
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}

function AuditLogManager({ auditLog }: { auditLog: ReturnType<typeof useStore>['auditLog'] }) {
  const [query, setQuery] = useState('')
  const [actorFilter, setActorFilter] = useState('all')
  const actors = [...new Set(auditLog.map((entry) => entry.actor))].sort()
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = auditLog.filter((entry) => {
    const matchesActor = actorFilter === 'all' || entry.actor === actorFilter
    const matchesQuery = !normalizedQuery || `${entry.action} ${entry.actor} ${entry.timestamp}`.toLowerCase().includes(normalizedQuery)
    return matchesActor && matchesQuery
  })

  const exportCsv = () => {
    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`
    const csv = [
      'Timestamp,Actor,Action',
      ...filtered.map((entry) => [entry.timestamp, entry.actor, entry.action].map(escapeCsv).join(',')),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `rampage-audit-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Panel clip={false}>
      <PanelHeader
        title="Full Audit Log"
        eyebrow={`${filtered.length} of ${auditLog.length} retained entries`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actions…" className="border border-line bg-void-2 py-1.5 pl-8 pr-3 font-mono text-xs text-ink placeholder:text-ink-mute focus:border-signal/50 focus:outline-none" />
            </div>
            <select value={actorFilter} onChange={(event) => setActorFilter(event.target.value)} className="border border-line bg-void-2 px-2.5 py-1.5 font-mono text-xs text-ink focus:border-signal/50 focus:outline-none">
              <option value="all">All actors</option>
              {actors.map((actor) => <option key={actor} value={actor}>{actor}</option>)}
            </select>
            <button onClick={exportCsv} disabled={!filtered.length} title="Export filtered audit log" className="flex items-center gap-1.5 border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40">
              <Download size={12} /> Export CSV
            </button>
          </div>
        }
      />
      <ul className="divide-y divide-line-soft">
        {filtered.map((entry) => (
          <li key={entry.id} className="flex flex-col gap-1 px-5 py-3 font-mono text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <span className="text-ink-dim">{entry.action}</span>
            <span className="text-ink-mute">{entry.actor} · {entry.timestamp}</span>
          </li>
        ))}
        {!filtered.length && <li className="px-5 py-8 text-center font-mono text-xs text-ink-mute">No audit entries match the current filters.</li>}
      </ul>
    </Panel>
  )
}

function AdminCommandCenter({
  teams, matches, reports, connectionStatus,
}: {
  teams: ReturnType<typeof useStore>['teams']
  matches: ReturnType<typeof useStore>['matches']
  reports: ReturnType<typeof useStore>['reports']
  connectionStatus: ReturnType<typeof useStore>['connectionStatus']
}) {
  const liveMatches = matches.filter((match) => match.status === 'live')
  const nextMatches = matches.filter((match) => match.status === 'upcoming').slice(0, 3)
  const topTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 5)
  const maxPoints = Math.max(topTeams[0]?.totalPoints ?? 1, 1)
  const openReports = reports.filter((report) => report.status === 'OPEN').length

  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr_1fr]">
      <Panel clip={false} className="overflow-hidden">
        <PanelHeader title="Live Operations" eyebrow={`${liveMatches.length} Active Feed${liveMatches.length === 1 ? '' : 's'}`} />
        <div className="divide-y divide-line-soft">
          {liveMatches.length > 0 ? liveMatches.map((match) => (
            <div key={match.id} className="px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-ink">
                  <span className="h-2 w-2 animate-pulse bg-hazard" /> Match {match.matchNumber}
                </div>
                <Badge tone="hazard" dot>Live</Badge>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <div className="font-display text-3xl font-bold tabular text-ink">{Math.floor(match.timerSeconds / 60)}:{String(match.timerSeconds % 60).padStart(2, '0')}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">Zone {match.zone} · {match.zoneStatus}</div>
                </div>
                <div className="text-right font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  <div>{match.scoreboard.length} Teams</div>
                  <div className="mt-1 text-signal">{match.events.length} Events</div>
                </div>
              </div>
            </div>
          )) : (
            <div className="px-5 py-8 text-center">
              <Radio size={18} className="mx-auto text-ink-mute" />
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-ink-dim">No live matches</div>
              <div className="mt-1 font-mono text-[10px] text-ink-mute">Next scheduled feeds appear below</div>
            </div>
          )}
          {nextMatches.length > 0 && (
            <div className="px-5 py-3">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-mute">Next up</div>
              <div className="flex flex-wrap gap-2">
                {nextMatches.map((match) => <Badge key={match.id} tone="data">M{match.matchNumber} · {match.time}</Badge>)}
              </div>
            </div>
          )}
        </div>
      </Panel>

      <Panel clip={false}>
        <PanelHeader title="Standings Pulse" eyebrow="Top 5 Teams" />
        <div className="space-y-4 px-5 py-4">
          {topTeams.map((team, index) => (
            <div key={team.id}>
              <div className="mb-1.5 flex items-center justify-between gap-3 font-mono text-xs">
                <span className="truncate text-ink"><span className="mr-2 text-ink-mute">0{index + 1}</span>{team.name}</span>
                <span className="shrink-0 font-bold text-signal">{team.totalPoints}</span>
              </div>
              <div className="h-1.5 bg-void-2"><div className="h-full bg-signal transition-all" style={{ width: `${Math.max((team.totalPoints / maxPoints) * 100, 3)}%` }} /></div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel clip={false}>
        <PanelHeader title="System Pulse" eyebrow="Operational Status" />
        <div className="divide-y divide-line-soft">
          <StatusRow label="Shared backend" value={connectionStatus === 'online' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting' : 'Offline'} tone={connectionStatus === 'online' ? 'live' : connectionStatus === 'connecting' ? 'data' : 'hazard'} />
          <StatusRow label="Match feeds" value={`${matches.length} registered`} />
          <StatusRow label="Open reports" value={String(openReports)} tone={openReports > 0 ? 'hazard' : 'live'} />
          <StatusRow label="Last sync" value={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
        </div>
      </Panel>
    </div>
  )
}

function StatusRow({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'live' | 'data' | 'hazard' | 'neutral' }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 font-mono text-xs">
      <span className="text-ink-dim">{label}</span>
      <span className={tone === 'live' ? 'text-live' : tone === 'data' ? 'text-data' : tone === 'hazard' ? 'text-hazard' : 'text-ink-mute'}>{value}</span>
    </div>
  )
}

function MetricCard({ label, value, tone = 'ink' }: { label: string; value: number; tone?: 'ink' | 'signal' | 'hazard' }) {
  const color = tone === 'signal' ? 'text-signal' : tone === 'hazard' ? 'text-hazard' : 'text-ink'
  return (
    <div className="border border-line bg-panel p-4">
      <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
    </div>
  )
}

const REPORT_CATEGORY_ICON: Record<ReportCategory, React.ReactNode> = {
  player: <Users size={13} />,
  team: <Flag size={13} />,
  match: <Swords size={13} />,
  bug: <Bug size={13} />,
}

function ReportsManager() {
  const { reports, resolveReport, dismissReport } = useStore()
  const { session } = useAuth()
  const actor = session?.label ?? 'Admin'
  const [filter, setFilter] = useState<'OPEN' | 'RESOLVED' | 'DISMISSED' | 'ALL'>('OPEN')

  const filtered = filter === 'ALL' ? reports : reports.filter((r) => r.status === filter)

  return (
    <Panel clip={false}>
      <PanelHeader
        title="Player / Team / Match / Bug Reports"
        eyebrow={`${reports.filter((r) => r.status === 'OPEN').length} Open`}
        action={
          <div className="flex flex-wrap gap-1.5">
            {(['OPEN', 'RESOLVED', 'DISMISSED', 'ALL'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                  filter === f ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-mute'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />
      <ul className="divide-y divide-line-soft">
        {filtered.map((r) => (
          <li key={r.id} className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-line text-ink-dim">
                {REPORT_CATEGORY_ICON[r.category]}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                    {r.category === 'bug' ? 'Bug Report' : r.targetLabel ?? 'Unknown target'}
                  </span>
                  <Badge tone={r.status === 'OPEN' ? 'hazard' : r.status === 'RESOLVED' ? 'live' : 'neutral'}>{r.status}</Badge>
                </div>
                <p className="mt-1 max-w-lg text-sm text-ink-dim">{r.description}</p>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  {r.reporterName} · {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            {r.status === 'OPEN' && (
              <div className="flex shrink-0 gap-1.5">
                <ActionButton icon={<CheckCircle2 size={12} />} label="Resolve" onClick={() => resolveReport(r.id, actor)} tone="live" />
                <ActionButton icon={<XCircle size={12} />} label="Dismiss" onClick={() => dismissReport(r.id, actor)} tone="neutral" />
              </div>
            )}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-5 py-8 text-center font-mono text-xs text-ink-mute">No {filter !== 'ALL' ? filter.toLowerCase() : ''} reports.</li>
        )}
      </ul>
    </Panel>
  )
}

function TeamsManager() {
  const { teams, setTeamStatus, setTeamLogo } = useStore()
  const { session } = useAuth()
  const actor = session?.label ?? 'Admin'
  const [query, setQuery] = useState('')
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  const filtered = teams.filter(
    (t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.tag.toLowerCase().includes(query.toLowerCase()),
  )

  const handleLogoFile = (teamId: string, file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setTeamLogo(teamId, reader.result as string, actor)
    reader.readAsDataURL(file)
  }

  return (
    <Panel clip={false}>
      <PanelHeader
        title="Manage Teams"
        eyebrow={`${teams.length} Registered`}
        action={
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="border border-line bg-void-2 py-1.5 pl-8 pr-3 font-mono text-xs text-ink placeholder:text-ink-mute focus:border-signal/50 focus:outline-none"
            />
          </div>
        }
      />
      <ul className="divide-y divide-line-soft">
        {filtered.map((t) => (
          <li key={t.id} className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputs.current[t.id]?.click()}
                title="Change logo"
                className="group relative"
              >
                <TeamBadge team={t} size="md" />
                <span className="absolute inset-0 hidden items-center justify-center bg-void/70 group-hover:flex">
                  <ImagePlus size={12} className="text-ink" />
                </span>
              </button>
              <input
                ref={(el) => { fileInputs.current[t.id] = el }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoFile(t.id, e.target.files?.[0])}
              />
              <div>
                <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{t.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">Group {t.group}</div>
              </div>
              <Badge tone={STATUS_TONE[t.status]}>{t.status.replace('_', ' ')}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(t.status === 'PENDING' || t.status === 'UNDER_REVIEW') && (
                <>
                  <ActionButton icon={<CheckCircle2 size={12} />} label="Approve" onClick={() => setTeamStatus(t.id, 'APPROVED', actor)} tone="live" />
                  <ActionButton icon={<XCircle size={12} />} label="Reject" onClick={() => setTeamStatus(t.id, 'REJECTED', actor)} tone="hazard" />
                </>
              )}
              {t.status === 'APPROVED' && (
                <ActionButton icon={<Lock size={12} />} label="Lock" onClick={() => setTeamStatus(t.id, 'LOCKED', actor)} tone="data" />
              )}
              {t.status === 'LOCKED' && (
                <ActionButton icon={<Unlock size={12} />} label="Unlock" onClick={() => setTeamStatus(t.id, 'APPROVED', actor)} tone="live" />
              )}
              {t.status === 'REJECTED' && (
                <ActionButton icon={<CheckCircle2 size={12} />} label="Reconsider" onClick={() => setTeamStatus(t.id, 'PENDING', actor)} tone="neutral" />
              )}
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-5 py-8 text-center font-mono text-xs text-ink-mute">No teams match that search.</li>
        )}
      </ul>
    </Panel>
  )
}

function StandingsManager() {
  const { teams, updateTeamStats } = useStore()
  const { session } = useAuth()
  const actor = session?.label ?? 'Admin'
  const [query, setQuery] = useState('')
  const [drafts, setDrafts] = useState<Record<string, { kills: number; teamWipes: number; flagPoints: number; positionPoints: number }>>({})
  const [savedId, setSavedId] = useState<string | null>(null)

  const sorted = [...teams].sort((a, b) => b.totalPoints - a.totalPoints)
  const filtered = sorted.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.tag.toLowerCase().includes(query.toLowerCase()))

  const draftFor = (t: (typeof teams)[number]) => drafts[t.id] ?? { kills: t.kills, teamWipes: t.teamWipes, flagPoints: t.flagPoints, positionPoints: t.positionPoints }

  const setField = (teamId: string, field: 'kills' | 'teamWipes' | 'flagPoints' | 'positionPoints', value: number) => {
    setDrafts((d) => ({ ...d, [teamId]: { ...draftFor(teams.find((t) => t.id === teamId)!), ...d[teamId], [field]: value } }))
  }

  const save = (teamId: string) => {
    const draft = drafts[teamId]
    if (!draft) return
    updateTeamStats(teamId, draft, actor)
    setSavedId(teamId)
    window.setTimeout(() => setSavedId((current) => current === teamId ? null : current), 1400)
    setDrafts((d) => {
      const next = { ...d }
      delete next[teamId]
      return next
    })
  }

  return (
    <Panel clip={false}>
      <PanelHeader
        title="Edit Standings"
        eyebrow="Type new numbers, then click Save on that row"
        action={
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="border border-line bg-void-2 py-1.5 pl-8 pr-3 font-mono text-xs text-ink placeholder:text-ink-mute focus:border-signal/50 focus:outline-none"
            />
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wider text-ink-mute">
              <th className="px-4 py-2.5">Rank</th>
              <th className="px-4 py-2.5">Team</th>
              <th className="px-4 py-2.5">Kills</th>
              <th className="px-4 py-2.5">Wipes</th>
              <th className="px-4 py-2.5">Flag Pts</th>
              <th className="px-4 py-2.5">Position Pts</th>
              <th className="px-4 py-2.5 text-signal">Total</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => {
              const draft = draftFor(t)
              const dirty = !!drafts[t.id]
              const liveTotal = draft.kills + draft.teamWipes * 3 + draft.flagPoints + draft.positionPoints
              return (
                <tr key={t.id} className="border-b border-line-soft font-mono text-sm">
                  <td className="px-4 py-2.5 text-ink-mute">{idx + 1}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <TeamBadge team={t} size="sm" />
                      <span className="text-ink">{t.name}</span>
                    </div>
                  </td>
                  <NumberCell value={draft.kills} onChange={(v) => setField(t.id, 'kills', v)} />
                  <NumberCell value={draft.teamWipes} onChange={(v) => setField(t.id, 'teamWipes', v)} />
                  <NumberCell value={draft.flagPoints} onChange={(v) => setField(t.id, 'flagPoints', v)} />
                  <NumberCell value={draft.positionPoints} onChange={(v) => setField(t.id, 'positionPoints', v)} />
                  <td className="px-4 py-2.5 font-bold text-signal">{liveTotal}</td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => save(t.id)}
                      disabled={!dirty}
                      className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                        dirty ? 'border-live/40 bg-live/10 text-live hover:bg-live/20' : 'border-line text-ink-mute opacity-40'
                      }`}
                    >
                      <motion.span initial={{ scale: 0.7 }} animate={{ scale: 1 }} key={savedId === t.id ? 'saved' : 'save'}>
                        {savedId === t.id ? <CheckCircle2 size={11} /> : <Save size={11} />}
                      </motion.span> {savedId === t.id ? 'Saved' : 'Save'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function NumberCell({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <td className="px-4 py-2.5">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-20 border border-line bg-void-2 px-2 py-1.5 font-mono text-sm text-ink tabular focus:border-signal/50 focus:outline-none"
      />
    </td>
  )
}

function MvpManager() {
  const { teams, mvpOverridePlayerId, setMvpOverride } = useStore()
  const { session } = useAuth()
  const actor = session?.label ?? 'Admin'
  const [query, setQuery] = useState('')

  const teamById = (id: string) => teams.find((t) => t.id === id)
  const topByScore = [...players].sort((a, b) => b.mvpScore - a.mvpScore)[0]
  const currentMvpId = mvpOverridePlayerId ?? topByScore?.id
  const filtered = players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 40)

  return (
    <Panel clip={false}>
      <PanelHeader
        title="Set Tournament MVP"
        eyebrow={mvpOverridePlayerId ? 'Manually set' : 'Automatic — highest score'}
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search player…"
                className="border border-line bg-void-2 py-1.5 pl-8 pr-3 font-mono text-xs text-ink placeholder:text-ink-mute focus:border-signal/50 focus:outline-none"
              />
            </div>
            {mvpOverridePlayerId && (
              <button
                onClick={() => setMvpOverride(null, actor)}
                className="flex items-center gap-1.5 border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim hover:border-hazard hover:text-hazard"
              >
                <XCircle size={11} /> Clear Override
              </button>
            )}
          </div>
        }
      />
      <ul className="divide-y divide-line-soft">
        {filtered.map((p) => {
          const team = teamById(p.teamId)
          const isCurrent = p.id === currentMvpId
          return (
            <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-3">
                {team && <TeamBadge team={team} size="sm" />}
                <div>
                  <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{p.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                    {team?.name} · {p.role} · Kills {p.kills} · K/D {kd(p.kills, p.deaths)}
                  </div>
                </div>
              </div>
              {isCurrent ? (
                <Badge tone="gold" dot>Current MVP</Badge>
              ) : (
                <button
                  onClick={() => setMvpOverride(p.id, actor)}
                  className="flex items-center gap-1.5 border border-signal/40 bg-signal/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-signal hover:bg-signal/20"
                >
                  <Star size={11} /> Set as MVP
                </button>
              )}
            </li>
          )
        })}
        {filtered.length === 0 && (
          <li className="px-5 py-8 text-center font-mono text-xs text-ink-mute">No players match that search.</li>
        )}
      </ul>
    </Panel>
  )
}

function AntiCheatManager() {
  const { antiCheatFlags, updateAntiCheatFlag } = useStore()
  const { session } = useAuth()
  const actor = session?.label ?? 'Admin'
  return <Panel clip={false}>
    <PanelHeader title="Anti-Cheat Moderation" eyebrow={`${antiCheatFlags.filter((flag) => flag.status === 'open').length} Open Flags`} />
    <ul className="divide-y divide-line-soft">
      {antiCheatFlags.map((flag) => <li key={flag.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{flag.playerName} <span className="text-ink-mute">· {flag.teamName}</span></div><div className="mt-1 text-sm text-ink-dim">{flag.reason}</div><div className="mt-1 font-mono text-[10px] uppercase text-ink-mute">{new Date(flag.createdAt).toLocaleString()}</div></div>
        <div className="flex items-center gap-2"><Badge tone={flag.status === 'open' ? 'hazard' : flag.status === 'banned' ? 'signal' : 'live'}>{flag.status}</Badge>{flag.status !== 'cleared' && <ActionButton icon={<CheckCircle2 size={12} />} label="Clear" onClick={() => updateAntiCheatFlag(flag.id, 'cleared', actor)} tone="live" />}{flag.status !== 'banned' && <ActionButton icon={<ShieldAlert size={12} />} label="Ban" onClick={() => updateAntiCheatFlag(flag.id, 'banned', actor)} tone="hazard" />}</div>
      </li>)}
      {antiCheatFlags.length === 0 && <li className="px-5 py-8 text-center font-mono text-xs text-ink-mute">No anti-cheat flags.</li>}
    </ul>
  </Panel>
}

function AnnouncementsManager() {
  const { announcements, addAnnouncement, removeAnnouncement } = useStore()
  const { session } = useAuth()
  const actor = session?.label ?? 'Admin'
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!title.trim() || !message.trim()) return; addAnnouncement({ title: title.trim(), message: message.trim() }, actor); setTitle(''); setMessage('') }
  return <div className="space-y-4"><Panel clip={false}><PanelHeader title="Public Announcements" eyebrow="Neutral admin publishing" /><ul className="divide-y divide-line-soft">{announcements.map((item) => <li key={item.id} className="flex items-start justify-between gap-4 px-5 py-4"><div><div className="font-display text-sm font-semibold uppercase text-ink">{item.title}</div><p className="mt-1 text-sm text-ink-dim">{item.message}</p><div className="mt-1 font-mono text-[10px] uppercase text-ink-mute">{item.author} · {new Date(item.createdAt).toLocaleString()}</div></div><ActionButton icon={<Trash2 size={12} />} label="Remove" onClick={() => removeAnnouncement(item.id, actor)} tone="hazard" /></li>)}</ul></Panel><Panel className="p-5"><form onSubmit={submit} className="space-y-3"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" className="w-full border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink focus:border-signal/50 focus:outline-none" /><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message shown to visitors" rows={3} className="w-full border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink focus:border-signal/50 focus:outline-none" /><button className="flex items-center gap-1.5 bg-signal px-4 py-2.5 font-mono text-xs font-bold uppercase text-void"><Plus size={13} /> Publish</button></form></Panel></div>
}

function TournamentSettingsManager() {
  const { tournamentSettings, updateTournamentSettings } = useStore()
  const { session } = useAuth()
  const actor = session?.label ?? 'Admin'
  const [draft, setDraft] = useState<TournamentSettings>(tournamentSettings)
  const [saved, setSaved] = useState(false)
  const set = (patch: Partial<TournamentSettings>) => setDraft((value) => ({ ...value, ...patch }))
  useEffect(() => setDraft(tournamentSettings), [tournamentSettings])

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.name.trim() || !draft.season.trim()) return
    updateTournamentSettings({ ...draft, name: draft.name.trim(), season: draft.season.trim(), prizePool: draft.prizePool.trim() }, actor)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  return (
    <Panel className="p-5">
      <PanelHeader title="Tournament Controls" eyebrow="Shared public settings" />
      <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        <label className="font-mono text-[11px] uppercase text-ink-dim">Name<input required value={draft.name} onChange={(e) => set({ name: e.target.value })} className="mt-1 w-full border border-line bg-void-2 px-3 py-2.5 text-sm text-ink focus:border-signal/50 focus:outline-none" /></label>
        <label className="font-mono text-[11px] uppercase text-ink-dim">Season<input required value={draft.season} onChange={(e) => set({ season: e.target.value })} className="mt-1 w-full border border-line bg-void-2 px-3 py-2.5 text-sm text-ink focus:border-signal/50 focus:outline-none" /></label>
        <label className="font-mono text-[11px] uppercase text-ink-dim">Status<select value={draft.status} onChange={(e) => set({ status: e.target.value as TournamentSettings['status'] })} className="mt-1 w-full border border-line bg-void-2 px-3 py-2.5 text-sm text-ink focus:border-signal/50 focus:outline-none"><option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option></select></label>
        <label className="font-mono text-[11px] uppercase text-ink-dim">Prize pool<input value={draft.prizePool} onChange={(e) => set({ prizePool: e.target.value })} className="mt-1 w-full border border-line bg-void-2 px-3 py-2.5 text-sm text-ink focus:border-signal/50 focus:outline-none" /></label>
        <label className="flex items-center gap-2 font-mono text-xs uppercase text-ink-dim sm:col-span-2"><input type="checkbox" checked={draft.registrationOpen} onChange={(e) => set({ registrationOpen: e.target.checked })} /> Registration open</label>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button type="submit" className="flex w-fit items-center gap-1.5 bg-signal px-4 py-2.5 font-mono text-xs font-bold uppercase text-void"><Save size={13} /> {saved ? 'Settings Saved' : 'Save Settings'}</button>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">Changes apply to the shared tournament state immediately.</span>
        </div>
      </form>
    </Panel>
  )
}

function AnalyticsManager() {
  const { teams, matches, reports } = useStore()
  const completed = matches.filter((match) => match.status === 'completed').length
  const totalKills = teams.reduce((sum, team) => sum + team.kills, 0)
  const reportResolution = reports.length ? Math.round((reports.filter((report) => report.status !== 'OPEN').length / reports.length) * 100) : 0
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="Matches Completed" value={completed} /><MetricCard label="Total Team Kills" value={totalKills} tone="signal" /><MetricCard label="Avg Kills / Team" value={teams.length ? Math.round(totalKills / teams.length) : 0} /><MetricCard label="Reports Resolved" value={reportResolution} tone="signal" /></div>
}

function AccountsManager() {
  return <Panel clip={false}><PanelHeader title="Configured Accounts" eyebrow={`${LOCAL_FALLBACK_CREDENTIALS.length} Role Labels`} /><div className="border-b border-line-soft px-5 py-3 text-xs text-ink-dim">Passwords remain in <span className="font-mono text-ink">server/.env</span> and are never exposed here.</div><ul className="divide-y divide-line-soft">{LOCAL_FALLBACK_CREDENTIALS.map((account) => <li key={account.id} className="flex items-center justify-between px-5 py-3"><span className="font-display text-sm uppercase text-ink">{account.label}</span><Badge tone="neutral">{account.role}</Badge></li>)}</ul></Panel>
}

function PlayersManager() {
  const [query, setQuery] = useState('')
  const filtered = players.filter((player) => player.name.toLowerCase().includes(query.toLowerCase()) || player.playerId.toLowerCase().includes(query.toLowerCase())).slice(0, 40)
  return <Panel clip={false}><PanelHeader title="Player Roster Management" eyebrow="Read-only generated roster" action={<div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-mute" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search player…" className="border border-line bg-void-2 py-1.5 pl-8 pr-3 font-mono text-xs text-ink" /></div>} /><ul className="divide-y divide-line-soft">{filtered.map((player) => <li key={player.id} className="flex items-center justify-between px-5 py-3"><div><div className="font-display text-sm uppercase text-ink">{player.name}</div><div className="font-mono text-[10px] uppercase text-ink-mute">{player.playerId} · {player.role}</div></div><div className="font-mono text-xs text-ink-dim">{player.kills} kills · {kd(player.kills, player.deaths)} K/D</div></li>)}</ul><div className="border-t border-line-soft px-5 py-3 font-mono text-[10px] uppercase text-ink-mute">Player stats are generated from the tournament roster and are not editable until a player persistence contract is added.</div></Panel>
}

function ActionButton({
  icon, label, onClick, tone,
}: { icon: React.ReactNode; label: string; onClick: () => void; tone: 'live' | 'hazard' | 'signal' | 'data' | 'neutral' }) {
  const [feedback, setFeedback] = useState(false)
  const handleClick = () => {
    onClick()
    setFeedback(true)
    window.setTimeout(() => setFeedback(false), 1200)
  }
  const toneClass = {
    live: 'border-live/40 bg-live/10 text-live hover:bg-live/20',
    hazard: 'border-hazard/40 bg-hazard/10 text-hazard hover:bg-hazard/20',
    signal: 'border-signal/40 bg-signal/10 text-signal hover:bg-signal/20',
    data: 'border-data/40 bg-data/10 text-data hover:bg-data/20',
    neutral: 'border-line text-ink-dim hover:bg-panel-raised',
  }[tone]
  return (
    <motion.button onClick={handleClick} whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.94 }} className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${toneClass}`}>
      <motion.span initial={{ scale: 0.7 }} animate={{ scale: 1 }} key={feedback ? 'done' : 'action'}>
        {feedback ? <CheckCircle2 size={12} /> : icon}
      </motion.span> {feedback ? 'Done' : label}
    </motion.button>
  )
}

function SponsorManager({
  sponsors, onAdd, onRemove,
}: { sponsors: Sponsor[]; onAdd: (s: Omit<Sponsor, 'id'>) => void; onRemove: (id: string) => void }) {
  const [name, setName] = useState('')
  const [tier, setTier] = useState<Sponsor['tier']>('partner')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), tier, wordmarkInitial: name.trim()[0]?.toUpperCase() ?? 'S' })
    setName('')
  }

  return (
    <div className="space-y-4">
      <Panel clip={false}>
        <PanelHeader title="Sponsors" eyebrow={`${sponsors.length} Active`} />
        <ul className="divide-y divide-line-soft">
          {sponsors.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-line font-display text-xs text-ink-dim">{s.wordmarkInitial}</span>
                <div>
                  <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{s.name}</div>
                  <Badge tone="neutral">{s.tier}</Badge>
                </div>
              </div>
              <button onClick={() => onRemove(s.id)} className="flex items-center gap-1.5 border border-hazard/40 bg-hazard/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-hazard hover:bg-hazard/20">
                <Trash2 size={12} /> Remove
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-mute">Add Sponsor</div>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[180px]">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink focus:border-signal/50 focus:outline-none" placeholder="e.g. Overtake Energy" />
          </label>
          <label>
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">Tier</span>
            <select value={tier} onChange={(e) => setTier(e.target.value as Sponsor['tier'])} className="border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink focus:border-signal/50 focus:outline-none">
              <option value="main">Main</option>
              <option value="tournament">Tournament</option>
              <option value="partner">Partner</option>
              <option value="team">Team</option>
            </select>
          </label>
          <button type="submit" className="flex items-center gap-1.5 bg-signal px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-void clip-tactical-sm hover:bg-signal-dim">
            <Plus size={13} /> Add
          </button>
        </form>
      </Panel>
    </div>
  )
}

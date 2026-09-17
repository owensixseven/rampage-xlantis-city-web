import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { teams as initialTeams, matches as initialMatches, sponsors as initialSponsors, highlights as initialHighlights } from '../data/mockData'
import { tagFor, TEAM_COLOR_PAIRS } from '../data/teamTag'
import type { Team, Match, Sponsor, TeamRegistrationStatus, AntiCheatFlag, AntiCheatFlagStatus, Announcement, TournamentSettings, MatchStatus } from '../data/types'
import type { Report, ReportCategory } from './reportTypes'
import { useAuth } from './auth'

// ─────────────────────────────────────────────────────────────────────────
// This store talks to the backend scaffold in `server/` over REST (writes)
// and WebSocket (live updates from every connected client — including
// other people's browsers). If the backend can't be reached, it falls back
// to a browser-only localStorage copy so the site still works, just
// without the "everyone sees the same data" guarantee. See README.md.
// ─────────────────────────────────────────────────────────────────────────

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || 'http://localhost:4000'
const WS_BASE = API_BASE.replace(/^http/, 'ws')
const STORAGE_KEY = 'rampage_store_v1'
const GROUP_LETTERS = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i))
const DEFAULT_TOURNAMENT_SETTINGS: TournamentSettings = { name: 'RAMPAGE: XLANTIS CITY', season: 'Season 1', status: 'live', prizePool: 'TBD', registrationOpen: true }

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  action: string
}

interface PersistedShape {
  teams: Team[]
  matches: Match[]
  sponsors: Sponsor[]
  publishedHighlightIds: string[]
  auditLog: AuditEntry[]
  mvpOverridePlayerId: string | null
  reports: Report[]
  antiCheatFlags: AntiCheatFlag[]
  announcements: Announcement[]
  tournamentSettings: TournamentSettings
}

function loadLocal(): PersistedShape | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.teams) || !Array.isArray(parsed.matches)) return null
    return parsed as PersistedShape
  } catch {
    return null
  }
}

function saveLocal(payload: PersistedShape) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore — best-effort fallback only
  }
}

export interface NewTeamInput {
  name: string
  captainName: string
  rosterEntries: string[]
  logoDataUrl?: string
}

export interface TeamStatsPatch {
  kills?: number
  teamWipes?: number
  flagPoints?: number
  positionPoints?: number
  matchesPlayed?: number
  wins?: number
  avgPlacement?: number
}

type ConnectionStatus = 'connecting' | 'online' | 'offline'

interface StoreValue {
  teams: Team[]
  matches: Match[]
  sponsors: Sponsor[]
  publishedHighlightIds: Set<string>
  auditLog: AuditEntry[]
  mvpOverridePlayerId: string | null
  connectionStatus: ConnectionStatus
  reports: Report[]
  antiCheatFlags: AntiCheatFlag[]
  announcements: Announcement[]
  tournamentSettings: TournamentSettings

  setTeamStatus: (teamId: string, status: TeamRegistrationStatus, actor?: string) => void
  updateTeamStats: (teamId: string, patch: TeamStatsPatch, actor?: string) => void
  recallMatch: (matchId: string, kind: 'match' | 'hard', actor?: string) => void
  approveMatchResults: (matchId: string, actor?: string) => void
  addSponsor: (sponsor: Omit<Sponsor, 'id'>, actor?: string) => void
  removeSponsor: (sponsorId: string, actor?: string) => void
  toggleHighlightPublished: (highlightId: string, actor?: string) => void
  logAction: (actor: string, action: string) => void
  createTeam: (input: NewTeamInput) => Promise<Team>
  setTeamLogo: (teamId: string, dataUrl: string, actor?: string) => void
  setMvpOverride: (playerId: string | null, actor?: string) => void
  resetDemoData: (actor?: string) => void
  submitReport: (input: { category: ReportCategory; targetId?: string | null; targetLabel?: string | null; description: string; reporterName?: string }) => Promise<Report>
  resolveReport: (reportId: string, actor?: string) => void
  dismissReport: (reportId: string, actor?: string) => void
  updateAntiCheatFlag: (flagId: string, status: AntiCheatFlagStatus, actor?: string) => void
  addAnnouncement: (input: { title: string; message: string }, actor?: string) => void
  removeAnnouncement: (id: string, actor?: string) => void
  updateTournamentSettings: (settings: TournamentSettings, actor?: string) => void
  updateMatch: (matchId: string, patch: { status?: MatchStatus; notes?: string }, actor?: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function timestamp() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

async function postJson(path: string, body: unknown, token?: string | null) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Request failed: ${path}`)
  return res.json()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const local = typeof window !== 'undefined' ? loadLocal() : null
  const { session } = useAuth()
  const token = session?.token ?? undefined

  const [teams, setTeams] = useState<Team[]>(() => (local ? local.teams : clone(initialTeams)))
  const [matches, setMatches] = useState<Match[]>(() => (local ? local.matches : clone(initialMatches)))
  const [sponsors, setSponsors] = useState<Sponsor[]>(() => (local ? local.sponsors : clone(initialSponsors)))
  const [publishedHighlightIds, setPublishedHighlightIds] = useState<Set<string>>(
    () => new Set(local ? local.publishedHighlightIds : initialHighlights.map((h) => h.id)),
  )
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(() => (local ? local.auditLog : []))
  const [mvpOverridePlayerId, setMvpOverridePlayerId] = useState<string | null>(() => (local ? local.mvpOverridePlayerId ?? null : null))
  const [reports, setReports] = useState<Report[]>(() => (local ? local.reports ?? [] : []))
  const [antiCheatFlags, setAntiCheatFlags] = useState<AntiCheatFlag[]>(() => local?.antiCheatFlags ?? [])
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => local?.announcements ?? [])
  const [tournamentSettings, setTournamentSettings] = useState<TournamentSettings>(() => local?.tournamentSettings ?? DEFAULT_TOURNAMENT_SETTINGS)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const usingBackend = useRef(false)
  const wsRef = useRef<WebSocket | null>(null)

  // ── Connect to the backend on mount ────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    fetch(`${API_BASE}/api/state`)
      .then((res) => {
        if (!res.ok) throw new Error('bad response')
        return res.json()
      })
      .then((state: PersistedShape) => {
        if (cancelled) return
        usingBackend.current = true
        setTeams(state.teams)
        setMatches(state.matches)
        setSponsors(state.sponsors)
        setPublishedHighlightIds(new Set(state.publishedHighlightIds))
        setAuditLog(state.auditLog)
        setMvpOverridePlayerId(state.mvpOverridePlayerId ?? null)
        setReports(state.reports ?? [])
        setAntiCheatFlags(state.antiCheatFlags ?? [])
        setAnnouncements(state.announcements ?? [])
        setTournamentSettings(state.tournamentSettings ?? DEFAULT_TOURNAMENT_SETTINGS)
        setConnectionStatus('online')
        connectSocket()
      })
      .catch(() => {
        if (cancelled) return
        usingBackend.current = false
        setConnectionStatus('offline')
      })

    function connectSocket() {
      const ws = new WebSocket(WS_BASE)
      wsRef.current = ws
      ws.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data)
          applyRemoteEvent(type, payload)
        } catch {
          // ignore malformed message
        }
      }
      ws.onclose = () => {
        if (cancelled) return
        setConnectionStatus('offline')
        setTimeout(() => {
          if (!cancelled) connectSocket()
        }, 3000)
      }
      ws.onopen = () => setConnectionStatus('online')
    }

    function applyRemoteEvent(type: string, payload: unknown) {
      switch (type) {
        case 'state:sync':
        case 'state:replaced': {
          const s = payload as PersistedShape
          setTeams(s.teams)
          setMatches(s.matches)
          setSponsors(s.sponsors)
          setPublishedHighlightIds(new Set(s.publishedHighlightIds))
          setAuditLog(s.auditLog)
          setMvpOverridePlayerId(s.mvpOverridePlayerId ?? null)
          setReports(s.reports ?? [])
          setAntiCheatFlags(s.antiCheatFlags ?? [])
          setAnnouncements(s.announcements ?? [])
          setTournamentSettings(s.tournamentSettings ?? DEFAULT_TOURNAMENT_SETTINGS)
          break
        }
        case 'team:updated': {
          const team = payload as Team
          setTeams((list) => list.map((t) => (t.id === team.id ? team : t)))
          break
        }
        case 'teams:replaced': {
          setTeams(payload as Team[])
          break
        }
        case 'team:created': {
          const team = payload as Team
          setTeams((list) => (list.some((t) => t.id === team.id) ? list : [...list, team]))
          break
        }
        case 'match:updated': {
          const match = payload as Match
          setMatches((list) => list.map((m) => (m.id === match.id ? match : m)))
          break
        }
        case 'sponsor:created': {
          const sponsor = payload as Sponsor
          setSponsors((list) => (list.some((s) => s.id === sponsor.id) ? list : [...list, sponsor]))
          break
        }
        case 'sponsor:removed': {
          const { id } = payload as { id: string }
          setSponsors((list) => list.filter((s) => s.id !== id))
          break
        }
        case 'highlights:updated': {
          setPublishedHighlightIds(new Set(payload as string[]))
          break
        }
        case 'mvp:updated': {
          const { mvpOverridePlayerId: id } = payload as { mvpOverridePlayerId: string | null }
          setMvpOverridePlayerId(id)
          break
        }
        case 'audit:new': {
          const entry = payload as AuditEntry
          setAuditLog((log) => [entry, ...log].slice(0, 150))
          break
        }
        case 'report:created': {
          const report = payload as Report
          setReports((list) => (list.some((r) => r.id === report.id) ? list : [report, ...list]))
          break
        }
        case 'report:updated': {
          const report = payload as Report
          setReports((list) => list.map((r) => (r.id === report.id ? report : r)))
          break
        }
        case 'anticheat:updated': {
          const flag = payload as AntiCheatFlag
          setAntiCheatFlags((list) => list.map((item) => item.id === flag.id ? flag : item))
          break
        }
        case 'announcements:updated': setAnnouncements(payload as Announcement[]); break
        case 'tournament-settings:updated': setTournamentSettings(payload as TournamentSettings); break
      }
    }

    return () => {
      cancelled = true
      wsRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Local-only fallback persistence (only relevant when offline) ───────
  useEffect(() => {
    if (usingBackend.current) return
    saveLocal({ teams, matches, sponsors, publishedHighlightIds: [...publishedHighlightIds], auditLog, mvpOverridePlayerId, reports, antiCheatFlags, announcements, tournamentSettings })
  }, [teams, matches, sponsors, publishedHighlightIds, auditLog, mvpOverridePlayerId, reports, antiCheatFlags, announcements, tournamentSettings])

  const pushLocalAudit = (actor: string, action: string) => {
    setAuditLog((log) => [{ id: `audit-${Date.now()}-${log.length}`, timestamp: timestamp(), actor, action }, ...log].slice(0, 150))
  }

  // ── Actions: call the backend when connected, otherwise mutate local state directly ──

  const setTeamStatus: StoreValue['setTeamStatus'] = (teamId, status, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/teams/${teamId}/status`, { status, actor }, token).catch(() => {})
      return
    }
    setTeams((list) => list.map((t) => (t.id === teamId ? { ...t, status } : t)))
    const team = teams.find((t) => t.id === teamId)
    pushLocalAudit(actor, `Set ${team?.name ?? teamId} status to ${status.replace('_', ' ')}`)
  }

  const updateTeamStats: StoreValue['updateTeamStats'] = (teamId, patch, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/teams/${teamId}/stats`, { ...patch, actor }, token).catch(() => {})
      return
    }
    setTeams((list) => {
      const updated = list.map((t) => {
        if (t.id !== teamId) return t
        const merged = { ...t, ...patch }
        const totalPoints = merged.kills + merged.teamWipes * 3 + merged.flagPoints + merged.positionPoints
        return { ...merged, totalPoints }
      })
      const sorted = [...updated].sort((a, b) => b.totalPoints - a.totalPoints)
      const rankById = new Map(sorted.map((t, idx) => [t.id, idx + 1]))
      return updated.map((t) => ({ ...t, rank: rankById.get(t.id) ?? t.rank }))
    })
    const team = teams.find((t) => t.id === teamId)
    pushLocalAudit(actor, `Edited stats for ${team?.name ?? teamId}`)
  }

  const recallMatch: StoreValue['recallMatch'] = (matchId, kind, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/matches/${matchId}/recall`, { kind, actor }, token).catch(() => {})
      return
    }
    setMatches((list) =>
      list.map((m) => {
        if (m.id !== matchId) return m
        return {
          ...m,
          timerSeconds: 1800,
          zone: 1,
          zoneStatus: kind === 'hard' ? 'Hard recall — resetting all players' : 'Match recall — restarting round',
          scoreboard: m.scoreboard.map((row) => ({ ...row, playersAlive: 10, status: 'alive' as const, totalPoints: 0, positionPoints: 0, killPoints: 0, kills: 0, teamWipes: 0, flagPoints: 0, position: null })),
          flag: { status: 'hidden', location: m.flag.location, carrierTeamId: null, captureTimestamp: null },
          events: [],
        }
      }),
    )
    const match = matches.find((m) => m.id === matchId)
    pushLocalAudit(actor, `${kind === 'hard' ? 'Hard recalled' : 'Recalled'} Match ${match?.matchNumber ?? matchId}`)
  }

  const approveMatchResults: StoreValue['approveMatchResults'] = (matchId, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/matches/${matchId}/approve-results`, { actor }, token).catch(() => {})
      return
    }
    const match = matches.find((m) => m.id === matchId)
    pushLocalAudit(actor, `Approved results for Match ${match?.matchNumber ?? matchId}`)
  }

  const addSponsor: StoreValue['addSponsor'] = (sponsor, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson('/api/sponsors', { ...sponsor, actor }, token).catch(() => {})
      return
    }
    const id = `sponsor-${Date.now()}`
    setSponsors((list) => [...list, { ...sponsor, id }])
    pushLocalAudit(actor, `Added sponsor ${sponsor.name} (${sponsor.tier})`)
  }

  const removeSponsor: StoreValue['removeSponsor'] = (sponsorId, actor = 'Admin') => {
    if (usingBackend.current) {
      fetch(`${API_BASE}/api/sponsors/${sponsorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ actor }),
      }).catch(() => {})
      return
    }
    const sponsor = sponsors.find((s) => s.id === sponsorId)
    setSponsors((list) => list.filter((s) => s.id !== sponsorId))
    pushLocalAudit(actor, `Removed sponsor ${sponsor?.name ?? sponsorId}`)
  }

  const toggleHighlightPublished: StoreValue['toggleHighlightPublished'] = (highlightId, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/highlights/${highlightId}/toggle-publish`, { actor }, token).catch(() => {})
      return
    }
    setPublishedHighlightIds((set) => {
      const next = new Set(set)
      if (next.has(highlightId)) next.delete(highlightId)
      else next.add(highlightId)
      return next
    })
    pushLocalAudit(actor, `Toggled publish state for highlight ${highlightId}`)
  }

  const createTeam: StoreValue['createTeam'] = async (input) => {
    if (usingBackend.current) {
      const team = await postJson('/api/teams', input) as Team
      return team
    }
    const usedTags = new Set(teams.map((t) => t.tag))
    const tag = tagFor(input.name, usedTags)
    const colorPair = TEAM_COLOR_PAIRS[teams.length % TEAM_COLOR_PAIRS.length]
    const group = GROUP_LETTERS[teams.length % GROUP_LETTERS.length]
    const newTeam: Team = {
      id: `team-registered-${Date.now()}`,
      name: input.name,
      tag,
      logoSeed: `${tag}-${Date.now()}`,
      colors: { primary: colorPair[0], secondary: colorPair[1] },
      captainId: input.captainName,
      rosterIds: input.rosterEntries,
      status: 'PENDING',
      group,
      rank: teams.length + 1,
      matchesPlayed: 0,
      wins: 0,
      kills: 0,
      teamWipes: 0,
      flagPoints: 0,
      positionPoints: 0,
      totalPoints: 0,
      avgPlacement: 0,
      trend: 'same',
      logoDataUrl: input.logoDataUrl,
    }
    setTeams((list) => [...list, newTeam])
    pushLocalAudit('Registration', `New team registered: ${newTeam.name} (pending review)`)
    return newTeam
  }

  const setTeamLogo: StoreValue['setTeamLogo'] = (teamId, dataUrl, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/teams/${teamId}/logo`, { logoDataUrl: dataUrl, actor }, token).catch(() => {})
      return
    }
    setTeams((list) => list.map((t) => (t.id === teamId ? { ...t, logoDataUrl: dataUrl } : t)))
    const team = teams.find((t) => t.id === teamId)
    pushLocalAudit(actor, `Updated logo for ${team?.name ?? teamId}`)
  }

  const setMvpOverride: StoreValue['setMvpOverride'] = (playerId, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson('/api/mvp-override', { playerId, actor }, token).catch(() => {})
      return
    }
    setMvpOverridePlayerId(playerId)
    pushLocalAudit(actor, playerId ? 'Manually set Tournament MVP override' : 'Cleared Tournament MVP override (back to auto)')
  }

  const submitReport: StoreValue['submitReport'] = async (input) => {
    try {
      const report = await postJson('/api/reports', input) as Report
      usingBackend.current = true
      return report
    } catch {
      usingBackend.current = false
    }

    const report: Report = {
      id: `report-${Date.now()}`,
      category: input.category,
      targetId: input.targetId ?? null,
      targetLabel: input.targetLabel ?? null,
      description: input.description,
      reporterName: input.reporterName?.trim() || 'Anonymous',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    }
    setReports((list) => [report, ...list])
    pushLocalAudit(report.reporterName, `Submitted a ${report.category} report`)
    return report
  }

  const resolveReport: StoreValue['resolveReport'] = (reportId, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/reports/${reportId}/resolve`, {}, token).catch(() => {})
      return
    }
    setReports((list) => list.map((r) => (r.id === reportId ? { ...r, status: 'RESOLVED' } : r)))
    pushLocalAudit(actor, 'Resolved a report')
  }

  const dismissReport: StoreValue['dismissReport'] = (reportId, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/reports/${reportId}/dismiss`, {}, token).catch(() => {})
      return
    }
    setReports((list) => list.map((r) => (r.id === reportId ? { ...r, status: 'DISMISSED' } : r)))
    pushLocalAudit(actor, 'Dismissed a report')
  }

  const updateAntiCheatFlag: StoreValue['updateAntiCheatFlag'] = (flagId, status, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/anticheat/${flagId}`, { status, actor }, token).catch(() => {})
      return
    }
    setAntiCheatFlags((list) => list.map((flag) => flag.id === flagId ? { ...flag, status } : flag))
    pushLocalAudit(actor, `Set anti-cheat flag ${flagId} to ${status}`)
  }

  const addAnnouncement: StoreValue['addAnnouncement'] = (input, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson('/api/announcements', { ...input, actor }, token).catch(() => {})
      return
    }
    const announcement = { ...input, id: `announcement-${Date.now()}`, createdAt: new Date().toISOString(), author: actor }
    setAnnouncements((list) => [announcement, ...list])
    pushLocalAudit(actor, `Published announcement: ${input.title}`)
  }

  const removeAnnouncement: StoreValue['removeAnnouncement'] = (id, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/announcements/${id}/remove`, { actor }, token).catch(() => {})
      return
    }
    setAnnouncements((list) => list.filter((item) => item.id !== id))
    pushLocalAudit(actor, `Removed announcement ${id}`)
  }

  const updateTournamentSettings: StoreValue['updateTournamentSettings'] = (settings, actor = 'Admin') => {
    setTournamentSettings(settings)
    if (usingBackend.current) {
      postJson('/api/tournament-settings', { ...settings, actor }, token).catch(() => {})
      return
    }
    pushLocalAudit(actor, 'Updated tournament settings')
  }

  const updateMatch: StoreValue['updateMatch'] = (matchId, patch, actor = 'Admin') => {
    if (usingBackend.current) {
      postJson(`/api/matches/${matchId}/control`, { ...patch, actor }, token).catch(() => {})
      return
    }
    setMatches((list) => list.map((match) => match.id === matchId ? { ...match, ...patch } : match))
    pushLocalAudit(actor, `Updated controls for Match ${matchId}`)
  }

  const resetDemoData: StoreValue['resetDemoData'] = (actor = 'Admin') => {
    if (usingBackend.current) {
      postJson('/api/reset', { actor }, token).catch(() => {})
      return
    }
    setTeams(clone(initialTeams))
    setMatches(clone(initialMatches))
    setSponsors(clone(initialSponsors))
    setPublishedHighlightIds(new Set(initialHighlights.map((h) => h.id)))
    setMvpOverridePlayerId(null)
    setReports([])
    setAntiCheatFlags([])
    setAnnouncements([])
    setTournamentSettings(DEFAULT_TOURNAMENT_SETTINGS)
    pushLocalAudit(actor, 'Reset all demo data to defaults')
  }

  const value = useMemo<StoreValue>(
    () => ({
      teams, matches, sponsors, publishedHighlightIds, auditLog, mvpOverridePlayerId, connectionStatus, reports, antiCheatFlags, announcements, tournamentSettings,
      setTeamStatus, updateTeamStats, recallMatch, approveMatchResults, addSponsor, removeSponsor, toggleHighlightPublished,
      logAction: pushLocalAudit, createTeam, setTeamLogo, setMvpOverride, resetDemoData,
      submitReport, resolveReport, dismissReport, updateAntiCheatFlag, addAnnouncement, removeAnnouncement, updateTournamentSettings, updateMatch,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teams, matches, sponsors, publishedHighlightIds, auditLog, mvpOverridePlayerId, connectionStatus, reports, antiCheatFlags, announcements, tournamentSettings, token],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

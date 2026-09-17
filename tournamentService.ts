// ─────────────────────────────────────────────────────────────────────────
// TOURNAMENT SERVICE LAYER
//
//   FiveM Server → Tournament Backend → API / WebSocket → (this file) → UI
//
// Every page/component in this app reads data through the functions below
// instead of importing `data/mockData.ts` directly. Today these functions
// resolve instantly from static mock data. Later, they can be reimplemented
// to call the real Tournament Backend (REST for reads, WebSocket for the
// `subscribeLive*` functions) without touching a single component.
// ─────────────────────────────────────────────────────────────────────────

import {
  teams, players, matches, liveMatch, mvpTournament, matchMvps, highlights,
  tournamentHistory, records, sponsors, flagLocations,
} from '../data/mockData'
import type { Match, ScoreboardRow } from '../data/types'

const NETWORK_DELAY_MS = 120

function resolveAfterDelay<T>(value: T): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), NETWORK_DELAY_MS))
}

export const tournamentService = {
  getTeams: () => resolveAfterDelay(teams),
  getTeam: (id: string) => resolveAfterDelay(teams.find((t) => t.id === id) ?? null),
  getPlayers: () => resolveAfterDelay(players),
  getPlayer: (id: string) => resolveAfterDelay(players.find((p) => p.id === id) ?? null),
  getPlayersByTeam: (teamId: string) => resolveAfterDelay(players.filter((p) => p.teamId === teamId)),

  getMatches: () => resolveAfterDelay(matches),
  getMatch: (id: string) => resolveAfterDelay(matches.find((m) => m.id === id) ?? null),
  getLiveMatch: () => resolveAfterDelay(liveMatch),
  getUpcomingMatches: (limit = 6) =>
    resolveAfterDelay(matches.filter((m) => m.status === 'upcoming').slice(0, limit)),
  getCompletedMatches: () => resolveAfterDelay(matches.filter((m) => m.status === 'completed')),

  getStandings: () => resolveAfterDelay([...teams].sort((a, b) => b.totalPoints - a.totalPoints)),

  getTournamentMvp: () => resolveAfterDelay(mvpTournament),
  getMatchMvps: () => resolveAfterDelay(matchMvps),

  getHighlights: () => resolveAfterDelay(highlights),
  getHistory: () => resolveAfterDelay(tournamentHistory),
  getRecords: () => resolveAfterDelay(records),
  getSponsors: () => resolveAfterDelay(sponsors),
  getFlagLocations: () => resolveAfterDelay(flagLocations),

  // ── Live subscription stand-ins ──────────────────────────────────────
  // In production these would open a WebSocket to the Tournament Backend
  // and push scoreboard/event diffs as they happen. For the demo, they
  // gently jitter the live match's scoreboard so the UI's live surfaces
  // (Live page, Match Center) can be built against a "moving" feed today.
  subscribeLiveScoreboard(matchId: string, onUpdate: (rows: ScoreboardRow[]) => void) {
    const match = matches.find((m) => m.id === matchId)
    if (!match) return () => {}
    let rows = match.scoreboard.map((r) => ({ ...r }))
    onUpdate(rows)
    const interval = setInterval(() => {
      rows = rows.map((r) => ({
        ...r,
        playersAlive: Math.max(0, r.playersAlive + (Math.random() > 0.75 ? -1 : 0)),
      }))
      onUpdate(rows)
    }, 4000)
    return () => clearInterval(interval)
  },

  subscribeMatchTimer(match: Match, onTick: (secondsRemaining: number) => void) {
    let remaining = match.timerSeconds
    onTick(remaining)
    const interval = setInterval(() => {
      remaining = Math.max(0, remaining - 1)
      onTick(remaining)
    }, 1000)
    return () => clearInterval(interval)
  },
}

export type TournamentService = typeof tournamentService

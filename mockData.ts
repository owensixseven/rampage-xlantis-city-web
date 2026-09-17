import type {
  Team, Player, Match, ScoreboardRow, MatchEvent, MvpEntry, Highlight,
  TournamentHistoryEntry, RecordEntry, Sponsor, FlagLocationOption, HighlightCategory,
} from './types'
import {
  mulberry32, pick, randInt, FIRST_NAMES,
  HANDLES, APOCALYPSE_LOCATIONS,
} from './generator-utils'
import { TEAM_NAMES } from './teamNames'
import { ROSTER_TEXT, buildRosterFromText, setUnmatchedRosterLabels } from './playerRoster'
import { tagFor } from './teamTag'
import { TEAM_STATS_OVERRIDES } from './teamStatsOverride'
import { MVP_OVERRIDE_PLAYER_NAME } from './mvpOverride'

// This module is the ONLY place that invents demo numbers. Everything here
// is clearly synthetic and stands in for what will later arrive from the
// FiveM Tournament Backend over the API/WebSocket layer in `lib/mockApi.ts`.
// DEMO DATA — not official RAMPAGE results.

const rng = mulberry32(RAMPAGE_SEED())
function RAMPAGE_SEED() {
  return 91827
}

const TEAM_COUNT = 100
const GROUPS = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)) // A..J
// Team names come from src/data/teamNames.ts — edit that file to rename teams.

const COLOR_PAIRS: [string, string][] = [
  ['#ff7a1a', '#14181c'], ['#4dc8e0', '#0a0c0e'], ['#e8b400', '#1b2025'],
  ['#ff3d3d', '#14181c'], ['#2fe0a8', '#0f1215'], ['#c7cdd6', '#14181c'],
  ['#c97a3d', '#0a0c0e'], ['#9d6bff', '#14181c'], ['#5ee6ff', '#0a0c0e'],
  ['#ff8fa3', '#14181c'],
]

export const teams: Team[] = (() => {
  const usedTags = new Set<string>()
  const list: Team[] = []
  for (let i = 0; i < TEAM_COUNT; i++) {
    const name = TEAM_NAMES[i] ?? `Team ${i + 1}`
    const tag = tagFor(name, usedTags)
    const group = GROUPS[i % GROUPS.length]
    const kills = randInt(rng, 12, 140)
    const teamWipes = randInt(rng, 0, 9)
    const flagPoints = pick(rng, [0, 0, 0, 2, 3, 5, 8])
    const positionPoints = randInt(rng, 0, 60)
    const totalPoints = kills + teamWipes * 3 + flagPoints + positionPoints
    list.push({
      id: `team-${i + 1}`,
      name,
      tag,
      logoSeed: `${tag}-${i}`,
      colors: { primary: COLOR_PAIRS[i % COLOR_PAIRS.length][0], secondary: COLOR_PAIRS[i % COLOR_PAIRS.length][1] },
      captainId: '',
      rosterIds: [],
      status: i < 92 ? 'APPROVED' : i < 96 ? 'LOCKED' : i < 98 ? 'UNDER_REVIEW' : i < 99 ? 'PENDING' : 'REJECTED',
      group,
      rank: 0,
      matchesPlayed: randInt(rng, 3, 8),
      wins: randInt(rng, 0, 4),
      kills,
      teamWipes,
      flagPoints,
      positionPoints,
      totalPoints,
      avgPlacement: Number((randInt(rng, 15, 95) / 10).toFixed(1)),
      trend: pick(rng, ['up', 'down', 'same']),
    })
  }

  // Apply any manual overrides from teamStatsOverride.ts, then recompute
  // totals and ranks so edits there are reflected everywhere.
  for (const team of list) {
    const override = TEAM_STATS_OVERRIDES[team.name]
    if (!override) continue
    Object.assign(team, override)
    team.totalPoints = team.kills + team.teamWipes * 3 + team.flagPoints + team.positionPoints
  }

  list.sort((a, b) => b.totalPoints - a.totalPoints)
  list.forEach((t, idx) => (t.rank = idx + 1))
  return list
})()

const ROLES: Player['role'][] = ['IGL', 'Entry', 'Support', 'Sniper', 'Flex']

const { rosterByTeamId, unmatchedLabels } = buildRosterFromText(
  ROSTER_TEXT,
  teams.map((t) => ({ id: t.id, name: t.name, tag: t.tag })),
)
setUnmatchedRosterLabels(unmatchedLabels)

export const players: Player[] = (() => {
  const list: Player[] = []
  let pid = 1
  for (const team of teams) {
    const realNames = rosterByTeamId.get(team.id) ?? []
    const rosterSize = realNames.length > 0 ? realNames.length : 4

    for (let r = 0; r < rosterSize; r++) {
      const name =
        realNames.length > 0
          ? realNames[r]
          : `${pick(rng, FIRST_NAMES)} "${pick(rng, HANDLES)}"`
      const kills = randInt(rng, 4, 60)
      const deaths = randInt(rng, 4, 40)
      const id = `player-${pid}`
      list.push({
        id,
        name,
        playerId: `RGX-${1000 + pid}`,
        teamId: team.id,
        avatarSeed: `${team.tag}${pid}`,
        role: ROLES[r % ROLES.length],
        matches: team.matchesPlayed,
        kills,
        deaths,
        damage: kills * randInt(rng, 90, 160) + randInt(rng, 200, 900),
        assists: randInt(rng, 2, 22),
        survivalTimeSec: randInt(rng, 240, 1500),
        recallsUsed: randInt(rng, 0, 1),
        avgPlacement: Number((randInt(rng, 15, 90) / 10).toFixed(1)),
        mvpScore: kills * 3 + randInt(rng, 0, 40),
        tournamentRank: 0,
      })
      if (r === 0) team.captainId = id
      team.rosterIds.push(id)
      pid++
    }
  }
  list.sort((a, b) => b.mvpScore - a.mvpScore)
  list.forEach((p, idx) => (p.tournamentRank = idx + 1))
  return list
})()

const POSITION_POINTS = [10, 7, 6, 5, 4, 3, 2, 1, 0, 0]

function buildScoreboard(matchTeamIds: string[], live: boolean): ScoreboardRow[] {
  const order = [...matchTeamIds].sort(() => rng() - 0.5)
  return order.map((teamId, idx) => {
    const kills = randInt(rng, 2, 28)
    const teamWipes = randInt(rng, 0, 2)
    const flagPoints = idx === 0 ? pick(rng, [0, 3, 5]) : 0
    const positionPoints = live ? 0 : POSITION_POINTS[idx] ?? 0
    return {
      teamId,
      rank: idx + 1,
      position: live ? null : idx + 1,
      positionPoints,
      kills,
      killPoints: kills,
      teamWipes,
      flagPoints,
      totalPoints: positionPoints + kills + teamWipes * 3 + flagPoints,
      playersAlive: live ? randInt(rng, 0, 10) : 0,
      status: (live ? (randInt(rng, 0, 10) > 1 ? 'alive' : 'eliminated') : 'eliminated') as ScoreboardRow['status'],
    }
  }).sort((a, b) => b.totalPoints - a.totalPoints)
}

function buildEvents(matchId: string, teamIds: string[]): MatchEvent[] {
  const types: MatchEvent['type'][] = [
    'TEAM_ELIMINATED', 'TEAM_WIPE', 'FLAG_CAPTURED', 'FLAG_CARRIER_ELIMINATED',
    'IMPORTANT_MOVEMENT', 'FINAL_ZONE', 'DRONE_DEPLOYED',
  ]
  const count = randInt(rng, 6, 10)
  const events: MatchEvent[] = []
  for (let i = 0; i < count; i++) {
    const type = pick(rng, types)
    const teamId = pick(rng, teamIds)
    const secondary = pick(rng, teamIds.filter((t) => t !== teamId))
    const minute = randInt(rng, 1, 32)
    const detailMap: Record<string, string> = {
      TEAM_ELIMINATED: 'was eliminated with no players remaining',
      TEAM_WIPE: 'wiped an entire enemy squad',
      FLAG_CAPTURED: 'captured the flag',
      FLAG_CARRIER_ELIMINATED: "eliminated the enemy flag carrier",
      IMPORTANT_MOVEMENT: 'made a decisive rotation toward the zone',
      FINAL_ZONE: 'holds the final zone',
      DRONE_DEPLOYED: 'deployed the recon drone',
    }
    events.push({
      id: `${matchId}-evt-${i}`,
      matchId,
      type,
      teamId,
      secondaryTeamId: type === 'TEAM_WIPE' || type === 'FLAG_CARRIER_ELIMINATED' ? secondary : undefined,
      timestamp: `${String(Math.floor(minute)).padStart(2, '0')}:${String(randInt(rng, 0, 59)).padStart(2, '0')}`,
      detail: detailMap[type],
      pointsAwarded: type === 'TEAM_WIPE' ? 3 : type === 'FLAG_CAPTURED' ? 3 : type === 'FLAG_CARRIER_ELIMINATED' ? 2 : undefined,
    })
  }
  return events.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
}

function groupTeams(group: string, count = 10) {
  return teams.filter((t) => t.group === group).slice(0, count).map((t) => t.id)
}

export const matches: Match[] = (() => {
  const list: Match[] = []
  let num = 1

  // Group stage: 10 groups x matches
  GROUPS.forEach((g) => {
    const ids = groupTeams(g)
    for (let m = 0; m < 3; m++) {
      const status = num === 24 ? 'live' : num < 24 ? 'completed' : 'upcoming'
      list.push({
        id: `match-${num}`,
        matchNumber: num,
        stage: 'Group Stage',
        group: g,
        date: `2026-09-${String(6 + m).padStart(2, '0')}`,
        time: `${18 + m}:00 IST`,
        status,
        teamIds: ids,
        zone: status === 'live' ? randInt(rng, 2, 5) : 5,
        zoneStatus: status === 'live' ? 'Closing — Zone 4 active' : 'Final zone settled',
        flag: {
          status: status === 'live' ? 'carried' : 'captured',
          location: pick(rng, APOCALYPSE_LOCATIONS),
          carrierTeamId: pick(rng, ids),
          captureTimestamp: status !== 'upcoming' ? '18:42' : null,
        },
        drone: { deployed: status !== 'upcoming', operatorTeamId: status !== 'upcoming' ? pick(rng, ids) : null, deployedAt: status !== 'upcoming' ? '00:05:12' : null },
        timerSeconds: status === 'live' ? randInt(rng, 300, 1400) : status === 'completed' ? 0 : 1800,
        scoreboard: status !== 'upcoming' ? buildScoreboard(ids, status === 'live') : [],
        events: status !== 'upcoming' ? buildEvents(`match-${num}`, ids) : [],
      })
      num++
    }
  })

  // Knockout (20 teams), Semis (10), Grand Final (10) — upcoming placeholders
  const knockoutIds = teams.slice(0, 20).map((t) => t.id)
  list.push({
    id: `match-${num}`, matchNumber: num, stage: 'Knockout', group: null,
    date: '2026-09-20', time: '19:00 IST', status: 'upcoming', teamIds: knockoutIds,
    zone: 5, zoneStatus: 'Not started', flag: { status: 'hidden', location: 'Location revealed at match start', carrierTeamId: null, captureTimestamp: null },
    drone: { deployed: false, operatorTeamId: null, deployedAt: null }, timerSeconds: 1800, scoreboard: [], events: [],
  })
  num++
  const semiIds = teams.slice(0, 10).map((t) => t.id)
  list.push({
    id: `match-${num}`, matchNumber: num, stage: 'Semi Final', group: null,
    date: '2026-09-27', time: '19:00 IST', status: 'upcoming', teamIds: semiIds,
    zone: 5, zoneStatus: 'Not started', flag: { status: 'hidden', location: 'Location revealed at match start', carrierTeamId: null, captureTimestamp: null },
    drone: { deployed: false, operatorTeamId: null, deployedAt: null }, timerSeconds: 1800, scoreboard: [], events: [],
  })
  num++
  const finalIds = teams.slice(0, 10).map((t) => t.id)
  list.push({
    id: `match-${num}`, matchNumber: num, stage: 'Grand Final', group: null,
    date: '2026-10-04', time: '20:00 IST', status: 'upcoming', teamIds: finalIds,
    zone: 5, zoneStatus: 'Not started', flag: { status: 'hidden', location: 'Location revealed at match start', carrierTeamId: null, captureTimestamp: null },
    drone: { deployed: false, operatorTeamId: null, deployedAt: null }, timerSeconds: 1800, scoreboard: [], events: [],
  })

  return list
})()

export const liveMatch = matches.find((m) => m.status === 'live') ?? null

export function buildMvpEntry(player: Player): MvpEntry {
  return {
    playerId: player.id,
    teamId: player.teamId,
    scope: 'tournament',
    score: player.mvpScore,
    breakdown: {
      kills: player.kills,
      damage: player.damage,
      survival: player.survivalTimeSec,
      placement: 9,
      teamWipeContribution: 6,
      flagContribution: 4,
    },
  }
}

export const mvpTournament: MvpEntry = buildMvpEntry(
  (() => {
    const overrideName = MVP_OVERRIDE_PLAYER_NAME
    const overridden = overrideName ? players.find((p) => p.name.toLowerCase() === overrideName.toLowerCase()) : undefined
    return overridden ?? players[0]
  })(),
)

export const matchMvps: MvpEntry[] = matches
  .filter((m) => m.status === 'completed')
  .slice(0, 6)
  .map((m) => {
    const teamId = pick(rng, m.teamIds)
    const teamPlayers = players.filter((p) => p.teamId === teamId)
    const p = pick(rng, teamPlayers)
    return {
      playerId: p.id, teamId, matchId: m.id, scope: 'match', score: p.mvpScore,
      breakdown: { kills: p.kills, damage: p.damage, survival: p.survivalTimeSec, placement: 1, teamWipeContribution: 3, flagContribution: 0 },
    }
  })

const HIGHLIGHT_CATEGORIES: HighlightCategory[] = [
  'FIRST_BLOOD', 'AGGRESSIVE_PUSH', 'IMPORTANT_ROTATION', 'ZONE_ROTATION',
  'STRATEGIC_REPOSITION', 'VEHICLE_ROTATION', 'MULTI_KILL', 'TEAM_WIPE',
  'CLOSE_ESCAPE', 'FLAG_CAPTURE', 'FLAG_CARRIER_ELIMINATION', 'FINAL_ZONE',
  'CHAMPION_MOMENT',
]

export const highlights: Highlight[] = (() => {
  const completed = matches.filter((m) => m.status === 'completed')
  const list: Highlight[] = []
  for (let i = 0; i < 24; i++) {
    const m = pick(rng, completed)
    const teamId = pick(rng, m.teamIds)
    const teamPlayers = players.filter((p) => p.teamId === teamId)
    const p = pick(rng, teamPlayers)
    const category = HIGHLIGHT_CATEGORIES[i % HIGHLIGHT_CATEGORIES.length]
    list.push({
      id: `highlight-${i + 1}`,
      matchId: m.id,
      category,
      timestamp: `${String(randInt(rng, 1, 32)).padStart(2, '0')}:${String(randInt(rng, 0, 59)).padStart(2, '0')}`,
      teamId,
      playerId: p.id,
      location: pick(rng, APOCALYPSE_LOCATIONS),
      title: `${p.name.split(' "')[1]?.replace('"', '') ?? p.name} — ${category.replace(/_/g, ' ').toLowerCase()}`,
    })
  }
  return list
})()

export const tournamentHistory: TournamentHistoryEntry[] = [
  {
    id: 'season-0',
    name: 'RAMPAGE — Season Zero',
    season: 'Season 0 · 2025',
    championTeamId: teams.find((team) => team.name === 'TVA')!.id,
    runnerUpTeamId: teams.find((team) => team.name === 'TVA X CSK')!.id,
    thirdTeamId: teams.find((team) => team.name === 'TVA X VT')!.id,
    mvpPlayerId: players.find((player) => player.name.toLowerCase() === 'neelakandan')!.id,
    completedOn: '2025-11-30',
  },
]

export const records: RecordEntry[] = [
  { id: 'r1', label: 'Highest Match Kills (Team)', value: '31', holderName: teams[2].name, context: 'Match 14, Group C' },
  { id: 'r2', label: 'Highest Team Score (Single Match)', value: '48 pts', holderName: teams[5].name, context: 'Match 9, Group B' },
  { id: 'r3', label: 'Most Tournament Kills', value: `${teams[0].kills}`, holderName: teams[0].name, context: 'Group Stage cumulative' },
  { id: 'r4', label: 'Most Tournament Points', value: `${teams[0].totalPoints}`, holderName: teams[0].name, context: 'Group Stage cumulative' },
  { id: 'r5', label: 'Fastest Team Wipe', value: '11s', holderName: teams[9].name, context: 'Match 21, Group H' },
  { id: 'r6', label: 'Longest Survival (Player)', value: '31:42', holderName: players[3].name, context: 'Match 4, Group A' },
  { id: 'r7', label: 'Most MVP Awards', value: '3', holderName: players[0].name, context: 'Across all completed matches' },
]

export const sponsors: Sponsor[] = [
  { id: 's1', name: 'Overtake Energy', tier: 'main', wordmarkInitial: 'O' },
  { id: 's2', name: 'Ferrovax Gaming Gear', tier: 'tournament', wordmarkInitial: 'F' },
  { id: 's3', name: 'Nordlys ISP', tier: 'tournament', wordmarkInitial: 'N' },
  { id: 's4', name: 'Bastion Peripherals', tier: 'partner', wordmarkInitial: 'B' },
  { id: 's5', name: 'Kestrel Energy Drinks', tier: 'partner', wordmarkInitial: 'K' },
  { id: 's6', name: 'Circuitworks', tier: 'partner', wordmarkInitial: 'C' },
]

export const flagLocations: FlagLocationOption[] = APOCALYPSE_LOCATIONS.map((name, i) => ({
  id: `loc-${i}`, name, zoneArea: `Sector ${String.fromCharCode(65 + (i % 5))}`, approved: i % 7 !== 0,
}))

export function teamById(id: string) {
  return teams.find((t) => t.id === id)
}
export function playerById(id: string) {
  return players.find((p) => p.id === id)
}
export function matchById(id: string) {
  return matches.find((m) => m.id === id)
}

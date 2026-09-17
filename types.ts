// Domain types for XLANTIS CITY — RAMPAGE.
// These shapes are what today's mock service returns, and what the future
// FiveM Tournament Backend (API / WebSocket) should return unchanged, so
// that swapping `lib/mockApi.ts` for a real client requires no UI changes.

export type MatchStage =
  | 'Group Stage'
  | 'Knockout'
  | 'Semi Final'
  | 'Grand Final'

export type MatchStatus = 'upcoming' | 'live' | 'completed'

export type TeamRegistrationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'LOCKED'

export type PlayerRole = 'Player' | 'Team Manager' | 'Caster' | 'Referee' | 'Admin' | 'Super Admin'

export interface TeamColors {
  primary: string
  secondary: string
}

export interface Player {
  id: string
  name: string
  playerId: string
  teamId: string
  avatarSeed: string
  role: 'IGL' | 'Entry' | 'Support' | 'Sniper' | 'Flex'
  matches: number
  kills: number
  deaths: number
  damage: number
  assists: number
  survivalTimeSec: number
  recallsUsed: number
  avgPlacement: number
  mvpScore: number
  tournamentRank: number
}

export interface Team {
  id: string
  name: string
  tag: string
  logoSeed: string
  colors: TeamColors
  captainId: string
  rosterIds: string[]
  status: TeamRegistrationStatus
  group: string | null
  rank: number
  matchesPlayed: number
  wins: number
  kills: number
  teamWipes: number
  flagPoints: number
  positionPoints: number
  totalPoints: number
  avgPlacement: number
  playersAlive?: number
  trend: 'up' | 'down' | 'same'
  logoDataUrl?: string
}

export interface ScoreboardRow {
  teamId: string
  rank: number
  position: number | null
  positionPoints: number
  kills: number
  killPoints: number
  teamWipes: number
  flagPoints: number
  totalPoints: number
  playersAlive: number
  status: 'alive' | 'eliminated' | 'wiped'
}

export type MatchEventType =
  | 'TEAM_ELIMINATED'
  | 'TEAM_WIPE'
  | 'FLAG_CAPTURED'
  | 'FLAG_CARRIER_ELIMINATED'
  | 'IMPORTANT_MOVEMENT'
  | 'FINAL_ZONE'
  | 'DRONE_DEPLOYED'

export interface MatchEvent {
  id: string
  matchId: string
  type: MatchEventType
  teamId?: string
  secondaryTeamId?: string
  timestamp: string
  detail: string
  pointsAwarded?: number
}

export interface FlagState {
  status: 'hidden' | 'active' | 'carried' | 'captured'
  location: string
  carrierTeamId: string | null
  captureTimestamp: string | null
}

export interface DroneState {
  deployed: boolean
  operatorTeamId: string | null
  deployedAt: string | null
}

export interface Match {
  id: string
  matchNumber: number
  stage: MatchStage
  group: string | null
  date: string
  time: string
  status: MatchStatus
  teamIds: string[]
  zone: number
  zoneStatus: string
  flag: FlagState
  drone: DroneState
  timerSeconds: number
  scoreboard: ScoreboardRow[]
  events: MatchEvent[]
  notes?: string
}

export type AntiCheatFlagStatus = 'open' | 'cleared' | 'banned'

export interface AntiCheatFlag {
  id: string
  playerId: string
  playerName: string
  teamName: string
  reason: string
  status: AntiCheatFlagStatus
  createdAt: string
}

export interface Announcement {
  id: string
  title: string
  message: string
  createdAt: string
  author: string
}

export interface TournamentSettings {
  name: string
  season: string
  status: 'upcoming' | 'live' | 'completed'
  prizePool: string
  registrationOpen: boolean
}

export interface MvpEntry {
  playerId: string
  teamId: string
  matchId?: string
  scope: 'match' | 'tournament'
  score: number
  breakdown: {
    kills: number
    damage: number
    survival: number
    placement: number
    teamWipeContribution: number
    flagContribution: number
  }
}

export type HighlightCategory =
  | 'FIRST_BLOOD'
  | 'AGGRESSIVE_PUSH'
  | 'IMPORTANT_ROTATION'
  | 'ZONE_ROTATION'
  | 'STRATEGIC_REPOSITION'
  | 'VEHICLE_ROTATION'
  | 'MULTI_KILL'
  | 'TEAM_WIPE'
  | 'CLOSE_ESCAPE'
  | 'FLAG_CAPTURE'
  | 'FLAG_CARRIER_ELIMINATION'
  | 'FINAL_ZONE'
  | 'CHAMPION_MOMENT'

export interface Highlight {
  id: string
  matchId: string
  category: HighlightCategory
  timestamp: string
  teamId: string
  playerId: string
  location: string
  title: string
}

export interface TournamentHistoryEntry {
  id: string
  name: string
  season: string
  championTeamId: string
  runnerUpTeamId: string
  thirdTeamId: string
  mvpPlayerId: string
  completedOn: string
}

export interface RecordEntry {
  id: string
  label: string
  value: string
  holderName: string
  context: string
}

export interface Sponsor {
  id: string
  name: string
  tier: 'main' | 'tournament' | 'partner' | 'team'
  wordmarkInitial: string
}

export interface FlagLocationOption {
  id: string
  name: string
  zoneArea: string
  approved: boolean
}

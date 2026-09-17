// ─────────────────────────────────────────────────────────────────────────
// MANUALLY-MANAGED TEAM STANDINGS
//
// By default every team's kills/wipes/flag points/position points are
// randomly generated demo numbers. To set REAL numbers for a team, add an
// entry here keyed by the team's exact name (as written in teamNames.ts).
// Any field you leave out keeps its random default — you don't need to
// fill in all four every time.
//
// Total points are recalculated automatically as:
//   kills + (teamWipes * 3) + flagPoints + positionPoints
// (matching the scoring rules on the Rules page), so you never need to set
// totalPoints yourself — just the four inputs below.
//
// Example:
//   'TVA': { kills: 42, teamWipes: 3, flagPoints: 8, positionPoints: 21 },
//
// Teams not listed here keep their random demo numbers.
// ─────────────────────────────────────────────────────────────────────────

export interface TeamStatsOverride {
  kills?: number
  teamWipes?: number
  flagPoints?: number
  positionPoints?: number
  matchesPlayed?: number
  wins?: number
  avgPlacement?: number
}

export const TEAM_STATS_OVERRIDES: Record<string, TeamStatsOverride> = {
  // 'TVA': { kills: 42, teamWipes: 3, flagPoints: 8, positionPoints: 21 },
  // 'CSK': { kills: 55, teamWipes: 5, flagPoints: 3, positionPoints: 30 },
}

export type ReportCategory = 'player' | 'team' | 'match' | 'bug'
export type ReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED'

export interface Report {
  id: string
  category: ReportCategory
  targetId: string | null
  targetLabel: string | null
  description: string
  reporterName: string
  status: ReportStatus
  createdAt: string
}

export const REPORT_CATEGORY_LABEL: Record<ReportCategory, string> = {
  player: 'Report a Player',
  team: 'Report a Team',
  match: 'Report a Match',
  bug: 'Report a Bug',
}

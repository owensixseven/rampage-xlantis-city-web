import { PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Highlight } from '../../data/types'
import { matchById, playerById, teamById } from '../../data/mockData'
import { Badge } from '../ui/Badge'

const CATEGORY_LABEL: Record<string, string> = {
  FIRST_BLOOD: 'First Blood', AGGRESSIVE_PUSH: 'Aggressive Push', IMPORTANT_ROTATION: 'Important Rotation',
  ZONE_ROTATION: 'Zone Rotation', STRATEGIC_REPOSITION: 'Strategic Reposition', VEHICLE_ROTATION: 'Vehicle Rotation',
  MULTI_KILL: 'Multi-Kill', TEAM_WIPE: 'Team Wipe', CLOSE_ESCAPE: 'Close Escape', FLAG_CAPTURE: 'Flag Capture',
  FLAG_CARRIER_ELIMINATION: 'Flag Carrier Elimination', FINAL_ZONE: 'Final Zone', CHAMPION_MOMENT: 'Champion Moment',
}

export function HighlightCard({ highlight, index = 0 }: { highlight: Highlight; index?: number }) {
  const team = teamById(highlight.teamId)
  const player = playerById(highlight.playerId)
  const match = matchById(highlight.matchId)

  return (
    <motion.div className="group overflow-hidden border border-line bg-panel transition-colors hover:border-signal/40" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.4 }} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <div
        className="relative flex aspect-video items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${team?.colors.primary}22, #0a0c0e)` }}
      >
        <div className="grid-overlay absolute inset-0 opacity-20" />
        <PlayCircle size={38} className="relative text-ink/70 transition-transform group-hover:scale-110 group-hover:text-signal" />
        <span className="absolute right-2 top-2 border border-line bg-void/80 px-1.5 py-0.5 font-mono text-[10px] text-ink-dim">
          {highlight.timestamp}
        </span>
        <span className="absolute bottom-2 left-2">
          <Badge tone="signal">{CATEGORY_LABEL[highlight.category]}</Badge>
        </span>
      </div>
      <div className="p-3.5">
        <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
          {player?.name}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-mute">
          {team?.name} · Match {match?.matchNumber} · {highlight.location}
        </div>
      </div>
    </motion.div>
  )
}

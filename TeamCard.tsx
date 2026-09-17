import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus, Crosshair, Skull } from 'lucide-react'
import type { Team } from '../../data/types'
import { Badge } from '../ui/Badge'
import { TeamBadge } from './TeamBadge'
import { AnimatedNumber } from '../ui/StatCounter'

const STATUS_TONE = {
  APPROVED: 'live', LOCKED: 'data', UNDER_REVIEW: 'signal', PENDING: 'neutral', REJECTED: 'hazard',
} as const

export function TeamCard({ team, index = 0 }: { team: Team; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.4 }} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
    <NavLink
      to={`/teams/${team.id}`}
      className="group block border border-line bg-panel p-4 transition-colors hover:border-signal/40 hover:bg-panel-raised"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <TeamBadge team={team} size="lg" />
          <div>
            <div className="font-display text-base font-semibold uppercase tracking-wide text-ink group-hover:text-signal">
              {team.name}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
              Group {team.group} · Rank #{team.rank}
            </div>
          </div>
        </div>
        <TrendIcon trend={team.trend} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line-soft pt-3 font-mono text-xs tabular">
        <Stat icon={<Crosshair size={11} />} label="Kills" value={team.kills} />
        <Stat icon={<Skull size={11} />} label="Wipes" value={team.teamWipes} />
        <Stat label="Points" value={team.totalPoints} highlight />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Badge tone={STATUS_TONE[team.status]}>{team.status.replace('_', ' ')}</Badge>
        <span className="font-mono text-[10px] text-ink-mute">Avg. place {team.avgPlacement}</span>
      </div>
    </NavLink>
    </motion.div>
  )
}

function Stat({ icon, label, value, highlight = false }: { icon?: React.ReactNode; label: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <div className={`flex items-center gap-1 text-base font-semibold ${highlight ? 'text-signal' : 'text-ink'}`}>
        {icon}
        <AnimatedNumber value={value} />
      </div>
      <div className="text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
    </div>
  )
}

function TrendIcon({ trend }: { trend: Team['trend'] }) {
  if (trend === 'up') return <TrendingUp size={16} className="text-live" />
  if (trend === 'down') return <TrendingDown size={16} className="text-hazard" />
  return <Minus size={16} className="text-ink-mute" />
}

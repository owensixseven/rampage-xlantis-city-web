import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import type { Match } from '../../data/types'
import { useStore } from '../../lib/store'
import { Badge, LiveDot } from '../ui/Badge'
import { TeamBadge } from '../teams/TeamBadge'

export function MatchCard({ match, index = 0 }: { match: Match; index?: number }) {
  const { teams: allTeams } = useStore()
  const teams = match.teamIds.slice(0, 4).map((id) => allTeams.find((t) => t.id === id))
  const extra = match.teamIds.length - 4

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.4 }} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
    <NavLink
      to={`/matches/${match.id}`}
      className="group block border border-line bg-panel p-4 transition-colors hover:border-signal/40 hover:bg-panel-raised"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-mute">
          Match {String(match.matchNumber).padStart(2, '0')} · {match.stage}
          {match.group ? ` · Group ${match.group}` : ''}
        </span>
        {match.status === 'live' ? (
          <Badge tone="hazard"><LiveDot /> Live</Badge>
        ) : match.status === 'completed' ? (
          <Badge tone="neutral">Completed</Badge>
        ) : (
          <Badge tone="data">Upcoming</Badge>
        )}
      </div>

      <div className="mt-3 flex -space-x-2">
        {teams.map((t) => t && (
          <div key={t.id} title={t.name} className="border-2 border-panel">
            <TeamBadge team={t} size="md" />
          </div>
        ))}
        {extra > 0 && (
          <span className="flex h-8 w-8 items-center justify-center border-2 border-panel bg-panel-hi text-[10px] font-semibold text-ink-dim">
            +{extra}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 border-t border-line-soft pt-3 font-mono text-[11px] text-ink-dim">
        <span className="flex items-center gap-1.5"><Calendar size={12} /> {match.date}</span>
        <span className="flex items-center gap-1.5"><Clock size={12} /> {match.time}</span>
      </div>
    </NavLink>
    </motion.div>
  )
}

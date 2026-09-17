import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Player } from '../../data/types'
import { teamById } from '../../data/mockData'
import { kd } from '../../lib/format'

export function PlayerCard({ player, index = 0 }: { player: Player; index?: number }) {
  const team = teamById(player.teamId)
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: Math.min(index * 0.045, 0.4), duration: 0.4 }} whileHover={{ x: 4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
    <NavLink
      to={`/players/${player.id}`}
      className="flex items-center justify-between gap-4 border border-line bg-panel px-4 py-3 transition-colors hover:border-signal/40 hover:bg-panel-raised"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center font-display text-sm font-bold text-void"
          style={{ backgroundColor: team?.colors.primary }}
        >
          {player.name.split('"')[1]?.slice(0, 2).toUpperCase() ?? player.name.slice(0, 2)}
        </span>
        <div>
          <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{player.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
            {team?.name} · {player.role}
          </div>
        </div>
      </div>
      <div className="hidden gap-6 font-mono text-xs tabular text-ink-dim sm:flex">
        <div className="text-center"><div className="text-ink">{player.kills}</div><div className="text-[10px] text-ink-mute">Kills</div></div>
        <div className="text-center"><div className="text-ink">{kd(player.kills, player.deaths)}</div><div className="text-[10px] text-ink-mute">K/D</div></div>
        <div className="text-center"><div className="text-signal">#{player.tournamentRank}</div><div className="text-[10px] text-ink-mute">Rank</div></div>
      </div>
    </NavLink>
    </motion.div>
  )
}

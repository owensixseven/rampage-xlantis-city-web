import { Crosshair, Flag, HeartPulse, Skull, Target, Trophy } from 'lucide-react'
import type { MvpEntry } from '../../data/types'
import { playerById, teamById } from '../../data/mockData'
import { formatInr, formatSeconds } from '../../lib/format'

export function MvpSpotlight({ entry }: { entry: MvpEntry }) {
  const player = playerById(entry.playerId)
  const team = teamById(entry.teamId)
  if (!player || !team) return null

  return (
    <div className="relative overflow-hidden border border-signal/30 bg-gradient-to-br from-panel via-panel to-signal/[0.06] p-6 md:p-10">
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center font-display text-2xl font-bold text-void md:h-24 md:w-24 md:text-3xl clip-tactical-sm"
            style={{ backgroundColor: team.colors.primary }}
          >
            {player.name.split('"')[1]?.slice(0, 2).toUpperCase() ?? player.name.slice(0, 2)}
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
              Tournament MVP
            </div>
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-ink md:text-4xl">
              {player.name}
            </h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-dim">
              {team.name} · {player.role} · {player.playerId}
            </p>
          </div>
        </div>

        <div className="border border-rank-gold/40 bg-rank-gold/10 px-6 py-4 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-rank-gold">MVP Prize</div>
          <div className="font-display text-2xl font-bold text-rank-gold md:text-3xl">{formatInr(75000)}</div>
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-3 lg:grid-cols-6">
        <MvpStat icon={<Crosshair size={14} />} label="Kills" value={entry.breakdown.kills} />
        <MvpStat icon={<Target size={14} />} label="Damage" value={entry.breakdown.damage.toLocaleString('en-IN')} />
        <MvpStat icon={<HeartPulse size={14} />} label="Survival" value={formatSeconds(entry.breakdown.survival)} />
        <MvpStat icon={<Trophy size={14} />} label="Placement" value={`#${entry.breakdown.placement}`} />
        <MvpStat icon={<Skull size={14} />} label="Wipe Contrib." value={entry.breakdown.teamWipeContribution} />
        <MvpStat icon={<Flag size={14} />} label="Flag Contrib." value={entry.breakdown.flagContribution} />
      </div>
    </div>
  )
}

function MvpStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 font-mono text-lg font-semibold tabular text-ink">
        {icon} {value}
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
    </div>
  )
}
